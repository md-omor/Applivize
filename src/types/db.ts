import { AnalysisBreakdown } from "./analysis";

export interface Analysis {
  _id?: string;
  userId: string;
  finalScore: number;
  decision: string;
  scoreBreakdown: AnalysisBreakdown;
  missingSkills: string[];
  notes: string[];
  createdAt: Date;
}

export type AnalysisRecord = Analysis;

export interface UserAccount {
  userId: string;
  email?: string;
  creditsTotal: number;
  creditsUsed: number;
  creditsRemaining: number;
  createdAt: Date;
  updatedAt: Date;
}
