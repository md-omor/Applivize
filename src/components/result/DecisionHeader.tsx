import Badge from '@/components/shared/Badge';
import React from 'react';

interface DecisionHeaderProps {
  decision: 'APPLY' | 'APPLY WITH IMPROVEMENTS' | 'IMPROVE' | 'SKIP';
  score: number;
}

const DecisionHeader: React.FC<DecisionHeaderProps> = ({ decision, score }) => {
  const getVariant = (d: string) => {
    if (d === 'APPLY') return 'success';
    if (d === 'APPLY WITH IMPROVEMENTS' || d === 'IMPROVE') return 'warning';
    return 'error';
  };

  const getSubtext = (d: string) => {
    if (d === 'APPLY') return 'Highly recommended based on your profile and skills alignment.';
    if (d === 'APPLY WITH IMPROVEMENTS') return 'A strong match, but minor adjustments to your profile are suggested.';
    if (d === 'IMPROVE') return 'Significant gaps found. Consider upskilling or major resume updates.';
    return 'Match profile is too low for this role at this time.';
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 pb-10 sm:pb-16 border-b border-slate-100">
      <div className="text-center lg:text-left space-y-4 sm:space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/[0.03] border border-slate-900/10 text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">
          Signal Analysis Report
        </div>
        <div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none break-words">
            {decision}
          </h1>
          <Badge variant={getVariant(decision)} className="text-xs sm:text-sm py-1.5 px-5 sm:px-6 font-black tracking-widest">
            Fit recommendation
          </Badge>
        </div>
        <p className="text-base sm:text-xl text-slate-500 max-w-lg font-medium leading-relaxed italic border-l-4 border-slate-100 pl-4 sm:pl-6">
          "{getSubtext(decision)}"
        </p>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-slate-900/5 blur-[40px] rounded-full group-hover:bg-slate-900/10 transition-colors"></div>
        <div className="relative w-32 h-32 sm:w-48 sm:h-48 flex items-center justify-center p-3 sm:p-4 bg-white rounded-full shadow-2xl">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-slate-50"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-slate-900"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - score / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter">{score}</span>
            <span className="text-xs text-slate-400 font-black tracking-[0.3em] uppercase">Score</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionHeader;
