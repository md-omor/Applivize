"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Coins } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const [credits, setCredits] = useState<number | null>(null);
  const [isCreditsLoading, setIsCreditsLoading] = useState(false);
  const { isSignedIn } = useUser();

  const fetchCredits = useCallback(async () => {
    try {
      setIsCreditsLoading(true);
      const res = await fetch("/api/credits", { cache: "no-store" });

      if (!res.ok) {
        let details: unknown = null;
        try {
          details = await res.json();
        } catch {
          // ignore
        }
        console.error("Failed to fetch credits:", res.status, details);
        setCredits(null);
        return;
      }

      const data = await res.json();
      const value = Number(data?.creditsRemaining);
      setCredits(Number.isFinite(value) ? value : null);
    } catch (error) {
      console.error("Failed to fetch credits:", error);
      setCredits(null);
    } finally {
      setIsCreditsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSignedIn === true) {
      fetchCredits();

      const onFocus = () => fetchCredits();
      const onVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          fetchCredits();
        }
      };
      const onCreditsUpdated = () => fetchCredits();

      window.addEventListener("focus", onFocus);
      document.addEventListener("visibilitychange", onVisibilityChange);
      window.addEventListener("credits:updated", onCreditsUpdated as EventListener);

      return () => {
        window.removeEventListener("focus", onFocus);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.removeEventListener("credits:updated", onCreditsUpdated as EventListener);
      };
    }

    if (isSignedIn === false) {
      setCredits(null);
      setIsCreditsLoading(false);
    }
  }, [isSignedIn, pathname, fetchCredits]);

  const navLinks = [
    
    { name: "Analyze Resume", href: "/upload" },
    { name: "Pricing", href: "/pricing" },
    { name: "Knowledge Center", href: "/knowledge-center" },
    { name: "AI Assistant", href: "/ai-assistant" },
    { name: "Career Insights", href: "/career-insights" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-white text-xl uppercase transition-transform group-hover:scale-105">
            J
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tighter">Applivize <span className="text-[10px] text-red-500">BETA</span></span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-slate-900 ${
                isActive(link.href) ? "text-slate-900" : "text-slate-500"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          <SignedIn>
            {isCreditsLoading && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
                <Coins className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-slate-400">Loading…</span>
              </div>
            )}
            {!isCreditsLoading && credits !== null && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
                <Coins className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">
                  {credits} Credits
                </span>
              </div>
            )}
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-slate-900 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
