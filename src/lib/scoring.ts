import { AnalysisBreakdown } from "@/types/analysis";

/**
 * Calculates the total weighted score.
 * Note: This function assumes that the input breakdown scores are already
 * normalized to be out of the max weight for that category.
 * e.g., if Skills weight is 30, a perfect skills match should provide 30 points.
 */
import { DECISION_THRESHOLDS, SCORING_WEIGHTS } from "@/config/constants";

export function calculateFinalScore(breakdown: AnalysisBreakdown): number {
  let total = 0;
  total += breakdown.requiredSkills;
  total += breakdown.preferredSkills;
  total += breakdown.tools;
  total += breakdown.experience;
  total += breakdown.education;
  total += breakdown.eligibility;
  
  // Metadata scores have 0 weight by default, but we calculate them correctly
  total += Math.round(breakdown.jobReality * (SCORING_WEIGHTS.JOB_REALITY / 100));
  total += Math.round(breakdown.competition * (SCORING_WEIGHTS.COMPETITION / 100));
  
  if (breakdown.isHardCapped) {
    total = Math.min(total, 49);
  }
  
  return total;
}

export function getDecision(score: number): "APPLY" | "APPLY_WITH_IMPROVEMENTS" | "IMPROVE" | "SKIP" {
  if (score >= DECISION_THRESHOLDS.APPLY) return "APPLY";
  if (score >= DECISION_THRESHOLDS.APPLY_WITH_IMPROVEMENTS) return "APPLY_WITH_IMPROVEMENTS";
  if (score >= DECISION_THRESHOLDS.IMPROVE) return "IMPROVE";
  return "SKIP";
}
