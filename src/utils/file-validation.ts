/**
 * File validation utilities for JobFit platform
 */

// Maximum file size: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Supported MIME types
export const SUPPORTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

// Supported file extensions
export const SUPPORTED_EXTENSIONS = [".pdf", ".docx"] as const;

export type SupportedMimeType = (typeof SUPPORTED_MIME_TYPES)[number];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate file type by MIME type
 */
export function validateFileType(mimeType: string): ValidationResult {
  if (!SUPPORTED_MIME_TYPES.includes(mimeType as SupportedMimeType)) {
    return {
      valid: false,
      error: `Unsupported file type: ${mimeType}. Please upload a PDF or DOCX file.`,
    };
  }
  return { valid: true };
}

/**
 * Validate file size
 */
export function validateFileSize(size: number): ValidationResult {
  if (size > MAX_FILE_SIZE) {
    const sizeMB = (size / (1024 * 1024)).toFixed(2);
    const maxMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size (${sizeMB}MB) exceeds maximum allowed size (${maxMB}MB).`,
    };
  }
  return { valid: true };
}

/**
 * Validate file extension
 */
export function validateFileExtension(filename: string): ValidationResult {
  const extension = filename.toLowerCase().slice(filename.lastIndexOf("."));
  if (!SUPPORTED_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXTENSIONS)[number])) {
    return {
      valid: false,
      error: `Unsupported file extension: ${extension}. Please upload a PDF or DOCX file.`,
    };
  }
  return { valid: true };
}

/**
 * Sanitize filename to prevent path traversal attacks
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators and null bytes
  return filename
    .replace(/[/\\]/g, "_")
    .replace(/\0/g, "")
    .replace(/\.\./g, "_")
    .trim();
}

/**
 * Comprehensive file validation
 */
export function validateFile(file: File): ValidationResult {
  // Check file type
  const typeValidation = validateFileType(file.type);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  // Check file size
  const sizeValidation = validateFileSize(file.size);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  // Check file extension
  const extensionValidation = validateFileExtension(file.name);
  if (!extensionValidation.valid) {
    return extensionValidation;
  }

  return { valid: true };
}

/**
 * Get human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Get file type display name
 */
export function getFileTypeDisplayName(mimeType: string): string {
  switch (mimeType) {
    case "application/pdf":
      return "PDF Document";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "Word Document (DOCX)";
    default:
      return "Unknown";
  }
}
