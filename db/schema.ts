// src/db/schema.ts
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  jsonb,
  index,
  customType,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

export const vector = (dimensions: number) =>
  customType<{ data: number[] }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value: number[]) {
      return `[${value.join(",")}]`;
    },
    fromDriver(value: string | unknown): number[] {
      if (!value || typeof value !== "string") return [];
      return value
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((x) => parseFloat(x.trim()));
    },
  });

// Documents table - stores metadata about uploaded handbooks
export const documents = pgTable(
  "documents",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    type: text("type").notNull(), // 'handbook', 'rulebook', 'policy', etc.
    version: text("version"),
    uploadDate: timestamp("upload_date").defaultNow().notNull(),
    metadata: jsonb("metadata"), // Additional info: author, school year, etc.
  },
  (table) => ({
    typeIdx: index("type_idx").on(table.type),
  })
);

// Chunks table - stores text segments with metadata
export const chunks = pgTable(
  "chunks",
  {
    id: serial("id").primaryKey(),
    documentId: integer("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    chunkText: text("chunk_text").notNull(),
    chunkIndex: integer("chunk_index").notNull(), // Position in document
    metadata: jsonb("metadata"), // Page number, section title, etc.
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    docIdx: index("document_idx").on(table.documentId),
    chunkIdx: index("chunk_idx").on(table.documentId, table.chunkIndex),
  })
);

// Embeddings table - stores vector embeddings
export const embeddings = pgTable(
  "embeddings",
  {
    id: serial("id").primaryKey(),
    chunkId: integer("chunk_id")
      .notNull()
      .references(() => chunks.id, { onDelete: "cascade" })
      .unique(),
    // store as pgvector(768)
    embedding: vector(768)("embedding").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    embeddingIdx: sql`
    CREATE INDEX IF NOT EXISTS embeddings_hnsw_idx
    ON ${table} USING hnsw (embedding vector_cosine_ops)
  `,
  })
);

// Relations
export const documentsRelations = relations(documents, ({ many }) => ({
  chunks: many(chunks),
}));

export const chunksRelations = relations(chunks, ({ one }) => ({
  document: one(documents, {
    fields: [chunks.documentId],
    references: [documents.id],
  }),
  embedding: one(embeddings, {
    fields: [chunks.id],
    references: [embeddings.chunkId],
  }),
}));

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  chunk: one(chunks, {
    fields: [embeddings.chunkId],
    references: [chunks.id],
  }),
}));

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// TypeScript types
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type Chunk = typeof chunks.$inferSelect;
export type NewChunk = typeof chunks.$inferInsert;
export type Embedding = typeof embeddings.$inferSelect;
export type NewEmbedding = typeof embeddings.$inferInsert;
export type Student = typeof students.$inferSelect;
