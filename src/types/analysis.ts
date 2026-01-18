export interface AnalysisRequest {
  jobDescription: string;
  resumeText: string;
}

export interface AnalysisBreakdown {
  skills: number;
  experience: number;
  eligibility: number;
  jobReality: number;
  competition: number;
}

export type Decision = "APPLY" | "APPLY_WITH_IMPROVEMENTS" | "IMPROVE" | "SKIP";

export interface AnalysisResponse {
  finalScore: number;
  decision: Decision;
  breakdown: AnalysisBreakdown;
  missingSkills: string[];
  notes: string[];
}

export interface CandidateProfile {
  skills: string[];
  yearsOfExperience: number;
  educationLevel: string;
  // Add more fields as needed for extraction
}

export interface JobRequirements {
  requiredSkills: string[];
  minYearsExperience: number;
  requiredEducation: string;
  // Add more fields as needed for extraction
}
