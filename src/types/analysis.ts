export interface AnalysisRequest {
  jobDescriptionText: string;
  resumeText: string;
  userId?: string;
}

export interface Skill {
  key: string;
  label: string;
  category: "required" | "preferred" | "tool";
}

/**
 * MANDATORY NORMALIZATION FUNCTION (LOCKED)
 */
export function normalizeSkill(label: string): { label: string; key: string } {
  return {
    label,
    key: label.toLowerCase().replace(/[^a-z0-9]/g, ""),
  };
}

export interface ScoreWithStatus {
  score: number;
  status: "MATCHED" | "PARTIAL" | "MISSING" | "NOT_REQUIRED" | "NOT_EVALUATED";
}

export interface AnalysisBreakdown {
  // Scores are 0-100.
  requiredSkills: number; 
  preferredSkills: number;
  tools: number;
  experience: number;

  // Rich score categories
  education: ScoreWithStatus;
  eligibility: ScoreWithStatus;
  
  // Metadata / Display only
  jobReality: number;
  competition: number;
  isHardCapped: boolean;
}

export type Decision = "PASS" | "IMPROVE" | "REJECT";

export interface AnalysisResponse {
  finalScore: number;
  decision: Decision;
  isHardCapped: boolean;
  breakdown: AnalysisBreakdown;
  missingSkills: string[];
  impliedSkills: string[];
  notes: string[];
  explanations: {
    eligibility: string;
    jobReality: string;
    requiredSkills: string;
    impliedSkills: string;
    competition: string;
    scoringNote: string;
  };
  meta: {
    analysisVersion: string;
  };
}

export interface WorkExperience {
  role: string;
  company: string;
  duration: string; // e.g. "2020 - 2022" or "2 years"
  description?: string;
  technologies?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies?: string[];
  link?: string;
}

export interface CandidateProfile {
  candidate: {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
  };

  professionalSummary: string | null;

  experience: {
    totalYears: number;
    currentRole: string | null;
    workHistory: {
      role: string | null;
      company: string | null;
      durationYears: number;
      technologies: string[];
    }[];
  };

  education: {
    highestLevel: string | null;
    fieldOfStudy: string | null;
    institutions: string[];
  };

  skills: {
    primary: string[];
    secondary: string[];
    tools: string[];
    implied?: string[];
  };

  projects: {
    name: string | null;
    technologies: string[];
    description: string | null;
  }[];

  certifications: string[];

  meta: {
    resumeLanguage: string | null;
    hasGaps: boolean;
  };
  debug?: {
    rawAIResponse: string;
  };
}

export interface JobRequirements {
  job: {
    title: string | null;
    company: string | null;
    location: string | null;
    workType: string; // "remote" | "onsite" | "hybrid" | "unknown"
  };

  requirements: {
    minimumExperienceYears: number | null;
    educationLevel: string | null;
    requiredSkills: string[];
    preferredSkills: string[];
    tools: string[];
  };

  responsibilities: string[];

  seniority: string;

  keywords: string[];

  meta: {
    remoteAllowed: boolean;
    visaRequired: boolean;
  };
  debug?: {
    rawAIResponse: string;
  };
}
