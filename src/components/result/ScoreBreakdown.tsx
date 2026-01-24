import React from 'react';

interface ScoreBreakdownProps {
  breakdown: {
    label: string;
    score: number;
    status?: string;
    explanation?: string;
  }[];
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
  return (
    <div className="space-y-8 font-zalando text-slate-900">
      <h2 className="text-2xl font-black tracking-tight">Signal Strengths</h2>
      <div className="grid gap-8">
        {breakdown.map((item) => (
          <div key={item.label} className="space-y-3">
            <div className="flex justify-between items-center h-6">
              <div className="flex items-center gap-3">
                <span title={item.explanation} className="text-sm font-black tracking-widest uppercase">{item.label}</span>
                {item.status && item.status !== 'MATCHED' && item.status !== 'NOT_REQUIRED' && (
                  <span title={item.explanation} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black tracking-widest uppercase text-slate-500">
                    {item.status.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
              <span className="text-lg font-black">{item.score}%</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner border border-slate-200/50">
              <div 
                className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBreakdown;
