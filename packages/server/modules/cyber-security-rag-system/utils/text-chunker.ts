/**
 * Utility to chunk text recursively for RAG embeddings.
 */

export interface ChunkOptions {
   chunkSize: number
   chunkOverlap: number
}

export const defaultChunkOptions: ChunkOptions = {
   chunkSize: 1000,
   chunkOverlap: 200,
}

export function recursiveChunkText(text: string, options: ChunkOptions = defaultChunkOptions): string[] {
   const { chunkSize, chunkOverlap } = options
   if (chunkSize <= 0) throw new Error('Chunk size must be greater than 0')
   if (chunkOverlap >= chunkSize) throw new Error('Chunk overlap must be less than chunk size')

   const separators = ['\n\n', '\n', ' ', '']
   return splitText(text, separators, chunkSize, chunkOverlap)
}

function splitText(text: string, separators: string[], chunkSize: number, chunkOverlap: number): string[] {
   const finalChunks: string[] = []

   // Find the appropriate separator
   let separator: string = separators[separators.length - 1] ?? '' // default to last (empty string usually)
   let newSeparators: string[] = []

   let found = false
   for (let i = 0; i < separators.length; i++) {
      const s = separators[i]
      if (s === undefined) continue
      if (text.includes(s)) {
         separator = s
         newSeparators = separators.slice(i + 1)
         found = true
         break
      }
   }

   // If no separator found and text is large, use empty (char split) if not already attempting it
   // But if we are already at empty string separator (last one), we just split.

   const splits = text.split(separator)
   const goodSplits: string[] = []

   for (const s of splits) {
      if (s.length < chunkSize) {
         goodSplits.push(s)
      } else {
         if (newSeparators.length > 0) {
            // Recursive split
            const recursiveSplits = splitText(s, newSeparators, chunkSize, chunkOverlap)
            goodSplits.push(...recursiveSplits)
         } else {
            // No more separators, hard split this segment
            goodSplits.push(...hardSplit(s, chunkSize, chunkOverlap))
         }
      }
   }

   // Merge splits into chunks with overlap
   return mergeSplits(goodSplits, separator, chunkSize, chunkOverlap)
}

function mergeSplits(splits: string[], separator: string, chunkSize: number, chunkOverlap: number): string[] {
   const docs: string[] = []
   let currentDoc: string[] = []
   let totalLength = 0
   const separatorLen = separator.length

   for (const split of splits) {
      const splitLen = split.length
      // Calculate new length if we add this split
      // If currentDoc is not empty, we add a separator
      const lenWithSeparator = currentDoc.length > 0 ? totalLength + separatorLen + splitLen : splitLen

      if (lenWithSeparator > chunkSize) {
         // Current doc is full
         if (currentDoc.length > 0) {
            const doc = currentDoc.join(separator)
            if (doc.trim().length > 0) {
               docs.push(doc)
            }

            // Handle Overlap:
            // We want to keep the tail of currentDoc that fits within chunkOverlap (or slightly more/less)
            // to start the next chunk.

            // We remove from the front until we are small enough to accept the new split?
            // No, standard way:
            // 1. Emit current chunk.
            // 2. Remove from front of currentDoc until the REMAINING content is < chunkOverlap.
            // 3. Then add the new split.

            while (totalLength > chunkOverlap && currentDoc.length > 0) {
               // Keep shrinking until under overlap limit?
               // Actually, usually we check if (totalLength > chunkOverlap).
               // We want the *next* chunk to start with ~chunkOverlap of context.
               // So we want to keep as much as possible such that length <= chunkOverlap.

               // So loop: while totalLength > chunkOverlap, shift().
               const popped = currentDoc.shift()
               if (popped !== undefined) {
                  totalLength -= popped.length + (currentDoc.length > 0 ? separatorLen : 0)
                  // Note: if currentDoc becomes empty, totalLength becomes 0.
                  // If we remove the first, the separator adhering to it is gone.
                  // Code wise: If we have [A, B], length is A+sep+B.
                  // Remove A: length is B. Correct.
               }
            }
         }
      }

      currentDoc.push(split)
      totalLength += splitLen + (currentDoc.length > 1 ? separatorLen : 0)
   }

   if (currentDoc.length > 0) {
      const doc = currentDoc.join(separator)
      if (doc.trim().length > 0) {
         docs.push(doc)
      }
   }

   return docs
}

function hardSplit(text: string, chunkSize: number, chunkOverlap: number): string[] {
   const chunks: string[] = []
   let start = 0
   while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length)
      chunks.push(text.slice(start, end))
      start += chunkSize - chunkOverlap
   }
   return chunks
}
