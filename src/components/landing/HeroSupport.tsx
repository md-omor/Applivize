import Link from "next/link";

const HeroSupport = () => {
  return (
    <section className="relative pb-32 bg-white overflow-hidden">
      {/* Background decoration for subtle depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full -z-10 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-tr from-indigo-50/50 via-white to-slate-50/50 blur-3xl rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 rounded-full bg-slate-900/3 border border-slate-900/10 text-slate-600 text-[13px] font-bold font-zalando tracking-widest uppercase">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Stop Guessing, Start Knowing
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none font-zalando">
            Apply with Confidence. <br className="hidden md:block" />
            Skip the <span className="text-indigo-600 italic">Rejection.</span>
          </h2>

          <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Join thousands of applicants using AI to bridge the gap between their resume and the job description.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/upload"
              className="group relative w-full sm:w-auto"
            >
              <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-600 to-slate-900 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <button className="relative w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95 cursor-pointer font-zalando">
                Analyze My Fit Now
              </button>
            </Link>
            
            <Link
              href="#how-it-works-extended"
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-full font-bold text-lg hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95 cursor-pointer font-zalando">
                View Methodology
              </button>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-cyan-700 grayscale pointer-events-none">
            {/* Subtle social proof placeholders or stats could go here */}
            <span className="text-xs font-bold tracking-widest uppercase font-zalando ">ATS Optimized</span>
            <span className="text-xs font-bold tracking-widest uppercase font-zalando ">Privacy First</span>
            <span className="text-xs font-bold tracking-widest uppercase font-zalando ">Instant Signal</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSupport;
