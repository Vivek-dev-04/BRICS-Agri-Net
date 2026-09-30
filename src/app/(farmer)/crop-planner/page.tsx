"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useFarm } from "@/context/FarmContext";
import { useLanguage } from "@/context/LanguageContext";
import { getLlmLanguageName } from "@/lib/i18n/languages";
import { WeatherData } from "@/lib/services/weatherService";
import { CropRecommendationResult, CropRecommendation } from "@/lib/services/cropRecommendationService";
import {
  Compass,
  Sprout,
  Droplets,
  TrendingUp,
  Calendar,
  Award,
  Sparkles,
  RefreshCw,
  Layers,
  FlaskConical,
  Bot,
  Cpu,
  ShieldCheck,
  CloudSun,
} from "lucide-react";

export default function CropPlannerPage() {
  const { farm, farms, switchFarm, soil } = useFarm();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [planResult, setPlanResult] = useState<CropRecommendationResult | null>(null);
  const [season, setSeason] = useState("Upcoming Rabi (Winter)");
  const [priorityGoal, setPriorityGoal] = useState<"Balanced" | "Maximum Profit" | "Water Conservation" | "Soil Restoration">("Balanced");

  // Fetch weather data for the farm
  useEffect(() => {
    async function loadWeather() {
      try {
        const lat = farm.latitude || 26.9124;
        const lon = farm.longitude || 75.7873;
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        if (data.success && data.data) {
          setWeather(data.data);
        }
      } catch (err) {
        console.error("Failed to load weather for planner:", err);
      }
    }
    loadWeather();
  }, [farm.id, farm.latitude, farm.longitude]);

  // Execute Crop Recommendation Engine
  const runAnalysis = async (targetSeason?: string, goal?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/crop-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farm,
          soil,
          weather,
          targetSeason: targetSeason || season,
          priorityGoal: goal || priorityGoal,
          language: getLlmLanguageName(language),
        }),
      });

      const data = await res.json();
      if (data.success && data.plan) {
        setPlanResult(data.plan);
      }
    } catch (err) {
      console.error("Crop planning error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run automatically when farm or season changes
  useEffect(() => {
    runAnalysis();
  }, [farm.id]);

  const handleSeasonChange = (newSeason: string) => {
    setSeason(newSeason);
    runAnalysis(newSeason, priorityGoal);
  };

  const handleGoalChange = (g: typeof priorityGoal) => {
    setPriorityGoal(g);
    runAnalysis(season, g);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/farms" className="text-emerald-800 font-semibold hover:underline">
            ← My Farms
          </Link>
          <span>/</span>
          <span>{farm.name}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">AI Crop Planning & Suitability Engine</span>
        </div>

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-900 border border-emerald-300">
                Agro-Planning Intelligence
              </span>
              <span className="text-xs text-slate-500 font-medium">Soil + Climate + Water Machine Learning Analysis</span>
            </div>

            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
              <Compass className="h-7 w-7 text-emerald-800" />
              What Should Be Planted Next?
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
              AI crop planning engine that analyzes {farm.name}&apos;s real soil chemistry, local weather patterns,
              and water availability to prescribe high-yield, climate-resilient crop selections.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => runAnalysis()}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              {loading ? "..." : t.cropPlanner.reAnalyze}
            </button>
          </div>
        </div>

        {/* Farm Selector Strip (if user has multiple farms) */}
        {farms.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-semibold flex items-center gap-1 shrink-0">
              <Layers className="h-3.5 w-3.5 text-emerald-800" /> Select Farm:
            </span>
            {farms.map((f) => (
              <button
                key={f.id}
                onClick={() => switchFarm(f.id)}
                className={`px-3 py-1 rounded-full border transition-all whitespace-nowrap shadow-xs ${
                  f.id === farm.id
                    ? "bg-emerald-800 text-white border-emerald-800 font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:text-slate-900"
                }`}
              >
                {f.name} ({f.crop})
              </button>
            ))}
          </div>
        )}

        {/* Planning Control Strip: Target Season & Priority Goal */}
        <div className="gov-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Season:</label>
              <select
                value={season}
                onChange={(e) => handleSeasonChange(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-800 shadow-xs font-semibold"
              >
                <option value="Upcoming Rabi (Winter)">Upcoming Rabi (Winter: Oct–Mar)</option>
                <option value="Monsoon Kharif">Monsoon Kharif (Jun–Oct)</option>
                <option value="Summer Zaid">Summer Zaid (Mar–Jun)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Farmer Strategic Goal:</label>
              <div className="flex flex-wrap gap-1.5">
                {(["Balanced", "Maximum Profit", "Water Conservation", "Soil Restoration"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGoalChange(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      priorityGoal === g
                        ? "bg-emerald-800 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            {planResult?.engine?.startsWith("gemini") ? (
              <span className="flex items-center gap-1.5 text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300 font-bold">
                <Bot className="h-4 w-4 text-emerald-800" /> Gemini 2.5 Flash Planning
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300 font-bold">
                <Cpu className="h-4 w-4 text-slate-700" /> Calibrated Pedo-Climatic Model
              </span>
            )}
          </div>
        </div>

        {/* Farm Diagnostic Synthesis Bar */}
        {planResult?.analysis && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="gov-card rounded-xl p-4 border border-slate-200 bg-white shadow-xs">
              <span className="text-slate-500 block text-[11px] font-bold flex items-center gap-1">
                <FlaskConical className="h-3.5 w-3.5 text-blue-600" /> Soil Diagnostic Status:
              </span>
              <p className="mt-1 font-semibold text-slate-900 leading-snug">{planResult.analysis.soilFertilityStatus}</p>
            </div>

            <div className="gov-card rounded-xl p-4 border border-slate-200 bg-white shadow-xs">
              <span className="text-slate-500 block text-[11px] font-bold flex items-center gap-1">
                <Compass className="h-3.5 w-3.5 text-emerald-700" /> Agro-Climatic Zone:
              </span>
              <p className="mt-1 font-semibold text-slate-900 leading-snug">{planResult.analysis.climateSuitabilityZone}</p>
            </div>

            <div className="gov-card rounded-xl p-4 border border-slate-200 bg-white shadow-xs">
              <span className="text-slate-500 block text-[11px] font-bold flex items-center gap-1">
                <Droplets className="h-3.5 w-3.5 text-amber-600" /> Water Availability Risk:
              </span>
              <p className="mt-1 font-semibold text-slate-900 leading-snug">{planResult.analysis.waterAvailabilityRisk}</p>
            </div>

            <div className="gov-card rounded-xl p-4 border border-slate-200 bg-white shadow-xs">
              <span className="text-slate-500 block text-[11px] font-bold flex items-center gap-1">
                <Sprout className="h-3.5 w-3.5 text-emerald-800" /> Recommended Succession:
              </span>
              <p className="mt-1 font-bold text-emerald-900 leading-snug">{planResult.analysis.topRotationStrategy}</p>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="gov-card rounded-2xl p-16 border border-emerald-300 bg-white text-center space-y-4 flex flex-col items-center justify-center min-h-[350px] shadow-sm">
            <RefreshCw className="h-10 w-10 text-emerald-800 animate-spin" />
            <h3 className="text-lg font-bold text-slate-900">Analyzing Farm Telemetry & Modeling Crop Suitability...</h3>
            <p className="text-xs text-slate-600 max-w-md">
              Evaluating NPK ratios, local evaporative demand, and drought tolerances to curate high-profit,
              regenerative crop varieties for {farm.name}.
            </p>
          </div>
        ) : planResult ? (
          /* Recommended Crops Grid */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-800" />
                Ranked Crop Recommendations for {farm.name} ({planResult.recommendations.length} Options)
              </h2>
              <span className="text-xs text-slate-500">Sorted by Agro-Suitability Match</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {planResult.recommendations.map((crop, idx) => {
                const isTopMatch = idx === 0;
                const isLegume = crop.category === "Regenerative Legume";
                const isCashCrop = crop.category === "High-Value Cash Crop";

                return (
                  <div
                    key={crop.cropName}
                    className={`gov-card rounded-2xl p-6 border transition-all ${
                      isTopMatch
                        ? "border-2 border-emerald-600 bg-white shadow-md ring-2 ring-emerald-600/10"
                        : isLegume
                        ? "border border-emerald-300 bg-emerald-50/40 shadow-xs"
                        : isCashCrop
                        ? "border border-amber-300 bg-amber-50/30 shadow-xs"
                        : "border border-slate-200 bg-white shadow-xs"
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              isTopMatch
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                : isLegume
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {crop.category}
                          </span>
                          <span className="text-[11px] text-slate-500 italic font-serif">
                            {crop.scientificName}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mt-1.5 flex items-center gap-2">
                          {crop.cropName}
                          <span className="text-xs font-normal text-slate-500">({crop.variety})</span>
                        </h3>
                      </div>

                      {/* Suitability Score Circle */}
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-black text-emerald-800">{crop.suitabilityScore}%</div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Suitability Match</span>
                      </div>
                    </div>

                    {/* Operational Telemetry Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 py-2 border-y border-slate-200 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block font-semibold flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-emerald-700" /> Sowing Window
                        </span>
                        <strong className="text-slate-900 mt-0.5 block">{crop.sowingWindow}</strong>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block font-semibold flex items-center gap-1">
                          <Droplets className="h-3 w-3 text-blue-600" /> Water Need
                        </span>
                        <strong
                          className={`mt-0.5 block ${
                            crop.waterRequirement === "Very Low" || crop.waterRequirement === "Low"
                              ? "text-emerald-800 font-bold"
                              : crop.waterRequirement === "High"
                              ? "text-red-700 font-bold"
                              : "text-amber-800 font-bold"
                          }`}
                        >
                          {crop.waterRequirement}
                        </strong>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block font-semibold flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-emerald-700" /> Expected Yield
                        </span>
                        <strong className="text-slate-900 mt-0.5 block truncate">{crop.expectedYield}</strong>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block font-semibold flex items-center gap-1">
                          <Award className="h-3 w-3 text-amber-600" /> Est. Revenue
                        </span>
                        <strong className="text-slate-900 mt-0.5 block truncate">{crop.estimatedRevenuePerAcre}</strong>
                      </div>
                    </div>

                    {/* Scientific Rationale */}
                    <div className="space-y-2 text-xs">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <strong className="text-emerald-950 flex items-center gap-1.5 mb-1 font-bold">
                          <Sprout className="h-3.5 w-3.5 text-emerald-800 shrink-0" />
                          Soil Suitability Rationale:
                        </strong>
                        <p className="text-slate-700 leading-relaxed font-normal">{crop.soilCompatibilityReason}</p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <strong className="text-blue-950 flex items-center gap-1.5 mb-1 font-bold">
                          <CloudSun className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                          Climate & Water Resilience:
                        </strong>
                        <p className="text-slate-700 leading-relaxed font-normal">{crop.climateResilienceReason}</p>
                      </div>
                    </div>

                    {/* Regenerative Benefits Chips */}
                    {crop.regenerativeBenefits && crop.regenerativeBenefits.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider block mb-1.5 flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-800" /> Soil Regenerative Benefits:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {crop.regenerativeBenefits.map((b, i) => (
                            <span
                              key={i}
                              className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] text-emerald-900 flex items-center gap-1.5 font-medium"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block shrink-0" />
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
