export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export type ExtendedPDFResult = {
  text: string;
  info?: object;
  metadata?: object;
  version?: string;
  numpages?: number;
  numrender?: number;
}

export type ChunkOptions = {
  chunkSize: number;
  chunkOverlap: number;
  separator: string;
}

export type TextChunk = {
  text: string;
  index: number;
  startChar: number;
  endChar: number;
}

export type ExtractedText = {
  text: string;
  pages?: number;
  metadata?: Record<string, undefined | string | number | object>;
}

export type DocumentConfig = {
  filePath: string;
  title: string;
  type: 'handbook' | 'rulebook' | 'policy' | 'guide' | 'other';
  version?: string;
  metadata?: Record<string, undefined | string | number | object>;
}

export type RetrievedChunk = {
  id: number;
  text: string;
  index: number;
  metadata: unknown;
  documentId: number;
  distance: number;
}

export type AskRequest = {
  question: string;
  k?: number;
};

export type LLMResponse = {
  answer: string;
  citations?: Array<{ documentId: number; chunkIndex: number; snippet: string }>;
};