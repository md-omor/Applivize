import { extractCandidateData, extractJobRequirements } from "@/lib/extract";
import { parseFileFromFormData } from "@/lib/file-parser";
import { matchJobWithCandidate } from "@/lib/match";
import { calculateFinalScore, getDecision } from "@/lib/scoring";
import { AnalysisResponse, CandidateProfile, JobRequirements } from "@/types/analysis";
import { validateFile } from "@/utils/file-validation";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export interface AnalyzeFilesResponse extends AnalysisResponse {
  extractedData?: {
    candidate: CandidateProfile;
    job: JobRequirements;
  };
}

export async function POST(request: Request): Promise<NextResponse<AnalyzeFilesResponse | { error: string; details?: string }>> {
  try {
    const formData = await request.formData();
    
    // Get files from form data
    const resumeFile = formData.get("resumeFile") as File | null;
    const jobDescriptionFile = formData.get("jobDescriptionFile") as File | null;
    
    // Also support text input as fallback
    const resumeText = formData.get("resumeText") as string | null;
    const jobDescriptionText = formData.get("jobDescriptionText") as string | null;

    // Validate we have at least one input for each
    if (!resumeFile && !resumeText) {
      return NextResponse.json(
        { error: "Please provide a resume file or text" },
        { status: 400 }
      );
    }

    if (!jobDescriptionFile && !jobDescriptionText) {
      return NextResponse.json(
        { error: "Please provide a job description file or text" },
        { status: 400 }
      );
    }

    // Extract text from resume
    let extractedResumeText: string;
    if (resumeFile) {
      const validation = validateFile(resumeFile);
      if (!validation.valid) {
        return NextResponse.json(
          { error: `Resume file error: ${validation.error}` },
          { status: 400 }
        );
      }
      const result = await parseFileFromFormData(resumeFile);
      extractedResumeText = result.text;
    } else {
      extractedResumeText = resumeText!;
    }

    // Extract text from job description
    let extractedJobText: string;
    if (jobDescriptionFile) {
      const validation = validateFile(jobDescriptionFile);
      if (!validation.valid) {
        return NextResponse.json(
          { error: `Job description file error: ${validation.error}` },
          { status: 400 }
        );
      }
      const result = await parseFileFromFormData(jobDescriptionFile);
      extractedJobText = result.text;
    } else {
      extractedJobText = jobDescriptionText!;
    }

    // 1. Extract structured data using AI (parallel execution)
    const [candidateProfile, jobRequirements] = await Promise.all([
      extractCandidateData(extractedResumeText),
      extractJobRequirements(extractedJobText),
    ]);

    // 2. Match logic
    const { breakdown, missingSkills, notes } = matchJobWithCandidate(
      jobRequirements,
      candidateProfile
    );

    // 3. Calculate final score
    const finalScore = calculateFinalScore(breakdown);

    // 4. Get decision
    const decision = getDecision(finalScore);

    // 5. Construct response
    const response: AnalyzeFilesResponse = {
      finalScore,
      decision,
      breakdown,
      missingSkills,
      notes,
      extractedData: {
        candidate: candidateProfile,
        job: jobRequirements,
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Analysis Error Details:", error);
    
    // Handle known parse errors
    if (error && typeof error === "object" && "code" in error) {
      const parseError = error as { code: string; message: string };
      return NextResponse.json(
        { error: parseError.message },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
