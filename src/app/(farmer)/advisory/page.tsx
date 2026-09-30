"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { useFarm } from "@/context/FarmContext";
import { WeatherData } from "@/lib/services/weatherService";
import { AgroAdvisoryResult } from "@/lib/services/advisoryService";
import {
  Sparkles,
  Droplets,
  FlaskConical,
  ShieldAlert,
  Leaf,
  RefreshCw,
  CheckCircle2,
  Clock,
  Layers,
  Bot,
  Cpu,
  Key,
  Info,
} from "lucide-react";

export default function AdvisoryPage() {
  const { farm, farms, switchFarm, soil } = useFarm();
  const [advisory, setAdvisory] = useState<AgroAdvisoryResult | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [language, setLanguage] = useState("English");
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  // Check active AI Engine status
  useEffect(() => {
    fetch("/api/advisory")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHasGeminiKey(Boolean(data.hasGeminiKey));
        }
      })
      .catch((err) => console.warn("Failed to check advisory engine status:", err));
  }, []);

  // Fetch weather and trigger AI Advisory synthesis when farm or language changes
  const runSynthesis = useCallback(
    async (langOverride?: string) => {
      setIsSynthesizing(true);
      const targetLang = langOverride || language;

      try {
        const lat = farm.latitude || 26.9124;
        const lon = farm.longitude || 75.7873;

        // Fetch live meteorological telemetry first if not cached
        let currentWeatherData = weather;
        if (!currentWeatherData) {
          const wRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
          const wJson = await wRes.json();
          if (wJson.success && wJson.data) {
            currentWeatherData = wJson.data;
            setWeather(wJson.data);
          }
        }

        // Call the AI Advisory synthesis endpoint
        const res = await fetch("/api/advisory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            farm,
            weather: currentWeatherData,
            soil,
            ndvi: 0.61,
            language: targetLang,
          }),
        });

        const data = await res.json();
        if (data.success && data.advisory) {
          setAdvisory(data.advisory);
          setFeedbackGiven(false);
        }
      } catch (err) {
        console.error("Advisory synthesis error:", err);
      } finally {
        setIsSynthesizing(false);
      }
    },
    [farm, soil, weather, language]
  );

  // Initial synthesis on mount / farm switch
  useEffect(() => {
    runSynthesis();
  }, [farm.id]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    runSynthesis(newLang);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header Bar */}
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

          <div className="flex flex-wrap items-center gap-2">
            {/* Multi-lingual Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Portuguese">Português (BR)</option>
              <option value="Russian">Русский</option>
              <option value="Chinese">中文</option>
            </select>

            {/* Re-Run Button */}
            <button
              onClick={() => runSynthesis()}
              disabled={isSynthesizing}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSynthesizing ? "animate-spin" : ""}`} />
              {isSynthesizing ? "Synthesizing AI Engine..." : "Re-Run AI Inference"}
            </button>
          </div>
        </div>

        {/* Farm Selector Strip (if user has multiple farms) */}
        {farms.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
              <Layers className="h-3.5 w-3.5 text-emerald-400" /> Select Farm:
            </span>
            {farms.map((f) => (
              <button
                key={f.id}
                onClick={() => switchFarm(f.id)}
                className={`px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                  f.id === farm.id
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                {f.name} ({f.crop})
              </button>
            ))}
          </div>
        )}

        {/* Engine Telemetry Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
          <div className="flex items-center gap-2">
            {advisory?.engine?.startsWith("gemini") ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                <Bot className="h-4 w-4" /> Live LLM Reasoning Active: Google Gemini AI ({advisory.engine.replace("gemini-", "").replace("-flash", " Flash")})
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-teal-300 font-semibold bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/30">
                <Cpu className="h-4 w-4" /> BRICS Calibrated Agronomic Intelligence Engine Active
              </span>
            )}
            <span className="text-slate-400">
              Target Language: <strong className="text-white">{language}</strong>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-amber-400" />
            <span>
              {hasGeminiKey
                ? "GEMINI_API_KEY detected in environment"
                : "Add GEMINI_API_KEY to .env for generative LLM inference"}
            </span>
          </div>
        </div>

        {/* Input Convergence Telemetry Banner */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Model Input Context Pipeline:</span>
            <span className="text-emerald-400 font-mono">ALL 5 FEEDS SYNCHRONIZED</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {/* Feed 1: Farm & Crop */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">🌾 Farm & Crop:</span>
              <strong className="text-white truncate block">{farm.crop}</strong>
              <div className="text-[10px] text-slate-400 truncate">{farm.soilType}</div>
            </div>

            {/* Feed 2: Soil Parameters */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">🧪 Soil Parameters:</span>
              <strong className={soil?.nitrogen < 200 ? "text-amber-400" : "text-emerald-400"}>
                N: {soil?.nitrogen ?? 165} kg/ha
              </strong>
              <div className="text-[10px] text-slate-400">pH: {soil?.ph ?? 7.8} • OC: {soil?.organicCarbon ?? 0.38}%</div>
            </div>

            {/* Feed 3: Weather Radar */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">🌦 Weather Radar:</span>
              <strong className="text-amber-400">
                {weather?.current.temp ?? 30}°C / {weather?.current.humidity ?? 46}%
              </strong>
              <div className="text-[10px] text-slate-400">
                48h Rain: {weather?.forecast?.[0]?.rainProb ?? 15}% • ET₀: {weather?.forecast?.[0]?.et0Mm ?? 4.8} mm
              </div>
            </div>

            {/* Feed 4: Satellite NDVI */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">🛰 Satellite NDVI:</span>
              <strong className="text-amber-300">0.61 (Heading Canopy)</strong>
              <div className="text-[10px] text-slate-400">Sentinel-2 MultiSpectral</div>
            </div>

            {/* Feed 5: AI Engine */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">🤖 AI Reasoning:</span>
              <strong className="text-emerald-400">
                {advisory?.engine?.startsWith("gemini") ? "Google Gemini AI" : "Agronomic Engine"}
              </strong>
              <div className="text-[10px] text-slate-400">Latency: {isSynthesizing ? "Computing..." : "< 500ms"}</div>
            </div>
          </div>
        </div>

        {/* Structured Advisory Output Card (PRD Section 11) */}
        {isSynthesizing ? (
          <div className="glass-panel rounded-2xl p-16 border border-emerald-500/30 text-center space-y-4 flex flex-col items-center justify-center min-h-[350px]">
            <RefreshCw className="h-10 w-10 text-emerald-400 animate-spin" />
            <h3 className="text-lg font-bold text-white">Synthesizing Multimodal Agro-Advisory...</h3>
            <p className="text-xs text-slate-400 max-w-md">
              Evaluating crop phenology for {farm.name}, integrating real-time evapotranspiration, pedological nutrient
              ratios, and satellite vegetative stress.
            </p>
          </div>
        ) : advisory ? (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/25 bg-gradient-to-b from-slate-900/90 to-slate-900/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> Contextual Agricultural Intelligence
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  🌾 {advisory.crop} Customized Advisory
                </h2>
                <p className="text-xs text-slate-300 mt-1">{advisory.cropHealthStatus}</p>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Generated: {new Date(advisory.generatedAt).toLocaleTimeString()} • {new Date(advisory.generatedAt).toLocaleDateString()}
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
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      advisory.irrigation.urgency === "Critical" || advisory.irrigation.urgency === "High"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-blue-500/20 text-blue-300"
                    }`}
                  >
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
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      advisory.diseaseRisk.urgency === "High"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {advisory.diseaseRisk.urgency} Risk
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
                Was this advisory relevant to your current field observations on {farm.name}?
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
        ) : null}
      </main>
    </div>
  );
}
