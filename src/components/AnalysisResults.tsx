"use client";

import { AnalysisBreakdown, CandidateProfile, Decision, JobRequirements } from "@/types/analysis";

interface AnalysisResultsProps {
  finalScore: number;
  decision: Decision;
  breakdown: AnalysisBreakdown;
  missingSkills: string[];
  notes: string[];
  extractedData?: {
    candidate: CandidateProfile;
    job: JobRequirements;
  };
}

const DECISION_CONFIG: Record<Decision, { color: string; bgColor: string; icon: string; label: string }> = {
  APPLY: {
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    icon: "✅",
    label: "Strong Match - Apply Now!",
  },
  APPLY_WITH_IMPROVEMENTS: {
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    icon: "⚡",
    label: "Good Match - Apply with Improvements",
  },
  IMPROVE: {
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    icon: "📚",
    label: "Needs Improvement - Upskill First",
  },
  SKIP: {
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    icon: "⏭️",
    label: "Not a Good Fit - Skip This One",
  },
};

const BREAKDOWN_LABELS: Record<keyof AnalysisBreakdown, { label: string; maxScore: number }> = {
  requiredSkills: { label: "Required Skills", maxScore: 30 },
  preferredSkills: { label: "Preferred Skills", maxScore: 10 },
  tools: { label: "Tools & Technologies", maxScore: 10 },
  experience: { label: "Experience", maxScore: 25 },
  education: { label: "Education", maxScore: 15 },
  eligibility: { label: "Eligibility", maxScore: 10 },
  jobReality: { label: "Job Reality", maxScore: 0 },
  competition: { label: "Competition", maxScore: 0 },
  isHardCapped: { label: "Hard Capped", maxScore: 0 },
};

function ScoreBar({ score, maxScore, label }: { score: number; maxScore: number; label: string }) {
  const percentage = (score / maxScore) * 100;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percentage >= 70
              ? "bg-green-500"
              : percentage >= 50
              ? "bg-yellow-500"
              : percentage >= 30
              ? "bg-orange-500"
              : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function CircularScore({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 75) return "#22c55e"; // green
    if (score >= 55) return "#eab308"; // yellow
    if (score >= 35) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke={getScoreColor(score)}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{score}</span>
      </div>
    </div>
  );
}

export default function AnalysisResults({
  finalScore,
  decision,
  breakdown,
  missingSkills,
  notes,
  extractedData,
}: AnalysisResultsProps) {
  const decisionConfig = DECISION_CONFIG[decision];

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <div className={`rounded-xl p-6 ${decisionConfig.bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{decisionConfig.icon}</span>
              <h2 className={`text-xl font-bold ${decisionConfig.color}`}>
                {decisionConfig.label}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Your JobFit Score
            </p>
          </div>
          <CircularScore score={finalScore} />
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Score Breakdown
        </h3>
        <div className="space-y-4">
          {(Object.keys(breakdown) as Array<keyof AnalysisBreakdown>)
            .filter(key => typeof breakdown[key] === 'number')
            .map((key) => (
              <ScoreBar
                key={key}
                score={breakdown[key] as number}
                maxScore={BREAKDOWN_LABELS[key].maxScore}
                label={BREAKDOWN_LABELS[key].label}
              />
            ))}
        </div>
      </div>

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            🎯 Skills to Develop
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {notes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📝 Notes
          </h3>
          <ul className="space-y-2">
            {notes.map((note, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
              >
                <span className="text-yellow-500">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Extracted Data Preview */}
      {extractedData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📊 Extracted Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Candidate Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Your Profile
              </h4>
              {extractedData.candidate.candidate.fullName && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Name:</span> {extractedData.candidate.candidate.fullName}
                </p>
              )}
              {extractedData.candidate.experience.currentRole && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Current Role:</span> {extractedData.candidate.experience.currentRole}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Experience:</span> {extractedData.candidate.experience.totalYears} years
              </p>
              
              {/* Skills Display - Flattened for now */}
              {(extractedData.candidate.skills.primary.length > 0 || extractedData.candidate.skills.secondary.length > 0) && (
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {[...extractedData.candidate.skills.primary, ...extractedData.candidate.skills.secondary].slice(0, 8).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {([...extractedData.candidate.skills.primary, ...extractedData.candidate.skills.secondary].length > 8) && (
                      <span className="text-xs text-gray-500">
                        +{[...extractedData.candidate.skills.primary, ...extractedData.candidate.skills.secondary].length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Job Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Job Requirements
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Role:</span> {extractedData.job.job.title || "Unknown"}
              </p>
              {extractedData.job.job.company && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Company:</span> {extractedData.job.job.company}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Min Experience:</span> {extractedData.job.requirements.minimumExperienceYears || 0} years
              </p>
              {extractedData.job.requirements.requiredSkills.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Required Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {extractedData.job.requirements.requiredSkills.slice(0, 8).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {extractedData.job.requirements.requiredSkills.length > 8 && (
                      <span className="text-xs text-gray-500">
                        +{extractedData.job.requirements.requiredSkills.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
