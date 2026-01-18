import { AnalysisBreakdown } from "@/types/analysis";

/**
 * Calculates the total weighted score.
 * Note: This function assumes that the input breakdown scores are already
 * normalized to be out of the max weight for that category.
 * e.g., if Skills weight is 30, a perfect skills match should provide 30 points.
 */
import { DECISION_THRESHOLDS } from "@/config/constants";

export function calculateFinalScore(breakdown: AnalysisBreakdown): number {
  let total = 0;
  total += breakdown.skills;
  total += breakdown.experience;
  total += breakdown.eligibility;
  total += breakdown.jobReality;
  total += breakdown.competition;
  
  return total;
}

export function getDecision(score: number): "APPLY" | "APPLY_WITH_IMPROVEMENTS" | "IMPROVE" | "SKIP" {
  if (score >= DECISION_THRESHOLDS.APPLY) return "APPLY";
  if (score >= DECISION_THRESHOLDS.APPLY_WITH_IMPROVEMENTS) return "APPLY_WITH_IMPROVEMENTS";
  if (score >= DECISION_THRESHOLDS.IMPROVE) return "IMPROVE";
  return "SKIP";
}
