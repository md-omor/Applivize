"use client";

import { formatFileSize, validateFile } from "@/utils/file-validation";
import { useCallback, useState } from "react";

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  onTextChange?: (text: string) => void;
  allowTextInput?: boolean;
  placeholder?: string;
}

export default function FileUpload({
  label,
  accept = ".pdf,.docx",
  onFileSelect,
  onTextChange,
  allowTextInput = true,
  placeholder = "Or paste text here...",
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState<"file" | "text">("file");
  const [textContent, setTextContent] = useState("");

  const handleFileChange = useCallback(
    (file: File | null) => {
      setError(null);

      if (!file) {
        setSelectedFile(null);
        onFileSelect(null);
        return;
      }

      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        setSelectedFile(null);
        onFileSelect(null);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileChange(file);
      }
    },
    [handleFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFileChange(file);
    },
    [handleFileChange]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setTextContent(text);
      onTextChange?.(text);
    },
    [onTextChange]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    onFileSelect(null);
  }, [onFileSelect]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      {/* Mode Toggle */}
      {allowTextInput && (
        <div className="flex mb-3 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setInputMode("file")}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              inputMode === "file"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            📄 Upload File
          </button>
          <button
            type="button"
            onClick={() => setInputMode("text")}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              inputMode === "text"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            ✏️ Paste Text
          </button>
        </div>
      )}

      {inputMode === "file" ? (
        <>
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : selectedFile
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : error
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <input
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {selectedFile ? (
              <div className="space-y-2">
                <div className="text-green-600 dark:text-green-400 text-4xl">✓</div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-gray-400 text-4xl">📁</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  PDF or DOCX (max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </>
      ) : (
        /* Text Input Mode */
        <textarea
          value={textContent}
          onChange={handleTextChange}
          placeholder={placeholder}
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 resize-none"
        />
      )}
    </div>
  );
}
