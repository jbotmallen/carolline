// scripts/prefill-database.ts
import { db } from "../db/index.js";
import { documents, chunks, embeddings } from "../db/schema";
import { extractText, cleanText } from "../lib/text-extraction";
import { semanticChunk } from "../lib/chunking";
import { generateEmbeddingsBatch } from "../lib/embeddings";
import { documentSchema, chunkSchema } from "../lib/validation";
import path from "path";
import { sql } from "drizzle-orm";
import { DocumentConfig } from "../lib/types";

// 🔹 Helper to convert JS array → Postgres vector string
function toPgVector(arr: number[]) {
  return `[${arr.join(",")}]`;
}

/**
 * Main prefill function
 */
async function prefillDatabase(documentsToProcess: DocumentConfig[]) {
  console.log("Starting database prefill process...\n");

  for (const config of documentsToProcess) {
    console.log(`Processing: ${config.title}`);
    console.log(`File: ${config.filePath}`);

    try {
      // Step 1: Extract text
      console.log("  → Extracting text...");
      const extracted = await extractText(config.filePath);
      const cleanedText = cleanText(extracted.text);
      console.log(`  → Extracted ${cleanedText.length} characters`);

      // Step 2: Insert document
      console.log("  → Inserting document record...");
      const validatedDoc = documentSchema.parse({
        title: config.title,
        type: config.type,
        version: config.version,
        metadata: {
          ...config.metadata,
          pages: extracted.pages,
          originalFilename: path.basename(config.filePath),
        },
      });

      const [document] = await db.insert(documents).values(validatedDoc).returning();
      console.log(`  → Document inserted with ID: ${document.id}`);

      // Step 3: Chunk the text
      console.log("  → Chunking text...");
      const textChunks = semanticChunk(cleanedText, {
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      console.log(`  → Created ${textChunks.length} chunks`);

      // Step 4: Generate embeddings
      console.log("  → Generating embeddings...");
      const chunkTexts = textChunks.map((c) => c.text);
      const embeddingVectors = await generateEmbeddingsBatch(chunkTexts, 50);
      console.log(`  → Generated ${embeddingVectors.length} embeddings`);

      // Step 5: Insert chunks + embeddings
      console.log("  → Inserting chunks and embeddings...");
      for (let i = 0; i < textChunks.length; i++) {
        const chunk = textChunks[i];
        const embedding = embeddingVectors[i];

        const validatedChunk = chunkSchema.parse({
          documentId: document.id,
          chunkText: chunk.text,
          chunkIndex: chunk.index,
          metadata: {
            startChar: chunk.startChar,
            endChar: chunk.endChar,
            length: chunk.text.length,
          },
        });

        const [insertedChunk] = await db.insert(chunks).values(validatedChunk).returning();

        // ✅ Use toPgVector helper here
        await db.insert(embeddings).values({
          chunkId: insertedChunk.id,
          embedding: sql`${toPgVector(embedding)}`,
        });

        if ((i + 1) % 10 === 0 || i === textChunks.length - 1) {
          process.stdout.write(`\r  → Progress: ${i + 1}/${textChunks.length} chunks inserted`);
        }
      }

      console.log("\n  ✔ Document processed successfully\n");
    } catch (error) {
      console.error(`  ✖ Error processing ${config.title}:`, error);
    }
  }

  console.log("\nDatabase prefill complete ✅");
}

// ------------------ ENTRYPOINT ------------------ //
const documentsToProcess: DocumentConfig[] = [
  {
    filePath: path.resolve(__dirname, "../documents/privacy-policy.pdf"),
    title: "Privacy Policy",
    type: "policy",
    version: "2019",
    metadata: { department: "General" },
  },
];

if (require.main === module) {
  prefillDatabase(documentsToProcess)
    .then(() => {
      console.log("Prefill script finished!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Prefill script failed:", err);
      process.exit(1);
    });
}
