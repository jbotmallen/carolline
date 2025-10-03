import { neon } from "@neondatabase/serverless";
import { generateEmbedding } from "@/lib/embeddings";
import { RetrievedChunk } from "@/lib/types";

const sql = neon(process.env.DATABASE_URL!);

export async function getTopKChunksByEmbedding(
  question: string,
  k: number = 5
): Promise<RetrievedChunk[]> {
  // 1) Generate embedding for the question
  const qEmbedding = await generateEmbedding(question);

  // 2) Convert embedding array to pgvector string
  const vecLiteral = `[${qEmbedding.join(",")}]`;

  // 3) Execute query with join to embeddings table
  const result = await sql`
    SELECT c.id, c.chunk_text, c.chunk_index, c.document_id,
           c.metadata,
           (e.embedding <-> ${vecLiteral}::vector) AS distance
    FROM chunks c
    JOIN embeddings e ON c.id = e.chunk_id
    ORDER BY distance ASC
    LIMIT ${k}
  `;

  return result.map((r) => ({
    id: r.id as number,
    text: r.chunk_text as string,
    index: r.chunk_index as number,
    documentId: r.document_id as number,
    distance: Number(r.distance),
    metadata: r.metadata as unknown,
  }));
}
