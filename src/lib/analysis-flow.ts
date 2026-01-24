import { AnalysisResponse } from "@/types/analysis";
import { AnalysisRecord } from "@/types/db";
import { deductCredit, getOrCreateUser } from "./credits";
import clientPromise from "./mongodb";
import { runAnalysis } from "./runAnalysis";

export async function performAnalysisFlow(
  userId: string,
  resumeText: string,
  jobDescription: string
): Promise<{ success: true; data: AnalysisResponse } | { success: false; error: string; status: number }> {
  // 1. Ensure user exists and has enough credits
  const user = await getOrCreateUser(userId);

  // 2. Check Credits BEFORE
  if (user.creditsRemaining <= 0) {
    console.info("NO_CREDITS", { userId, creditsRemaining: user.creditsRemaining });
    return { success: false, error: "NO_CREDITS", status: 403 };
  }

  try {
    // 3. Call runAnalysis
    const analysisResult = await runAnalysis(resumeText, jobDescription, userId);

    // 4. Save Analysis Result to DB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "applivize");
    const records = db.collection<AnalysisRecord>("analysis_records");

    const record: AnalysisRecord = {
      userId,
      finalScore: analysisResult.finalScore,
      decision: analysisResult.decision,
      scoreBreakdown: analysisResult.breakdown,
      missingSkills: analysisResult.missingSkills,
      notes: analysisResult.notes,
      createdAt: new Date(),
    };

    await records.insertOne(record);

    // 5. Deduct Credit ONLY after successful analysis
    const deduction = await deductCredit(userId);
    if (!deduction.success) {
      return { success: false, error: "NO_CREDITS", status: 403 };
    }

    return { success: true, data: analysisResult };

  } catch (error: any) {
    console.error("Analysis Execution Error:", error);
    return { success: false, error: "ANALYSIS_FAILED", status: 500 };
  }
}
