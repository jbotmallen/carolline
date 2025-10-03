import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().email('Invalid email address').refine((val) => val.endsWith('usc.edu.ph'), {
    message: 'Email must be a valid usc.edu address',
  }),
});

export const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['handbook', 'rulebook', 'policy', 'guide', 'other']),
  version: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const chunkSchema = z.object({
  documentId: z.number().int().positive(),
  chunkText: z.string().min(10, 'Chunk text too short'),
  chunkIndex: z.number().int().nonnegative(),
  metadata: z.object({
    page: z.number().optional(),
    section: z.string().optional(),
    subsection: z.string().optional(),
  }).optional(),
});

export const embeddingSchema = z.object({
  chunkId: z.number().int().positive(),
  embedding: z.array(z.number()).min(768).max(768), // Adjust based on model
});

export const userQuerySchema = z.object({
  question: z.string().min(3, 'Question too short').max(500, 'Question too long'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
  filters: z.object({
    documentTypes: z.array(z.string()).optional(),
    version: z.string().optional(),
  }).optional(),
});

export const llmResponseSchema = z.object({
  answer: z.string().min(1, 'Answer cannot be empty'),
  sources: z.array(z.object({
    documentId: z.number(),
    documentTitle: z.string(),
    chunkId: z.number(),
    chunkText: z.string(),
    relevanceScore: z.number().min(0).max(1),
    metadata: z.object({
      page: z.number().optional(),
      section: z.string().optional(),
    }).optional(),
  })),
  confidence: z.enum(['high', 'medium', 'low']),
});

// Export types
export type EmailInput = z.infer<typeof emailSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type ChunkInput = z.infer<typeof chunkSchema>;
export type EmbeddingInput = z.infer<typeof embeddingSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;
export type LLMResponse = z.infer<typeof llmResponseSchema>;