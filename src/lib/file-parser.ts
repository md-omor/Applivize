import mammoth from "mammoth";

export interface ParseResult {
  text: string;
  metadata: {
    pages?: number;
    wordCount: number;
    fileType: string;
  };
}

export interface ParseError {
  code: "INVALID_FILE_TYPE" | "PARSE_ERROR" | "EMPTY_CONTENT";
  message: string;
}

const SUPPORTED_MIME_TYPES = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
} as const;

type SupportedMimeType = keyof typeof SUPPORTED_MIME_TYPES;

/**
 * Check if a MIME type is supported for parsing
 */
export function isSupportedFileType(mimeType: string): mimeType is SupportedMimeType {
  return mimeType in SUPPORTED_MIME_TYPES;
}

/**
 * Get file extension from MIME type
 */
export function getFileExtension(mimeType: string): string | null {
  if (isSupportedFileType(mimeType)) {
    return SUPPORTED_MIME_TYPES[mimeType];
  }
  return null;
}

/**
 * Parse PDF file and extract text content
 */
async function parsePDF(buffer: Buffer): Promise<ParseResult> {
  try {
    const mod = await import("pdf-parse");
    let pdf: unknown =
      typeof (mod as any).default === "function"
        ? (mod as any).default
        : typeof (mod as any) === "function"
          ? (mod as any)
          : typeof (mod as any).default?.default === "function"
            ? (mod as any).default.default
            : undefined;

    if (typeof pdf !== "function") {
      const nodeModule = await import("node:module");
      const require = (nodeModule as any).createRequire(import.meta.url);
      const required = require("pdf-parse");
      pdf =
        typeof required === "function"
          ? required
          : typeof required?.default === "function"
            ? required.default
            : typeof required?.default?.default === "function"
              ? required.default.default
              : undefined;
    }

    if (typeof pdf !== "function") {
      throw new Error("pdf-parse export is not a function");
    }

    const data = await (pdf as any)(buffer);
    
    const text = data.text.trim();
    
    if (!text) {
      throw { code: "EMPTY_CONTENT", message: "PDF contains no extractable text" } as ParseError;
    }
    
    return {
      text,
      metadata: {
        pages: data.numpages,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        fileType: "pdf",
      },
    };
  } catch (error) {
    if ((error as ParseError).code) {
      throw error;
    }
    throw {
      code: "PARSE_ERROR",
      message: `Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    } as ParseError;
  }
}

/**
 * Parse DOCX file and extract text content
 */
async function parseDOCX(buffer: Buffer): Promise<ParseResult> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    
    const text = result.value.trim();
    
    if (!text) {
      throw { code: "EMPTY_CONTENT", message: "DOCX contains no extractable text" } as ParseError;
    }
    
    // Log any warnings from mammoth
    if (result.messages.length > 0) {
      console.warn("DOCX parsing warnings:", result.messages);
    }
    
    return {
      text,
      metadata: {
        wordCount: text.split(/\s+/).filter(Boolean).length,
        fileType: "docx",
      },
    };
  } catch (error) {
    if ((error as ParseError).code) {
      throw error;
    }
    throw {
      code: "PARSE_ERROR",
      message: `Failed to parse DOCX: ${error instanceof Error ? error.message : "Unknown error"}`,
    } as ParseError;
  }
}

/**
 * Main parser function - routes to appropriate parser based on file type
 * 
 * @param buffer - File content as Buffer
 * @param mimeType - MIME type of the file
 * @returns ParseResult with extracted text and metadata
 * @throws ParseError if file type is unsupported or parsing fails
 */
export async function parseFile(buffer: Buffer, mimeType: string): Promise<ParseResult> {
  if (!isSupportedFileType(mimeType)) {
    throw {
      code: "INVALID_FILE_TYPE",
      message: `Unsupported file type: ${mimeType}. Supported types: PDF, DOCX`,
    } as ParseError;
  }
  
  const fileType = SUPPORTED_MIME_TYPES[mimeType];
  
  switch (fileType) {
    case "pdf":
      return parsePDF(buffer);
    case "docx":
      return parseDOCX(buffer);
    default:
      throw {
        code: "INVALID_FILE_TYPE",
        message: `Unsupported file type: ${mimeType}`,
      } as ParseError;
  }
}

/**
 * Parse file from a File object (for use with FormData)
 */
export async function parseFileFromFormData(file: File): Promise<ParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return parseFile(buffer, file.type);
}
