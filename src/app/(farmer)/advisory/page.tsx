"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  DEMO_FARM,
  DEMO_ADVISORY,
  DEMO_HEALTH_SCORES,
  DEMO_WEATHER,
  DEMO_SOIL,
} from "@/lib/mock-data";
import {
  Sparkles,
  Droplets,
  FlaskConical,
  ShieldAlert,
  Leaf,
  RefreshCw,
  CheckCircle2,
  FileText,
  Clock,
  Send,
} from "lucide-react";

export default function AdvisoryPage() {
  const [advisory, setAdvisory] = useState(DEMO_ADVISORY);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [language, setLanguage] = useState("English");
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleGenerateAdvisory = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setAdvisory({
        ...DEMO_ADVISORY,
        generatedAt: new Date().toISOString(),
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                Module 6
              </span>
              <span className="text-xs text-slate-400">Contextual Multimodal LLM Reasoning</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              AI Agro-Advisory Engine
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              Multi-factor synthesis harmonizing Farm Metadata, Soil Tests, 5-Day Weather Forecasts, and Satellite NDVI.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Portuguese">Português (BR)</option>
              <option value="Russian">Русский</option>
              <option value="Chinese">中文</option>
            </select>

            <button
              onClick={handleGenerateAdvisory}
              disabled={isSynthesizing}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSynthesizing ? "animate-spin" : ""}`} />
              {isSynthesizing ? "Synthesizing AI Engine..." : "Re-Run AI Inference"}
            </button>
          </div>
        </div>

        {/* Input Convergence Telemetry Banner */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Model Input Context Pipeline:</span>
            <span className="text-emerald-400 font-mono">ALL 5 FEEDS SYNCHRONIZED</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">🌾 Farm & Crop:</span>
              <strong className="text-white">{DEMO_FARM.crop}</strong>
              <div className="text-[10px] text-slate-400">{DEMO_FARM.soilType}</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">🧪 Soil Parameters:</span>
              <strong className="text-red-400">N: {DEMO_SOIL.nitrogen.value} (LOW)</strong>
              <div className="text-[10px] text-slate-400">pH: {DEMO_SOIL.ph.value}</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">🌦 Weather Radar:</span>
              <strong className="text-amber-400">{DEMO_WEATHER.current.temp}°C / {DEMO_WEATHER.current.humidity}%</strong>
              <div className="text-[10px] text-slate-400">48h Rain: 12%</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">🛰 Satellite NDVI:</span>
              <strong className="text-amber-300">0.61 (Mod. Stress)</strong>
              <div className="text-[10px] text-slate-400">Sentinel-2 MSI</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">🤖 AI Architect:</span>
              <strong className="text-emerald-400">Agronomic LLM</strong>
              <div className="text-[10px] text-slate-400">Structured Schema</div>
            </div>
          </div>
        </div>

        {/* Structured Advisory Output Card (PRD Section 11) */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/25 bg-gradient-to-b from-slate-900/90 to-slate-900/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Contextual Agricultural Intelligence
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                🌾 {advisory.crop} Customized Advisory
              </h2>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Generated: {new Date(advisory.generatedAt).toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Irrigation */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-950/15 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  💧 Irrigation Scheduling
                </span>
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                  {advisory.irrigation.urgency} Priority
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed pt-1">
                {advisory.irrigation.recommendation}
              </p>
            </div>

            {/* 2. Soil & Nutrient */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-emerald-400" />
                  🌱 Soil & Nutrient Supplementation
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  {advisory.soil.urgency} Urgency
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed pt-1">
                {advisory.soil.recommendation}
              </p>
            </div>

            {/* 3. Disease & Pathogen Risk */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  ⚠ Pathogen & Climate Risk Watch
                </span>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  {advisory.diseaseRisk.urgency}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed pt-1">
                {advisory.diseaseRisk.recommendation}
              </p>
            </div>

            {/* 4. Regenerative Recommendation */}
            <div className="rounded-xl border border-teal-500/30 bg-teal-950/15 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-teal-400" />
                  ♻ Regenerative Agriculture Action
                </span>
                <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                  {advisory.regenerative.urgency}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed pt-1">
                {advisory.regenerative.recommendation}
              </p>
            </div>
          </div>

          {/* Farmer Feedback Loop */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Was this advisory relevant to your current field observations?
            </div>
            {feedbackGiven ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4" /> Thank you for your feedback!
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFeedbackGiven(true)}
                  className="rounded bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs text-slate-200 transition-colors"
                >
                  👍 Yes, Helpful
                </button>
                <button
                  onClick={() => setFeedbackGiven(true)}
                  className="rounded bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs text-slate-200 transition-colors"
                >
                  👎 Needs Calibration
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
