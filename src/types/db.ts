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
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  createdAt: Date;
  updatedAt: Date;
}
