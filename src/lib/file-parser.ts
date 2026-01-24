import mammoth from "mammoth";
import { createRequire } from "node:module";

// Create traditional require for CJS modules in Next.js ESM environment
const require = createRequire(import.meta.url);

// --- ENVIRONMENT POLYFILLS (Required for modern pdfjs-dist used by pdf-parse) ---
/**
 * These polyfills are necessary because pdf-parse (and its dependency pdfjs-dist)
 * often expect certain browser-like globals to be present even in Node.js
 * when parsing complex PDFs.
 */
const globalAny = globalThis as any;
if (typeof globalAny.DOMMatrix === "undefined") {
  globalAny.DOMMatrix = class DOMMatrix {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
  };
}
if (typeof globalAny.ImageData === "undefined") {
  globalAny.ImageData = class ImageData {
    width: number; height: number; data: Uint8ClampedArray;
    constructor(width: number, height: number) {
      this.width = width; this.height = height;
      this.data = new Uint8ClampedArray(width * height * 4);
    }
  };
}
if (typeof globalAny.Path2D === "undefined") {
  globalAny.Path2D = class Path2D {};
}

interface ParseResult {
  text: string;
  metadata?: {
    pages?: number;
    wordCount?: number;
    fileType?: string;
  };
}

interface ParseError {
  code: string;
  message: string;
}

/**
 * Main entry point for file parsing from FormData (used by API routes)
 */
export async function parseFileFromFormData(file: File): Promise<ParseResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const type = file.type;

  if (type === "application/pdf") {
    return parsePDF(buffer);
  } else if (
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return parseDOCX(buffer);
  } else if (type === "text/plain") {
    return {
      text: buffer.toString("utf8"),
      metadata: { fileType: "txt" },
    };
  }

  throw {
    code: "UNSUPPORTED_TYPE",
    message: `Unsupported file type: ${type}`,
  } as ParseError;
}

/**
 * Legacy alias or alternative entry point
 */
export const parseFile = parseFileFromFormData;

/**
 * Parse PDF file and extract text content using pdf-parse
 */
async function parsePDF(buffer: Buffer): Promise<ParseResult> {
  try {
    const pdfModule: any = require("pdf-parse");
    
    // In pdf-parse v2.4.5, we use the PDFParse class
    const PDFParseClass = pdfModule.PDFParse;
    
    if (!PDFParseClass) {
      throw new Error("Unable to resolve PDFParse class from pdf-parse module");
    }

    const parser = new PDFParseClass({
      data: buffer,
      verbosity: 0, // Minimize logs
    });
    
    // getText() returns a TextResult object with a .text property
    const result = await parser.getText();
    let text = result?.text || "";
    const pages = result?.pages?.length || 0;

    text = text
      .replace(/\u0000/g, "")
      .replace(/\f/g, "\n")
      .replace(/\r/g, "")
      .replace(/-\n(?=[a-zA-Z])/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();

    if (!text) {
      throw { code: "EMPTY_CONTENT", message: "PDF contains no extractable text" };
    }

    // Clean up
    await parser.destroy();

    return {
      text,
      metadata: {
        pages,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        fileType: "pdf",
      },
    };
  } catch (error) {
    throw {
      code: "PARSE_ERROR",
      message: `Failed to parse PDF: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
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
