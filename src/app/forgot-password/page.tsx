import type { Metadata } from "next";
import Link from "next/link";
import { Sprout, ArrowLeft, KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Account Recovery | BRICS Agri-Net",
  description: "Recover access to your BRICS Agri-Net farmer account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Top Utility Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-400">BRICS Digital Agriculture</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Account Security & Support</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <KeyRound className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Password Recovery
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              If you forgot your password or PIN, you can reset it using an OTP sent to your registered mobile number. For immediate assistance, contact your local Krishi Vigyan Kendra (KVK) extension officer.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-4 text-sm transition-all shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-700/30"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Farmer Login</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/70 py-4 px-4 text-center text-xs text-slate-500">
        © 2026 BRICS Agricultural Cooperation Network. Digital Public Infrastructure.
      </footer>
    </div>
  );
}
