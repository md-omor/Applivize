"use client";

import { AnalysisBreakdown, CandidateProfile, Decision, JobRequirements } from "@/types/analysis";
import { useState } from "react";
import AnalysisResults from "./AnalysisResults";
import FileUpload from "./FileUpload";

interface AnalysisResponse {
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

export default function AnalysisForm() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);

    // Validate inputs
    if (!resumeFile && !resumeText.trim()) {
      setError("Please upload a resume file or paste resume text");
      return;
    }

    if (!jobFile && !jobText.trim()) {
      setError("Please upload a job description file or paste job description text");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      
      if (resumeFile) {
        formData.append("resumeFile", resumeFile);
      } else {
        formData.append("resumeText", resumeText);
      }

      if (jobFile) {
        formData.append("jobDescriptionFile", jobFile);
      } else {
        formData.append("jobDescriptionText", jobText);
      }

      const response = await fetch("/api/analyze-files", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const raw = await response.text();
        throw new Error(
          `Server returned non-JSON response (status ${response.status}). ${raw.slice(0, 300)}`
        );
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.details || "Analysis failed");
      }

      window.dispatchEvent(new Event("credits:updated"));
      setResults(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "An error occurred during analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResumeFile(null);
    setJobFile(null);
    setResumeText("");
    setJobText("");
    setResults(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Resume Upload */}
          <FileUpload
            label="Your Resume / CV"
            onFileSelect={setResumeFile}
            onTextChange={setResumeText}
            placeholder="Or paste your resume text here..."
          />

          {/* Job Description Upload */}
          <FileUpload
            label="Job Description"
            onFileSelect={setJobFile}
            onTextChange={setJobText}
            placeholder="Or paste the job description here..."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-400">Error</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                🎯 Analyze Applivize
              </>
            )}
          </button>

          {(resumeFile || jobFile || resumeText || jobText || results) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {results && (
        <div className="animate-fadeIn">
          <AnalysisResults
            finalScore={results.finalScore}
            decision={results.decision}
            breakdown={results.breakdown}
            missingSkills={results.missingSkills}
            notes={results.notes}
            extractedData={results.extractedData}
          />
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Analyzing your Applivize...
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Extracting data and calculating match score. This may take a few moments.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}