"use client";

import { normalizeSkill } from '@/types/analysis';
import { Sparkles } from 'lucide-react';

interface ImpliedSkillsProps {
  skills: string[];
  missingSkills?: string[];
}

export default function ImpliedSkills({ skills, missingSkills }: ImpliedSkillsProps) {
  const missingKeys = new Set((missingSkills || []).map((s) => normalizeSkill(s).key));
  const filtered = (skills || []).filter((s) => !missingKeys.has(normalizeSkill(s).key));

  if (!filtered || filtered.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase">Your Current Strengths</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filtered.map((skill, i) => (
          <span 
            key={i}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-bold text-xs sm:text-sm tracking-tight transition-all hover:bg-white sm:hover:shadow-md sm:hover:border-indigo-100"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
        These are strong skills found in your profile that demonstrate technical proficiency, though not directly required for this specific role.
      </p>
    </div>
  );
}
