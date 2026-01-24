"use client";

import DecisionHeader from '@/components/result/DecisionHeader';
import ImpliedSkills from '@/components/result/ImpliedSkills';
import MissingSkills from '@/components/result/MissingSkills';
import RecruiterNotes from '@/components/result/RecruiterNotes';
import ScoreBreakdown from '@/components/result/ScoreBreakdown';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import { AnalysisResponse } from '@/types/analysis';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.dispatchEvent(new Event("credits:updated"));
    const raw = localStorage.getItem("last_analysis_result");
    if (raw) {
      try {
        const parsed: AnalysisResponse = JSON.parse(raw);
        
        // Map API response to UI component expected format
        const mappedResult = {
          decision: mapDecision(parsed.decision),
          score: parsed.finalScore,
          breakdown: [
            { label: 'Required Skills', score: parsed.breakdown.requiredSkills, explanation: parsed.explanations?.requiredSkills },
            { label: 'Experience Level', score: parsed.breakdown.experience },
            { label: 'Education Match', score: parsed.breakdown.education?.score || 0, status: parsed.breakdown.education?.status },
            { label: 'Tool Mastery', score: parsed.breakdown.tools },
            { label: 'Eligibility', score: parsed.breakdown.eligibility?.score || 0, status: parsed.breakdown.eligibility?.status, explanation: parsed.explanations?.eligibility },
          ],
          missingSkills: parsed.missingSkills,
          impliedSkills: parsed.impliedSkills || [],
          notes: parsed.notes,
          explanations: parsed.explanations,
        };
        
        setResult(mappedResult);
      } catch (e) {
        console.error("Failed to parse analysis result", e);
      }
    }
    setLoading(false);
  }, []);

  const getActionTip = () => {
    if (!result) return null;

    // 1. HIGH MATCH (85+)
    if (result.score >= 85) {
      return {
        title: "NEXT STEPS: INTERVIEW READY",
        message: "Your profile is a near-perfect match. Focus on quantifying your impact during interviews and preparing for behavioral questions.",
        buttonText: "Join Prep Community",
        action: () => window.open('https://discord.gg/applivize', '_blank')
      };
    }

    // 2. MISSING CRITICAL SKILLS
    if (result.missingSkills && result.missingSkills.length > 0) {
      const topSkill = result.missingSkills[0];
      return {
        title: "ACTION: NARRATIVE OPTIMIZATION",
        message: (
          <>
            Instead of just listing <span className="text-indigo-600">"{topSkill}"</span>, add a specific bullet point in your experience section that shows how you applied it to solve a problem.
          </>
        ),
        buttonText: "See Missing Skills",
        action: () => document.getElementById('missing-skills-section')?.scrollIntoView({ behavior: 'smooth' })
      };
    }

    // 3. EXPERIENCE BIAS (High skills, but maybe low experience score)
    const expScore = result.breakdown.find((b: any) => b.label === 'Experience Level')?.score || 0;
    if (expScore < 70) {
      return {
        title: "ACTION: EXPERIENCE BRIDGING",
        message: "Highlight relevant side projects or open-source contributions to bridge the gap if your formal work history doesn't meet the year requirements.",
        buttonText: "Refine Resume",
        action: () => window.location.href = '/upload'
      };
    }

    // Default Impact Tip
    return {
      title: "BOOST YOUR IMPACT",
      message: "Our analysis suggests adding more 'Result-Driven' language. Focus on using Action Verbs followed by quantified metrics (e.g., 'Increased efficiency by 20%').",
      buttonText: "Refine Resume",
      action: () => window.location.href = '/upload'
    };
  };

  const actionTip = getActionTip();

  function mapDecision(apiDecision: string): 'APPLY' | 'APPLY WITH IMPROVEMENTS' | 'IMPROVE' | 'SKIP' {
    switch (apiDecision) {
      case 'PASS': return 'APPLY';
      case 'IMPROVE': return 'APPLY WITH IMPROVEMENTS';
      case 'REJECT': return 'SKIP';
      default: return 'IMPROVE';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-black mb-4">No Analysis Found</h1>
        <p className="text-slate-500 mb-8 max-w-md">We couldn't find your recent analysis data. Please start a new session.</p>
        <Link href="/upload">
          <Button size="lg">NEW ANALYSIS</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-zalando">


      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <DecisionHeader decision={result.decision} score={result.score} />
        
        <div className="grid lg:grid-cols-2 gap-16 mt-16">
          <div className="space-y-16">
            <ScoreBreakdown breakdown={result.breakdown} />
            <div id="missing-skills-section">
              <MissingSkills skills={result.missingSkills} />
            </div>
            
            {result.impliedSkills && result.impliedSkills.length > 0 && (
              <div className="pt-8 border-t border-slate-50">
                <ImpliedSkills skills={result.impliedSkills} missingSkills={result.missingSkills} />
              </div>
            )}
          </div>
          
          <div className="space-y-12">
            <RecruiterNotes notes={result.notes} />

            <Card className="p-10 bg-white border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-50/50 transition-colors"></div>
              
              <h3 className="text-xl font-black mb-4 tracking-tight text-slate-900">{actionTip?.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-lg">
                {actionTip?.message}
              </p>
            </Card>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center space-y-8 py-20 border-t border-slate-50">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">STILL WANT TO CHECK ANOTHER?</h2>
            <p className="text-slate-400 font-medium">Upload a different job description or update your resume for better results.</p>
          </div>
          <Link href="/upload" className="inline-block">
            <Button size="lg" className="px-16 py-8 text-xl rounded-2xl shadow-2xl hover:scale-105 transition-transform cursor-pointer">
              NEW ANALYSIS
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
