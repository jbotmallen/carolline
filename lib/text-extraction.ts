import { pdf } from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';
import { ExtendedPDFResult, ExtractedText } from './types';

/**
 * Extract text from PDF file
 */
export async function extractFromPDF(filePath: string): Promise<ExtractedText> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer) as ExtendedPDFResult;

    return {
      text: data.text,
      pages: data.numpages,
      metadata: {
        info: data.info,
        version: data.version,
      },
    };
  } catch (error) {
    throw new Error(`Failed to extract PDF: ${error}`);
  }
}

/**
 * Extract text from DOCX file
 */
export async function extractFromDOCX(filePath: string): Promise<ExtractedText> {
  try {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });

    return {
      text: result.value,
      metadata: {
        messages: result.messages,
      },
    };
  } catch (error) {
    throw new Error(`Failed to extract DOCX: ${error}`);
  }
}

/**
 * Extract text from TXT file
 */
export async function extractFromTXT(filePath: string): Promise<ExtractedText> {
  try {
    const text = await fs.readFile(filePath, 'utf-8');

    return {
      text,
      metadata: {},
    };
  } catch (error) {
    throw new Error(`Failed to extract TXT: ${error}`);
  }
}

/**
 * Main extraction function that handles multiple file types
 */
export async function extractText(filePath: string): Promise<ExtractedText> {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.pdf':
      return extractFromPDF(filePath);
    case '.docx':
      return extractFromDOCX(filePath);
    case '.txt':
      return extractFromTXT(filePath);
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

/**
 * Clean and normalize extracted text
 */
export function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .replace(/[ \t]+/g, ' ') // Normalize spaces
    .trim();
}