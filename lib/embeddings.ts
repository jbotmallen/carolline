import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    const result = await model.embedContent(text);
    const embedding = result.embedding;

    if (!embedding.values || embedding.values.length === 0) {
      throw new Error("Empty embedding returned");
    }

    return embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error(`Failed to generate embedding: ${error}`);
  }
}

export async function generateEmbeddingsBatch(
  texts: string[],
  batchSize: number = 100
): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        texts.length / batchSize
      )}`
    );

    const batchPromises = batch.map(async (text, index) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, index * 100));
        return await generateEmbedding(text);
      } catch (error) {
        console.error(
          `Failed to generate embedding for text ${i + index}:`,
          error
        );
        return new Array(768).fill(0);
      }
    });

    const batchEmbeddings = await Promise.all(batchPromises);
    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
