import React from 'react';

interface RecruiterNotesProps {
  notes: string[];
}

const RecruiterNotes: React.FC<RecruiterNotesProps> = ({ notes }) => {
  return (
    <div className="space-y-6 font-zalando">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recruiter-Style Notes</h2>
      <div className="space-y-4">
        {notes.map((note, index) => (
          <div 
            key={index} 
            className="flex gap-4 p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]/30 group hover:shadow-sm transition-all"
          >
            <div className="flex-shrink-0 mt-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400 group-hover:bg-[#6366F1] transition-colors"></div>
            </div>
            <p className="text-[#475569] font-medium leading-relaxed italic text-lg">
              "{note}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterNotes;
