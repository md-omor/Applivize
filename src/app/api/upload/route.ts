import { parseFileFromFormData } from "@/lib/file-parser";
import { validateFile } from "@/utils/file-validation";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export interface UploadResponse {
  success: boolean;
  text?: string;
  metadata?: {
    filename: string;
    pages?: number;
    wordCount: number;
    fileType: string;
  };
  error?: string;
}

export async function POST(request: Request): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Parse file and extract text
    const result = await parseFileFromFormData(file);

    return NextResponse.json({
      success: true,
      text: result.text,
      metadata: {
        filename: file.name,
        pages: result.metadata?.pages || 0,
        wordCount: result.metadata?.wordCount || 0,
        fileType: result.metadata?.fileType || "unknown",
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    // Handle known parse errors
    if (error && typeof error === "object" && "code" in error) {
      const parseError = error as { code: string; message: string };
      return NextResponse.json(
        { success: false, error: parseError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to process file" 
      },
      { status: 500 }
    );
  }
}
