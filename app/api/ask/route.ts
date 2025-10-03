import { NextRequest, NextResponse } from "next/server";
import { AskRequest, LLMResponse } from "@/lib/types";
import { getTopKChunksByEmbedding } from "@/lib/rag";
import { genAI } from "@/lib/embeddings";

const RAG_PROMPT = `
You are a student handbook assistant.
Answer user questions based ONLY on the provided context.

Rules:
- Be concise (2–3 sentences max).
- If unsure, say "I don't know based on the handbook."
- Do not add extra commentary.
- Do not include citation markers or references in your response.

Context:
{context}

Question:
{question}

Answer:
`;

async function generateRagAnswer(
  question: string,
  contextChunks: { id: number; docId: number; chunkIndex: number; text: string }[]
): Promise<string> {
  const contextText = contextChunks
    .map((c) => `Document ${c.docId} — chunk ${c.chunkIndex}:\n${c.text}`)
    .join("\n\n");

  const prompt = RAG_PROMPT
    .replace("{context}", contextText)
    .replace("{question}", question);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text().trim();
}

export async function POST(request: NextRequest) {
  try {
    const { question, k = 5 } = (await request.json()) as AskRequest;

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // 1) Retrieve top-k relevant chunks from DB
    const topChunks = await getTopKChunksByEmbedding(question, k);

    // 2) Format chunks for Gemini
    const contextChunks = topChunks.map((c) => ({
      id: c.id,
      docId: c.documentId,
      chunkIndex: c.index,
      text: c.text,
    }));

    // 3) Generate concise answer with citations
    const answer = await generateRagAnswer(question, contextChunks);

    const response: LLMResponse = {
      answer,
      citations: contextChunks.map((c) => ({
        documentId: c.docId,
        chunkIndex: c.chunkIndex,
        snippet: c.text.slice(0, 200),
      })),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("RAG orchestration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
