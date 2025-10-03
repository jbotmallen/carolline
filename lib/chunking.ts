import { ChunkOptions, TextChunk } from "./types";

/**
 * Split text into overlapping chunks with intelligent boundaries
 */
export function chunkText(
  text: string,
  options: Partial<ChunkOptions> = {}
): TextChunk[] {
  const {
    chunkSize = 1000,
    chunkOverlap = 200,
    separator = '\n\n',
  } = options;

  if (chunkSize <= chunkOverlap) {
    throw new Error('chunkSize must be greater than chunkOverlap');
  }

  const chunks: TextChunk[] = [];

  // Split by separator first to respect document structure
  const sections = text.split(separator).filter(s => s.trim().length > 0);

  let currentChunk = '';
  let currentStartChar = 0;
  let chunkIndex = 0;
  let absolutePosition = 0;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    // If adding this section exceeds chunk size, save current chunk
    if (currentChunk.length > 0 && currentChunk.length + section.length > chunkSize) {
      chunks.push({
        text: currentChunk.trim(),
        index: chunkIndex++,
        startChar: currentStartChar,
        endChar: absolutePosition,
      });

      // Create overlap by keeping last part of previous chunk
      const overlapText = currentChunk.slice(-chunkOverlap);
      currentChunk = overlapText + (overlapText ? separator : '') + section;
      currentStartChar = absolutePosition - overlapText.length;
    } else {
      // Add section to current chunk
      if (currentChunk.length > 0) {
        currentChunk += separator + section;
      } else {
        currentChunk = section;
        currentStartChar = absolutePosition;
      }
    }

    absolutePosition += section.length + separator.length;
  }

  // Add the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      text: currentChunk.trim(),
      index: chunkIndex,
      startChar: currentStartChar,
      endChar: absolutePosition,
    });
  }

  return chunks;
}

/**
 * Advanced chunking that respects semantic boundaries
 */
export function semanticChunk(
  text: string,
  options: Partial<ChunkOptions> = {}
): TextChunk[] {
  const {
    chunkSize = 1000,
    chunkOverlap = 200,
  } = options;

  // Try multiple separators in order of preference
  const separators = [
    '\n\n\n', // Major sections
    '\n\n',   // Paragraphs
    '\n',     // Lines
    '. ',     // Sentences
    ' ',      // Words
  ];

  function splitRecursive(text: string, separators: string[]): TextChunk[] {
    if (separators.length === 0 || text.length <= chunkSize) {
      return [{
        text: text.trim(),
        index: 0,
        startChar: 0,
        endChar: text.length,
      }];
    }

    const [separator, ...remainingSeparators] = separators;
    const splits = text.split(separator);

    const chunks: TextChunk[] = [];
    let currentChunk = '';
    let position = 0;

    for (const split of splits) {
      if (currentChunk.length + split.length > chunkSize && currentChunk.length > 0) {
        // Process current chunk
        const processed = currentChunk.length > chunkSize
          ? splitRecursive(currentChunk, remainingSeparators)
          : [{
              text: currentChunk.trim(),
              index: chunks.length,
              startChar: position - currentChunk.length,
              endChar: position,
            }];

        chunks.push(...processed);

        // Start new chunk with overlap
        const overlapText = currentChunk.slice(-chunkOverlap);
        currentChunk = overlapText + separator + split;
      } else {
        currentChunk += (currentChunk ? separator : '') + split;
      }

      position += split.length + separator.length;
    }

    if (currentChunk.trim().length > 0) {
      chunks.push({
        text: currentChunk.trim(),
        index: chunks.length,
        startChar: position - currentChunk.length,
        endChar: position,
      });
    }

    return chunks;
  }

  const chunks = splitRecursive(text, separators);

  // Re-index chunks
  return chunks.map((chunk, index) => ({
    ...chunk,
    index,
  }));
}