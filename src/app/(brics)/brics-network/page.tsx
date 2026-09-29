"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { DEMO_BRICS_COUNTRIES } from "@/lib/mock-data";
import {
  Globe2,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function BricsNetworkPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-100 text-blue-900 px-2.5 py-0.5 text-xs font-bold border border-blue-300">
                Multilateral Cooperation
              </span>
              <span className="text-xs text-slate-500 font-medium">5 Active Member Nodes</span>
            </div>

            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <Globe2 className="h-6 w-6 text-emerald-800" />
              BRICS Agricultural Cooperation Network
            </h1>

            <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
              Interoperable agricultural insights, climate resilience benchmarking, and standardized data exchange across BRICS member states.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm self-start sm:self-auto"
          >
            Back to Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Network Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="gov-card p-5 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Member States</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              5 <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Active</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">Brazil • Russia • India • China • SA</p>
          </div>

          <div className="gov-card p-5 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Shared Observations</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">67,500+</div>
            <p className="mt-1 text-xs text-emerald-800 font-medium">Standardized via CADS format</p>
          </div>

          <div className="gov-card p-5 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mean Member NDVI</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">0.658</div>
            <p className="mt-1 text-xs text-slate-600">Normalized vegetation health</p>
          </div>

          <div className="gov-card p-5 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Privacy Protocol</div>
            <div className="mt-2 text-xl font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-5 w-5" /> Anonymized
            </div>
            <p className="mt-1 text-xs text-slate-600">Zero farmer PII transmitted</p>
          </div>
        </div>

        {/* Member Country Breakdown */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-800" />
            Member State Macro Agricultural Profiles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEMO_BRICS_COUNTRIES.map((c) => {
              const isHigh = c.climateRisk === "High";
              const isMedium = c.climateRisk === "Medium";

              return (
                <div
                  key={c.code}
                  className="gov-card p-5 border border-slate-200 space-y-4 gov-card-hover"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl leading-none">{c.flag}</span>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                          {c.name}
                          <span className="text-xs font-mono font-medium text-slate-400">[{c.code}]</span>
                        </h3>
                        <span className="text-xs text-slate-600 font-medium">Major Crop: {c.majorCrop}</span>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        isHigh
                          ? "bg-red-50 text-red-800 border-red-200"
                          : isMedium
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {c.climateRisk} Risk
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Mean Canopy NDVI:</span>
                      <p className="font-bold text-slate-900 mt-0.5">{c.avgNdvi}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Reporting Farms:</span>
                      <p className="font-bold text-slate-900 mt-0.5">{c.reportingFarms.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-[11px] text-slate-500 block font-semibold">Primary Vulnerability:</span>
                    <p className="text-slate-800 mt-0.5 leading-relaxed">{c.topVulnerability}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
