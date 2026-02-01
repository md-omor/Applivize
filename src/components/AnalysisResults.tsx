"use client";

import { AnalysisBreakdown, CandidateProfile, Decision, JobRequirements, ScoreWithStatus } from "@/types/analysis";

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
  PASS: {
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    icon: "✅",
    label: "Strong Match - Apply Now!",
  },
  IMPROVE: {
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    icon: "📚",
    label: "Needs Improvement - Upskill First",
  },
  REJECT: {
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    icon: "⏭️",
    label: "Not a Good Fit - Skip This One",
  },
};

const BREAKDOWN_LABELS: Record<string, { label: string }> = {
  requiredSkills: { label: "Required Skills" },
  preferredSkills: { label: "Preferred Skills" },
  tools: { label: "Tools & Technologies" },
  experience: { label: "Experience Match" },
  education: { label: "Education Match" },
  eligibility: { label: "Eligibility" },
  jobReality: { label: "Job Reality" },
  competition: { label: "Competition" },
};

function ScoreBar({ score, label, status }: { score: number; label: string; status?: string }) {
  const percentage = score;
  
  return (
    <div className="space-y-1">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-sm">
        <div className="flex gap-2 items-center min-w-0">
          <span className="text-gray-600 dark:text-gray-400 break-words">{label}</span>
          {status && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
              status === "MATCHED" ? "bg-green-100 text-green-700" :
              status === "PARTIAL" ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }`}>
              {status}
            </span>
          )}
        </div>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {score}%
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
    if (score >= 70) return "#22c55e"; // green
    if (score >= 35) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
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
        <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{score}</span>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{decisionConfig.icon}</span>
              <h2 className={`text-xl font-bold ${decisionConfig.color}`}>
                {decisionConfig.label}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Your Rielor Score
            </p>
          </div>
          <div className="self-center sm:self-auto">
            <CircularScore score={finalScore} />
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Score Breakdown
        </h3>
        <div className="space-y-4">
          {/* Numeric Categories */}
          {(['requiredSkills', 'preferredSkills', 'tools', 'experience', 'jobReality', 'competition'] as Array<keyof AnalysisBreakdown>)
            .filter(key => typeof breakdown[key] === 'number' && breakdown[key] !== null)
            .map(key => (
              <ScoreBar
                key={key.toString()}
                score={breakdown[key] as number}
                label={BREAKDOWN_LABELS[key]?.label || key.toString()}
              />
            ))
          }

          {/* Special Categories (Education & Eligibility) */}
          {(['education', 'eligibility'] as Array<keyof AnalysisBreakdown>)
            .filter(key => (breakdown[key] as ScoreWithStatus).status !== "NOT_REQUIRED")
            .map(key => {
              const data = breakdown[key] as ScoreWithStatus;
              return (
                <ScoreBar
                  key={key.toString()}
                  score={data.score || 0}
                  label={BREAKDOWN_LABELS[key]?.label || key.toString()}
                  status={data.status}
                />
              );
            })
          }
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

      {extractedData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📊 Extracted Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Your Profile</h4>
              {extractedData.candidate.candidate.fullName && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Name:</span> {extractedData.candidate.candidate.fullName}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Experience:</span> {extractedData.candidate.experience.totalYears} years
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Job Requirements</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Role:</span> {extractedData.job.job.title || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
