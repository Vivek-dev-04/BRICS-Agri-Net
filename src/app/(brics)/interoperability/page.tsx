"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Code2, Copy, Check, Terminal, ExternalLink, ShieldCheck, Database } from "lucide-react";

const SAMPLE_CADS_PAYLOAD = {
  country: "IN",
  region: "Rajasthan",
  crop: "wheat",
  soil: {
    nitrogen: 180,
    phosphorus: 18,
    potassium: 310,
    ph: 7.1,
    organicCarbon: 0.42,
  },
  weather: {
    temperature: 31,
    rainfall: 0.2,
    humidity: 41,
    windSpeed: 14,
  },
  vegetation: {
    ndvi: 0.61,
    stressLevel: "MODERATE",
  },
  timestamp: "2026-09-29T08:30:00Z",
};

export default function InteroperabilityPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"cads" | "curl" | "typescript">("cads");

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(SAMPLE_CADS_PAYLOAD, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              Module 10
            </span>
            <span className="text-xs text-slate-400">Open Data Gateway & Standardization</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Code2 className="h-6 w-6 text-emerald-400" />
            Interoperable Agricultural Data Layer (CADS) & APIs
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Harmonized Common Agricultural Data Schema (CADS) enabling cross-border research, climate resilience analytics, and AI model interoperability.
          </p>
        </div>

        {/* Security & Privacy Banner */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/15 flex items-start gap-3.5">
          <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Privacy-Preserving Zero-PII Protocol</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In accordance with PRD Section 16, private farmer-level identity, names, phone numbers, and cadastral parcel bounds are completely decoupled before entering the BRICS data layer. Data is aggregated to regional coordinate grids.
            </p>
          </div>
        </div>

        {/* CADS Schema & API Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Schema Viewer */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Standardized CADS v1.0 Payload</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy JSON"}</span>
                </button>
              </div>
            </div>

            <pre className="rounded-xl bg-slate-900/90 p-4 text-xs font-mono text-emerald-300/90 border border-slate-800 overflow-x-auto leading-relaxed">
              {JSON.stringify(SAMPLE_CADS_PAYLOAD, null, 2)}
            </pre>
          </div>

          {/* Right: Public API Endpoints Directory (PRD Section 16) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-blue-400" />
                Public BRICS API Catalog
              </h3>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      GET
                    </span>
                    <span className="text-slate-200">/api/brics/countries</span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-400">List active member state metadata & node flags.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      GET
                    </span>
                    <span className="text-slate-200">/api/brics/crops</span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-400">Harmonized international crop taxonomy identifiers.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      GET
                    </span>
                    <span className="text-slate-200">/api/brics/agricultural-data</span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-400">Query regional standardized CADS observations.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      GET
                    </span>
                    <span className="text-slate-200">/api/brics/crop-health</span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-400">Cross-country macro vegetation NDVI telemetry.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      GET
                    </span>
                    <span className="text-slate-200">/api/brics/climate-risk</span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-400">Comparative drought, heat, and frost vulnerability index.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
