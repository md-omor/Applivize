import React from 'react';

interface MissingSkillsProps {
  skills: string[];
}

const MissingSkills: React.FC<MissingSkillsProps> = ({ skills }) => {
  return (
    <div className="space-y-6 font-zalando">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Missing Critical Signals</h2>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div 
              key={skill} 
              className="px-5 py-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 font-bold text-sm flex items-center gap-2 group hover:bg-rose-100 hover:scale-105 transition-all"
            >
              <svg className="w-4 h-4 text-rose-400 group-hover:text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {skill}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-emerald-50/50 border border-dashed border-emerald-200 text-center">
          <p className="text-emerald-700 font-bold italic">"No critical skill gaps detected. Profile alignment is optimal."</p>
        </div>
      )}
    </div>
  );
};

export default MissingSkills;
