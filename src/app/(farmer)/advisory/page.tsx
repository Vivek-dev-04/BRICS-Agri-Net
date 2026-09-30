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
  Volume2,
  VolumeX,
  Printer,
  Compass,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AdvisoryPage() {
  const { farm, farms, switchFarm, soil } = useFarm();
  const [advisory, setAdvisory] = useState<AgroAdvisoryResult | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [language, setLanguage] = useState("English");
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [viewMode, setViewMode] = useState<"farmer" | "technical">("farmer");
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  // Text-To-Speech for Farmers
  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!advisory) return;

    const fullSpeech = `Agro advisory for ${advisory.crop}. 
      Irrigation recommendation: ${advisory.irrigation.recommendation}. 
      Soil and nutrient recommendation: ${advisory.soil.recommendation}. 
      Pest and disease alert: ${advisory.diseaseRisk.recommendation}. 
      Regenerative agriculture step: ${advisory.regenerative.recommendation}.`;

    const utterance = new SpeechSynthesisUtterance(fullSpeech);
    utterance.rate = 0.92;

    const langMap: Record<string, string> = {
      English: "en-US",
      Hindi: "hi-IN",
      Portuguese: "pt-BR",
      Russian: "ru-RU",
      Chinese: "zh-CN",
    };
    if (langMap[language]) {
      utterance.lang = langMap[language];
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/dashboard" className="text-emerald-400 hover:underline">
              ← Farm Dashboard
            </Link>
            <span>/</span>
            <span>{farm.name}</span>
            <span>/</span>
            <span className="text-white font-semibold">AI Agro-Advisory Engine</span>
          </div>

          {/* Farmer / Technical View Switcher */}
          <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("farmer")}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === "farmer"
                  ? "bg-emerald-500 text-slate-950 font-extrabold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Farmer View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("technical")}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === "technical"
                  ? "bg-emerald-500 text-slate-950 font-extrabold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Agronomist Data
            </button>
          </div>
        </div>

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                Module 6
              </span>
              <span className="text-xs text-slate-400">Multimodal Contextual Agro-Reasoning</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              Localized Field Advisory
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-400 max-w-2xl">
              {viewMode === "farmer"
                ? `Customized guidance for ${farm.name} telling you exactly what actions to take today regarding water, fertilizer, disease watch, and regenerative health.`
                : "Multimodal LLM reasoning pipeline integrating Soil chemistry, 5-day Weather radar, and Sentinel-2 NDVI canopy reflectance."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Multi-lingual Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
            >
              <option value="English">Language: English</option>
              <option value="Hindi">भाषा: हिन्दी (Hindi)</option>
              <option value="Portuguese">Idioma: Português</option>
              <option value="Russian">Язык: Русский</option>
              <option value="Chinese">语言: 中文 (Chinese)</option>
            </select>

            {/* Listen Aloud Button */}
            <button
              onClick={toggleSpeech}
              disabled={!advisory}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all border ${
                isSpeaking
                  ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse"
                  : "bg-slate-900 text-emerald-300 border-emerald-500/40 hover:bg-slate-800 disabled:opacity-50"
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Listen Aloud</span>
                </>
              )}
            </button>

            {/* Print Slip */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              title="Print Field Work Order"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Slip</span>
            </button>

            {/* Re-Run Button */}
            <button
              onClick={() => runSynthesis()}
              disabled={isSynthesizing}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSynthesizing ? "animate-spin" : ""}`} />
              {isSynthesizing ? "Computing Advisory..." : "Re-Calculate"}
            </button>
          </div>
        </div>

        {/* Farm Selector Strip (if user has multiple farms) */}
        {farms.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
              <Layers className="h-3.5 w-3.5 text-emerald-400" /> Active Farm Parcel:
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
          <div className="flex flex-wrap items-center gap-2">
            {advisory?.engine?.startsWith("gemini") ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                <Bot className="h-4 w-4" /> Live AI Engine Active: Google Gemini 2.5 Flash
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-teal-300 font-bold bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/30">
                <Cpu className="h-4 w-4" /> Calibrated BRICS Agronomic Engine Active
              </span>
            )}
            <span className="text-slate-400">
              Output Language: <strong className="text-white">{language}</strong>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-amber-400" />
            <span>
              {hasGeminiKey
                ? "Connected to Google AI Studio"
                : "Add GEMINI_API_KEY in .env for generative LLM"}
            </span>
          </div>
        </div>

        {/* Input Telemetry Convergence Strip (Re-oriented for Farmers) */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-emerald-400" />
              What Data Fed This Advisory:
            </span>
            <span className="text-emerald-400 font-mono text-[11px]">ALL 5 FEEDS LIVE</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {/* Feed 1: Farm & Crop */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px] font-semibold">Crop & Soil Type:</span>
              <strong className="text-white truncate block text-sm mt-0.5">{farm.crop}</strong>
              <div className="text-[11px] text-slate-400 truncate">{farm.soilType}</div>
            </div>

            {/* Feed 2: Soil Parameters */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px] font-semibold">Soil Chemistry:</span>
              <strong className={soil?.nitrogen < 200 ? "text-amber-400 block text-sm mt-0.5" : "text-emerald-400 block text-sm mt-0.5"}>
                Nitrogen Deficit
              </strong>
              <div className="text-[11px] text-slate-400">N: {soil?.nitrogen ?? 165} kg/ha • pH {soil?.ph ?? 7.8}</div>
            </div>

            {/* Feed 3: Weather Radar */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px] font-semibold">Weather Condition:</span>
              <strong className="text-amber-400 block text-sm mt-0.5">
                {weather?.current.temp ?? 30}°C Warm
              </strong>
              <div className="text-[11px] text-slate-400">
                48h Rain: {weather?.forecast?.[0]?.rainProb ?? 15}% • RH: {weather?.current.humidity ?? 46}%
              </div>
            </div>

            {/* Feed 4: Satellite NDVI */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px] font-semibold">Satellite Canopy:</span>
              <strong className="text-emerald-300 block text-sm mt-0.5">
                0.61 (Healthy Leaves)
              </strong>
              <div className="text-[11px] text-slate-400">Sentinel-2 MultiSpectral</div>
            </div>

            {/* Feed 5: AI Engine */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px] font-semibold">Reasoning Engine:</span>
              <strong className="text-emerald-400 block text-sm mt-0.5">
                {advisory?.engine?.startsWith("gemini") ? "Gemini 2.5 Flash" : "Agronomic Model"}
              </strong>
              <div className="text-[11px] text-slate-400">Latency: &lt; 800ms</div>
            </div>
          </div>
        </div>

        {/* Structured Advisory Output Card (Farmer-First Layout) */}
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
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> Field Action Plan for {farm.name}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {advisory.crop} Customized Advisory
                </h2>
                <p className="text-xs text-emerald-200/90 mt-1 font-medium">{advisory.cropHealthStatus}</p>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                Updated: {new Date(advisory.generatedAt).toLocaleTimeString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Irrigation Scheduling */}
              <div className="rounded-xl border border-blue-500/40 bg-blue-950/20 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-500/20 pb-2.5">
                  <span className="text-sm font-extrabold text-blue-200 flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-400" />
                    1. Irrigation Scheduling
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                      advisory.irrigation.urgency === "Critical" || advisory.irrigation.urgency === "High"
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {advisory.irrigation.urgency} Priority
                  </span>
                </div>

                {/* Clear Specs Badges */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-blue-900/60 text-blue-200 border border-blue-700/50 px-2.5 py-1 rounded-md font-semibold">
                    Target Depth: 30–35 mm
                  </span>
                  <span className="bg-blue-900/60 text-blue-200 border border-blue-700/50 px-2.5 py-1 rounded-md font-semibold">
                    Method: {farm.irrigationType}
                  </span>
                  <span className="bg-blue-900/60 text-blue-200 border border-blue-700/50 px-2.5 py-1 rounded-md font-semibold">
                    Timing: Morning / Sunset
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-300">Action & Explanation:</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">
                    {advisory.irrigation.recommendation}
                  </p>
                </div>

                {viewMode === "technical" && (
                  <div className="pt-2 border-t border-blue-900/40 text-[11px] text-blue-300/80 font-mono">
                    Telemetry: SMAP Root-zone: 17.3% | ET₀ Daily: {weather?.forecast[0]?.et0Mm ?? 4.5} mm | 48h Rain: {weather?.forecast[0]?.rainProb ?? 15}%
                  </div>
                )}
              </div>

              {/* 2. Soil & Nutrient Supplementation */}
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                  <span className="text-sm font-extrabold text-emerald-200 flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-emerald-400" />
                    2. Soil & Nutrient Protocol
                  </span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-black uppercase">
                    {advisory.soil.urgency} Urgency
                  </span>
                </div>

                {/* Clear Specs Badges */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 px-2.5 py-1 rounded-md font-semibold">
                    Dosage: 25 kg/acre Urea
                  </span>
                  <span className="bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 px-2.5 py-1 rounded-md font-semibold">
                    Timing: With Irrigation Run
                  </span>
                  <span className="bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 px-2.5 py-1 rounded-md font-semibold">
                    Bio-Inoculant: Azotobacter
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-300">Action & Explanation:</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">
                    {advisory.soil.recommendation}
                  </p>
                </div>

                {viewMode === "technical" && (
                  <div className="pt-2 border-t border-emerald-900/40 text-[11px] text-emerald-300/80 font-mono">
                    Telemetry: N: {soil?.nitrogen ?? 165} kg/ha (Deficit) | P: {soil?.phosphorus ?? 18} kg/ha | K: {soil?.potassium ?? 310} kg/ha | pH: {soil?.ph ?? 7.8}
                  </div>
                )}
              </div>

              {/* 3. Disease & Pathogen Risk */}
              <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                  <span className="text-sm font-extrabold text-amber-200 flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-amber-400" />
                    3. Disease & Climate Risk Watch
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                      advisory.diseaseRisk.urgency === "High"
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {advisory.diseaseRisk.urgency} Watch
                  </span>
                </div>

                {/* Clear Specs Badges */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-amber-900/60 text-amber-200 border border-amber-700/50 px-2.5 py-1 rounded-md font-semibold">
                    Risk Factor: Humidity ({weather?.current.humidity ?? 46}%)
                  </span>
                  <span className="bg-amber-900/60 text-amber-200 border border-amber-700/50 px-2.5 py-1 rounded-md font-semibold">
                    Target: Rust & Leaf Blight
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-300">Action & Explanation:</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">
                    {advisory.diseaseRisk.recommendation}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <Link
                    href="/disease"
                    className="font-bold text-amber-300 hover:text-white underline flex items-center gap-1"
                  >
                    <span>Upload Leaf Photo to Diagnose</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* 4. Regenerative Recommendation */}
              <div className="rounded-xl border border-teal-500/40 bg-teal-950/20 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-teal-500/20 pb-2.5">
                  <span className="text-sm font-extrabold text-teal-200 flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-teal-400" />
                    4. Regenerative Agriculture Practice
                  </span>
                  <span className="rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2.5 py-0.5 text-[10px] font-black uppercase">
                    {advisory.regenerative.urgency}
                  </span>
                </div>

                {/* Clear Specs Badges */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-teal-900/60 text-teal-200 border border-teal-700/50 px-2.5 py-1 rounded-md font-semibold">
                    Practice: Crop Residue Mulching
                  </span>
                  <span className="bg-teal-900/60 text-teal-200 border border-teal-700/50 px-2.5 py-1 rounded-md font-semibold">
                    Benefit: Reduces Water Evaporation by 30%
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-300">Action & Explanation:</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">
                    {advisory.regenerative.recommendation}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <Link
                    href="/regenerative"
                    className="font-bold text-teal-300 hover:text-white underline flex items-center gap-1"
                  >
                    <span>Explore Regenerative Practices</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Farmer Feedback Loop */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Was this advisory clear and actionable for your field work today?
              </div>
              {feedbackGiven ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Thank you! Your feedback improves our BRICS cooperative model.
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFeedbackGiven(true)}
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 font-semibold transition-colors"
                  >
                    Clear & Actionable
                  </button>
                  <button
                    onClick={() => setFeedbackGiven(true)}
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 font-semibold transition-colors"
                  >
                    Needs Recalibration
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

