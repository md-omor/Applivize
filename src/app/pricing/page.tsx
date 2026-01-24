import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-slate-600">
            Start optimizing your job applications today. No hidden fees.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <Card className="p-8 border-2 border-slate-900 relative overflow-hidden flex flex-col h-full" hoverable={true}>
            <div className="absolute top-0 right-0 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              EARLY ACCESS
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">MVP Starter</h3>
              <div className="flex items-baseline mt-4">
                <span className="text-5xl font-extrabold text-slate-900 tracking-tight">$0</span>
                <span className="ml-2 text-slate-500 font-medium">/ forever (MVP)</span>
              </div>
              <p className="text-slate-500 text-sm mt-2">
                Get full access while we are in beta.
              </p>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-start text-slate-600">
                <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                <span>10 Free Credits included</span>
              </div>
              <div className="flex items-start text-slate-600">
                <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                <span>Basic Resume Analysis</span>
              </div>
              <div className="flex items-start text-slate-600">
                <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                <span>Job Fit Scoring & Gap Analysis</span>
              </div>
              <div className="flex items-start text-slate-600">
                <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                <span>Tailored Resume Tips</span>
              </div>
            </div>

            <Link href="/upload" className="block mt-auto">
               <Button variant="primary" className="w-full justify-center py-4 text-lg">
                  Get Started
               </Button>
            </Link>
            <p className="text-xs text-center text-slate-400 mt-4 font-medium">
              No credit card required.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
