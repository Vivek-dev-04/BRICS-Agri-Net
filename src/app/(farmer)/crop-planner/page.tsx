"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useFarm } from "@/context/FarmContext";
import { WeatherData } from "@/lib/services/weatherService";
import { CropRecommendationResult, CropRecommendation } from "@/lib/services/cropRecommendationService";
import {
  Compass,
  Sprout,
  Sparkles,
  TrendingUp,
  Droplets,
  Calendar,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Award,
  RefreshCw,
  ArrowRight,
  FlaskConical,
  Bot,
  Cpu,
  Info,
  CheckCircle2,
  CloudSun,
} from "lucide-react";

export default function CropPlannerPage() {
  const { farm, farms, switchFarm, soil } = useFarm();
  const [planResult, setPlanResult] = useState<CropRecommendationResult | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [season, setSeason] = useState("Upcoming Rabi (Winter)");
  const [priorityGoal, setPriorityGoal] = useState<"Balanced" | "Maximum Profit" | "Water Conservation" | "Soil Restoration">("Balanced");

  const runAnalysis = useCallback(
    async (targetSeason?: string, targetGoal?: typeof priorityGoal) => {
      setLoading(true);
      const activeSeason = targetSeason || season;
      const activeGoal = targetGoal || priorityGoal;

      try {
        const lat = farm.latitude || 26.9124;
        const lon = farm.longitude || 75.7873;

        let currentWeatherData = weather;
        if (!currentWeatherData) {
          const wRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
          const wJson = await wRes.json();
          if (wJson.success && wJson.data) {
            currentWeatherData = wJson.data;
            setWeather(wJson.data);
          }
        }

        const res = await fetch("/api/crop-recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            farm,
            weather: currentWeatherData,
            soil,
            ndvi: 0.61,
            season: activeSeason,
            priorityGoal: activeGoal,
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
    },
    [farm, soil, weather, season, priorityGoal]
  );

  useEffect(() => {
    runAnalysis();
  }, [farm.id]);

  const handleSeasonChange = (s: string) => {
    setSeason(s);
    runAnalysis(s, priorityGoal);
  };

  const handleGoalChange = (g: typeof priorityGoal) => {
    setPriorityGoal(g);
    runAnalysis(season, g);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/farms" className="text-emerald-400 hover:underline">
            ← My Farms
          </Link>
          <span>/</span>
          <span>{farm.name}</span>
          <span>/</span>
          <span className="text-white font-semibold">AI Crop Planning & Suitability Engine</span>
        </div>

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-teal-500/10 px-2 py-0.5 text-xs font-semibold text-teal-400 border border-teal-500/30">
                Agro-Planning Intelligence
              </span>
              <span className="text-xs text-slate-400">Soil + Climate + Water Machine Learning Analysis</span>
            </div>

            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <Compass className="h-7 w-7 text-teal-400" />
              What Should Be Planted Next?
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
              AI crop planning engine that analyzes {farm.name}&apos;s real soil chemistry, local weather patterns,
              and water availability to prescribe high-yield, climate-resilient crop selections.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => runAnalysis()}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-teal-400 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Analyzing Field Data..." : "Re-Analyze Farm"}
            </button>
          </div>
        </div>

        {/* Farm Selector Strip (if user has multiple farms) */}
        {farms.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
              <Layers className="h-3.5 w-3.5 text-teal-400" /> Select Farm:
            </span>
            {farms.map((f) => (
              <button
                key={f.id}
                onClick={() => switchFarm(f.id)}
                className={`px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                  f.id === farm.id
                    ? "bg-teal-500/20 text-teal-300 border-teal-500/50 font-bold"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                {f.name} ({f.crop})
              </button>
            ))}
          </div>
        )}

        {/* Planning Control Strip: Target Season & Priority Goal */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Season:</label>
              <select
                value={season}
                onChange={(e) => handleSeasonChange(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Upcoming Rabi (Winter)">Upcoming Rabi (Winter: Oct–Mar)</option>
                <option value="Monsoon Kharif">Monsoon Kharif (Jun–Oct)</option>
                <option value="Summer Zaid">Summer Zaid (Mar–Jun)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Farmer Strategic Goal:</label>
              <div className="flex flex-wrap gap-1.5">
                {(["Balanced", "Maximum Profit", "Water Conservation", "Soil Restoration"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGoalChange(g)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      priorityGoal === g
                        ? "bg-teal-500 text-slate-950 font-bold shadow-sm"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            {planResult?.engine?.startsWith("gemini") ? (
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                <Bot className="h-4 w-4" /> Gemini 2.5 Flash Planning
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/30">
                <Cpu className="h-4 w-4" /> Calibrated Pedo-Climatic Model
              </span>
            )}
          </div>
        </div>

        {/* Farm Diagnostic Synthesis Bar */}
        {planResult?.analysis && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="glass-panel rounded-xl p-4 border border-slate-800 bg-slate-900/40">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <FlaskConical className="h-3.5 w-3.5 text-blue-400" /> Soil Diagnostic Status:
              </span>
              <p className="mt-1 font-semibold text-slate-200 leading-snug">{planResult.analysis.soilFertilityStatus}</p>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-slate-800 bg-slate-900/40">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Compass className="h-3.5 w-3.5 text-teal-400" /> Agro-Climatic Zone:
              </span>
              <p className="mt-1 font-semibold text-slate-200 leading-snug">{planResult.analysis.climateSuitabilityZone}</p>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-slate-800 bg-slate-900/40">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Droplets className="h-3.5 w-3.5 text-amber-400" /> Water Availability Risk:
              </span>
              <p className="mt-1 font-semibold text-slate-200 leading-snug">{planResult.analysis.waterAvailabilityRisk}</p>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-slate-800 bg-slate-900/40">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Sprout className="h-3.5 w-3.5 text-emerald-400" /> Recommended Succession:
              </span>
              <p className="mt-1 font-semibold text-emerald-300 leading-snug">{planResult.analysis.topRotationStrategy}</p>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="glass-panel rounded-2xl p-16 border border-teal-500/30 text-center space-y-4 flex flex-col items-center justify-center min-h-[350px]">
            <RefreshCw className="h-10 w-10 text-teal-400 animate-spin" />
            <h3 className="text-lg font-bold text-white">Analyzing Farm Telemetry & Modeling Crop Suitability...</h3>
            <p className="text-xs text-slate-400 max-w-md">
              Evaluating NPK ratios, local evaporative demand, and drought tolerances to curate high-profit,
              regenerative crop varieties for {farm.name}.
            </p>
          </div>
        ) : planResult ? (
          /* Recommended Crops Grid */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-400" />
                Ranked Crop Recommendations for {farm.name} ({planResult.recommendations.length} Options)
              </h2>
              <span className="text-xs text-slate-400">Sorted by Agro-Suitability Match</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {planResult.recommendations.map((crop, idx) => {
                const isTopMatch = idx === 0;
                const isLegume = crop.category === "Regenerative Legume";
                const isCashCrop = crop.category === "High-Value Cash Crop";

                return (
                  <div
                    key={crop.cropName}
                    className={`glass-panel rounded-2xl p-6 border transition-all ${
                      isTopMatch
                        ? "border-teal-500/50 bg-gradient-to-b from-teal-950/25 to-slate-900/60 shadow-lg shadow-teal-950/20"
                        : isLegume
                        ? "border-emerald-500/40 bg-emerald-950/15"
                        : isCashCrop
                        ? "border-amber-500/30 bg-amber-950/10"
                        : "border-slate-800 bg-slate-900/40"
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              isTopMatch
                                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                                : isLegume
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {crop.category}
                          </span>
                          <span className="text-[11px] text-slate-400 italic font-serif">
                            {crop.scientificName}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
                          {crop.cropName}
                          <span className="text-xs font-normal text-slate-400">({crop.variety})</span>
                        </h3>
                      </div>

                      {/* Suitability Score Circle */}
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-black text-teal-300">{crop.suitabilityScore}%</div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Suitability Match</span>
                      </div>
                    </div>

                    {/* Operational Telemetry Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 py-2 border-y border-slate-800/60 text-xs">
                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-teal-400" /> Sowing Window
                        </span>
                        <strong className="text-slate-200 mt-0.5 block">{crop.sowingWindow}</strong>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                          <Droplets className="h-3 w-3 text-blue-400" /> Water Need
                        </span>
                        <strong
                          className={`mt-0.5 block ${
                            crop.waterRequirement === "Very Low" || crop.waterRequirement === "Low"
                              ? "text-emerald-400"
                              : crop.waterRequirement === "High"
                              ? "text-red-400"
                              : "text-amber-400"
                          }`}
                        >
                          {crop.waterRequirement}
                        </strong>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-emerald-400" /> Expected Yield
                        </span>
                        <strong className="text-slate-200 mt-0.5 block truncate">{crop.expectedYield}</strong>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                          <Award className="h-3 w-3 text-amber-400" /> Est. Revenue
                        </span>
                        <strong className="text-amber-300 mt-0.5 block truncate">{crop.estimatedRevenuePerAcre}</strong>
                      </div>
                    </div>

                    {/* Scientific Rationale */}
                    <div className="space-y-2 text-xs">
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                        <strong className="text-teal-300 flex items-center gap-1.5 mb-1 font-semibold">
                          <Sprout className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                          Soil Suitability Rationale:
                        </strong>
                        <p className="text-slate-300 leading-relaxed">{crop.soilCompatibilityReason}</p>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                        <strong className="text-blue-300 flex items-center gap-1.5 mb-1 font-semibold">
                          <CloudSun className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          Climate & Water Resilience:
                        </strong>
                        <p className="text-slate-300 leading-relaxed">{crop.climateResilienceReason}</p>
                      </div>
                    </div>

                    {/* Regenerative Benefits Chips */}
                    {crop.regenerativeBenefits && crop.regenerativeBenefits.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-800/80">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1.5 flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" /> Soil Regenerative Benefits:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {crop.regenerativeBenefits.map((b, i) => (
                            <span
                              key={i}
                              className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-300 flex items-center gap-1.5"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block shrink-0" />
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
