import Button from '@/components/shared/Button';
import Link from 'next/link';
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-22 pb-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-100 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-[-5%] w-[30%] h-[50%] bg-slate-50 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-10 rounded-full bg-slate-900/[0.03] border border-slate-900/10 text-slate-600 text-[13px] font-semibold tracking-wide uppercase font-zalando">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          AI-Powered Insights
        </div>
        
        <h1 className="text-6xl md:text-7xl lg:text-9xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9] md:leading-[1.05] font-zalando">
          KNOW IF YOU SHOULD <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-500 italic font-medium">APPLY.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium font-zalando">
          Upload your resume and a job description. {"We'll"} tell you if {"it's"} a match, a maybe, or a skip. No fluff.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link href="/upload" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-16 text-lg group hover:scale-105 transition-transform cursor-pointer font-zalando ">
              Analyze My Job Fit
              <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </Link>
          <Link href="#how-it-works">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto h-16 text-lg border-2 cursor-pointer font-zalando hover:scale-105 transition-transform">
            See How it Works
          </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
