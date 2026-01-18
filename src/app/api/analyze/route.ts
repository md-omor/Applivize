import { extractCandidateData, extractJobRequirements } from "@/lib/extract";
import { matchJobWithCandidate } from "@/lib/match";
import { calculateFinalScore, getDecision } from "@/lib/scoring";
import { AnalysisRequest, AnalysisResponse } from "@/types/analysis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: AnalysisRequest = await request.json();
    const { jobDescription, resumeText } = body;

    if (!jobDescription || !resumeText) {
      return NextResponse.json(
        { error: "Missing jobDescription or resumeText" },
        { status: 400 }
      );
    }

    // 1. Extract Data (Parallel execution for speed if real AI)
    const [candidateProfile, jobRequirements] = await Promise.all([
      extractCandidateData(resumeText),
      extractJobRequirements(jobDescription),
    ]);

    // 2. Match Logic
    const { breakdown, missingSkills, notes } = matchJobWithCandidate(
      jobRequirements,
      candidateProfile
    );

    // 3. Calculate Final Score
    const finalScore = calculateFinalScore(breakdown);

    // 4. Normalize & Decide
    const decision = getDecision(finalScore);

    // 5. Construct Response
    const response: AnalysisResponse = {
      finalScore,
      decision,
      breakdown,
      missingSkills,
      notes,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Analysis Error Details:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
