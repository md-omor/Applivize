export interface AnalysisRequest {
  jobDescription: string;
  resumeText: string;
}

export interface AnalysisBreakdown {
  requiredSkills: number;
  preferredSkills: number;
  tools: number;
  experience: number;
  education: number;
  eligibility: number;
  jobReality: number;
  competition: number;
  isHardCapped: boolean;
}

export type Decision = "APPLY" | "APPLY_WITH_IMPROVEMENTS" | "IMPROVE" | "SKIP";

export interface AnalysisResponse {
  finalScore: number;
  decision: Decision;
  breakdown: AnalysisBreakdown;
  missingSkills: string[];
  notes: string[];
  debug?: {
    candidateRaw?: string;
    jobRaw?: string;
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
