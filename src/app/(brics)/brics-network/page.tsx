"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { DEMO_BRICS_COUNTRIES } from "@/lib/mock-data";
import {
  Globe2,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Database,
  Building2,
  CheckCircle2,
  Activity,
} from "lucide-react";

export default function BricsNetworkPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              Module 9
            </span>
            <span className="text-xs text-slate-400">Multilateral Agro-Intelligence Layer</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Globe2 className="h-6 w-6 text-emerald-400" />
            BRICS Agricultural Cooperation Network
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Standardized cross-border agricultural insights, climate resilience benchmarking, and shared AI models across BRICS member states.
          </p>
        </div>

        {/* Network Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Participating Nodes</div>
            <div className="mt-2 text-3xl font-extrabold text-white flex items-center gap-2">
              5 <span className="text-xs font-normal text-emerald-400">Active</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Brazil • Russia • India • China • SA</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Aggregated Telemetry Points</div>
            <div className="mt-2 text-3xl font-extrabold text-white">67,500+</div>
            <p className="mt-1 text-[11px] text-emerald-400">Standardized via CADS schema</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Avg Member State NDVI</div>
            <div className="mt-2 text-3xl font-extrabold text-white">0.658</div>
            <p className="mt-1 text-[11px] text-slate-400">Normalized vegetation health</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Data Privacy Protocol</div>
            <div className="mt-2 text-2xl font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-5 w-5" /> Anonymized
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Zero farmer PII exposed</p>
          </div>
        </div>

        {/* Country Breakdown Cards (PRD Section 14) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-400" />
              Member State Macro Agricultural Profiles
            </h3>
            <Link
              href="/interoperability"
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Access Public CADS Endpoints <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEMO_BRICS_COUNTRIES.map((c) => {
              const isHigh = c.climateRisk === "High";
              const isMedium = c.climateRisk === "Medium";

              return (
                <div
                  key={c.code}
                  className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{c.flag}</span>
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                          {c.name}
                          <span className="text-xs font-mono font-normal text-slate-500">[{c.code}]</span>
                        </h4>
                        <span className="text-xs text-slate-400">Major: {c.majorCrop}</span>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        isHigh
                          ? "bg-red-500/20 text-red-300 border-red-500/40"
                          : isMedium
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      {c.climateRisk} Risk
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Mean Canopy NDVI:</span>
                      <p className="font-bold text-white mt-0.5">{c.avgNdvi}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Reporting Farms:</span>
                      <p className="font-bold text-white mt-0.5">{c.reportingFarms.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-400 block font-semibold">Primary Vulnerability:</span>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">{c.topVulnerability}</p>
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
