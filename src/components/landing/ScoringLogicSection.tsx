import Card from '@/components/shared/Card';
import React from 'react';

const weights = [
  {
    category: 'Required Skills Match',
    value: '30%',
    description: 'Percentage of required job skills found in your resume.',
    color: 'bg-emerald-500',
    details: 'Shows how many of the job’s required skills appear in your resume. A low value means key requirements were not clearly shown.'
  },
  {
    category: 'Experience',
    value: '25%',
    description: 'Years vs. minimum required.',
    color: 'bg-blue-500',
    details: 'Full points if you meet the years. Prorated if you are close. If no minimum experience is required, full points are assigned.'
  },
  {
    category: 'Education',
    value: '15%',
    description: 'Degree level comparison.',
    color: 'bg-indigo-500',
    details: 'PhD > Master > Bachelor. Missing education is not an instant fail.'
  },
  {
    category: 'Preferred Skills',
    value: '10%',
    description: 'Nice-to-have matches.',
    color: 'bg-purple-500',
    details: 'Bonus points that separate good candidates from great ones.'
  },
  {
    category: 'Tools',
    value: '10%',
    description: 'Software & instrumentation.',
    color: 'bg-pink-500',
    details: 'Specific tools mentioned in the job description. If a job does not list specific tools, this category is treated as satisfied.'
  },
  {
    category: 'Eligibility',
    value: '10%',
    description: 'Hard disqualifier check (not a score booster).',
    color: 'bg-orange-500',
    details: 'Checks for strict requirements like visa, location, or legal eligibility. If not evaluated, this does not affect your score.'
  },
];

const ScoringLogicSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-6 font-zalando">Transparent Scoring Logic.</h2>
          <p className="text-lg text-slate-500 font-medium font-zalando max-w-2xl mx-auto">
            We don't hide how we grade. Here is exactly how every job fit score is calculated, so you know where you stand.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Visual Weights */}
          <div className="grid gap-4">
            {weights.map((item) => (
              <div key={item.category} className="group relative bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                 <div className={`w-12 h-12 rounded-lg ${item.color} bg-opacity-10 flex items-center justify-center shrink-0`}>
                    <span className={`text-sm font-bold ${item.color.replace('bg-', 'text-')} !text-white`}>
                      {item.value}
                    </span>
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-center mb-1">
                     <h3 className="font-semibold text-slate-900 font-zalando">{item.category}</h3>
                   </div>
                   <p className="text-sm text-slate-500 font-medium font-mono">{item.description}</p>
                 </div>
                 
                 {/* Tooltip-ish detail on hover (optional or just visible mobile) */}
                 <div className="hidden group-hover:block absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-2 px-3 rounded-lg w-64 text-center z-10 shadow-xl">
                    {item.details}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                 </div>
              </div>
            ))}
          </div>

          {/* Right Column: The Hard Cap Rule */}
          <div className="space-y-8">
            <Card className="p-8 border-rose-100 bg-rose-50/50 relative overflow-hidden">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-100 rounded-full blur-2xl opacity-50"></div>
               
               <h3 className="text-2xl font-bold text-slate-900 mb-4 font-zalando flex items-center gap-3">
                 <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600 text-sm">!</span>
                 The "Hard Cap" Rule
               </h3>
               <p className="text-slate-600 leading-relaxed font-medium font-mono mb-6">
                 We prioritize honesty. If you are missing more than <strong className="text-rose-600">50%</strong> of the 
                 required skills, your score is automatically capped at <strong className="text-slate-900">49/100</strong>.
               </p>
               <p className="text-sm text-slate-500">
                 Why? Because no amount of "years of experience" or "PhDs" can make up for not knowing the core technologies required to do the job. 
                 We save you from applying to roles where auto-reject is guaranteed.
               </p>
            </Card>

            {/* Job Reality Info Block */}
             <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
               <h4 className="font-bold text-slate-900 font-zalando mb-2">Job Reality</h4>
               <p className="text-sm text-slate-600 font-medium font-mono">
                 Job Reality measures how closely your background matches the core, day-to-day responsibilities of the role. 
                 Low alignment means the job itself is a poor fit — not that you lack ability.
               </p>
             </div>

            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-xl font-bold mb-4 font-zalando">Decision Thresholds</h3>
                 <ul className="space-y-4 font-mono text-sm">
                   <li className="flex items-center gap-3">
                     <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                     <span className="flex-1">Score 70 - 100</span>
                     <span className="font-bold text-emerald-400">PASS</span>
                   </li>
                   <li className="flex items-center gap-3">
                     <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                     <span className="flex-1">Score 35 - 69</span>
                     <span className="font-bold text-amber-400">IMPROVE</span>
                   </li>
                   <li className="flex items-center gap-3">
                     <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                     <span className="flex-1">Score 0 - 34</span>
                     <span className="font-bold text-rose-400">REJECT</span>
                   </li>
                 </ul>
               </div>
            </div>
          </div>
        </div>

        {/* Baseline Skill Transparency */}
        <div className="mt-16 text-center">
            <p className="text-sm text-slate-400 font-medium font-mono">
                Foundational skills implied by your role (for example, JavaScript for React developers) are not listed as missing.
            </p>
        </div>
      </div>
    </section>
  );
};

export default ScoringLogicSection;
