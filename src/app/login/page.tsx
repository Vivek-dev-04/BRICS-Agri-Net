import type { Metadata } from "next";
import Link from "next/link";
import { Sprout } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginBranding } from "@/components/auth/LoginBranding";

export const metadata: Metadata = {
  title: "Farmer Login | BRICS Agri-Net",
  description:
    "Sign in to your farm to access personalized AI agro-advisories, weather warnings, and satellite vegetation monitoring.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Top Official Government Utility Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-400">BRICS Digital Agriculture</span>
            <span className="text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">
              Interoperable Digital Public Infrastructure for Climate-Resilient Farming
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-slate-400 text-[10px]">
            <span>🇮🇳 India</span>
            <span>🇧🇷 Brazil</span>
            <span>🇷🇺 Russia</span>
            <span>🇨🇳 China</span>
            <span>🇿🇦 South Africa</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column — Agricultural Technology Branding (Desktop) */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-7">
            <LoginBranding />
          </div>

          {/* Mobile Header / Banner (Visible only on mobile/tablet) */}
          <div className="block lg:hidden text-center space-y-2 pt-2 pb-1">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-sm">
                <Sprout className="h-6 w-6" />
              </div>
              <div className="text-left">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-tight">
                  BRICS Agri-Net
                </span>
                <span className="text-[11px] text-slate-500 font-medium block leading-tight">
                  Digital Public Infrastructure for Agriculture
                </span>
              </div>
            </Link>
          </div>

          {/* Right Column — Farmer Login Card */}
          <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center">
            <LoginForm />
          </div>
        </div>
      </main>

      {/* Official Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white/70 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 BRICS Agricultural Cooperation Network. Digital Public Infrastructure.
          </span>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <Link href="/privacy" className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-800 transition-colors">
              Terms of Service
            </Link>
            <Link href="/help" className="hover:text-slate-800 transition-colors">
              Farmer Helpdesk
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
