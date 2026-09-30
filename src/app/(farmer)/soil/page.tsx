"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useFarm } from "@/context/FarmContext";
import { SoilTelemetry } from "@/lib/services/soilService";
import {
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Sparkles,
  MapPin,
  Layers,
  Sprout,
  Activity,
  ArrowRight,
  TrendingDown,
  Droplets,
} from "lucide-react";

export default function SoilHealthPage() {
  const { farm, farms, switchFarm, soil: contextSoil } = useFarm();
  const [soilData, setSoilData] = useState<SoilTelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states for manual laboratory soil test entry
  const [labN, setLabN] = useState<string>("");
  const [labP, setLabP] = useState<string>("");
  const [labK, setLabK] = useState<string>("");
  const [labPh, setLabPh] = useState<string>("");
  const [labOc, setLabOc] = useState<string>("");
  const [savingLab, setSavingLab] = useState(false);

  const fetchSoil = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);

    try {
      const lat = farm.latitude || 26.9124;
      const lon = farm.longitude || 75.7873;
      const res = await fetch(`/api/soil?lat=${lat}&lon=${lon}`);
      const data = await res.json();

      if (data.success && data.data) {
        setSoilData(data.data);
        setLabN(data.data.nitrogen.value.toString());
        setLabP(data.data.phosphorus.value.toString());
        setLabK(data.data.potassium.value.toString());
        setLabPh(data.data.ph.value.toString());
        setLabOc(data.data.organicCarbon.value.toString());
      }
    } catch (err) {
      console.error("Error loading soil telemetry:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [farm.latitude, farm.longitude]);

  useEffect(() => {
    fetchSoil();
  }, [fetchSoil]);

  const handleSaveLabTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLab(true);
    try {
      const lat = farm.latitude || 26.9124;
      const lon = farm.longitude || 75.7873;

      const customOverrides = {
        nitrogen: {
          value: parseFloat(labN) || 165,
          status: parseFloat(labN) < 180 ? "DEFICIT" : parseFloat(labN) < 280 ? "LOW" : "OPTIMAL",
          optimalRange: "280–560 kg/ha",
        },
        phosphorus: {
          value: parseFloat(labP) || 16,
          status: parseFloat(labP) < 15 ? "LOW" : "OPTIMAL",
          optimalRange: "15–25 kg/ha",
        },
        potassium: {
          value: parseFloat(labK) || 290,
          status: parseFloat(labK) < 150 ? "LOW" : "OPTIMAL",
          optimalRange: "150–280 kg/ha",
        },
        ph: {
          value: parseFloat(labPh) || 7.8,
          status: parseFloat(labPh) < 6.5 ? "ACIDIC" : parseFloat(labPh) <= 7.5 ? "OPTIMAL" : "SLIGHTLY_ALKALINE",
          optimalRange: "6.5–7.5 pH",
        },
        organicCarbon: {
          value: parseFloat(labOc) || 0.38,
          status: parseFloat(labOc) < 0.5 ? "LOW" : "MEDIUM",
          optimalRange: "> 0.75%",
        },
      };

      const res = await fetch("/api/soil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon, customOverrides }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setSoilData(result.data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to save lab overrides:", err);
    } finally {
      setSavingLab(false);
    }
  };

  const currentScore = soilData?.soilScore ?? contextSoil?.soilScore ?? 64;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header Banner */}
        <div className="gov-card bg-white p-6 border border-slate-200 border-l-4 border-l-emerald-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold border border-emerald-300">
                  Module 5: Soil Health Card
                </span>
                <span className="rounded bg-blue-50 text-blue-800 px-2 py-0.5 text-xs font-semibold border border-blue-200">
                  Pedology: {soilData?.faoClassification ?? "Calcisols / Semi-Arid"}
                </span>
                {soilData?.isLiveMoisture && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Soil Sensor Telemetry
                  </span>
                )}
              </div>

              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
                <FlaskConical className="h-7 w-7 text-emerald-800" />
                Soil Health & Nutrient Profiling
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-700 shrink-0" />
                <span className="font-semibold text-slate-800">{farm.name}</span>
                <span className="text-slate-400">•</span>
                <span>{farm.location}</span>
                <span className="text-slate-400 font-mono text-xs">
                  ({(farm.latitude || 26.91).toFixed(4)}°N, {(farm.longitude || 75.78).toFixed(4)}°E)
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {farms.length > 1 && (
                <select
                  value={farm.id}
                  onChange={(e) => switchFarm(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.crop})
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={() => fetchSoil(true)}
                disabled={loading || refreshing}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-emerald-700" : ""}`} />
                {refreshing ? "Refreshing..." : "Refresh Soil API"}
              </button>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                {isEditing ? "Close Editor" : "Log Lab Test Report"}
              </button>

              <Link
                href="/advisory"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate AI Fertilizer Plan
              </Link>
            </div>
          </div>
        </div>

        {/* Manual Lab Test Entry Form */}
        {isEditing && (
          <form onSubmit={handleSaveLabTest} className="gov-card p-6 border border-emerald-300 bg-emerald-50/40 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
              <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-emerald-800" />
                Record Laboratory Soil Health Card (SHC) Overrides
              </h3>
              <span className="text-xs text-slate-500">Government / KVK Certified Lab Values</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Nitrogen (N) kg/ha</label>
                <input
                  type="number"
                  value={labN}
                  onChange={(e) => setLabN(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  placeholder="e.g. 165"
                  required
                />
                <span className="text-[10px] text-slate-500">Optimal: 280–560</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Phosphorus (P) kg/ha</label>
                <input
                  type="number"
                  value={labP}
                  onChange={(e) => setLabP(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  placeholder="e.g. 16"
                  required
                />
                <span className="text-[10px] text-slate-500">Optimal: 15–25</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Potassium (K) kg/ha</label>
                <input
                  type="number"
                  value={labK}
                  onChange={(e) => setLabK(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  placeholder="e.g. 290"
                  required
                />
                <span className="text-[10px] text-slate-500">Optimal: 150–280</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Soil pH</label>
                <input
                  type="number"
                  step="0.1"
                  value={labPh}
                  onChange={(e) => setLabPh(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  placeholder="e.g. 7.8"
                  required
                />
                <span className="text-[10px] text-slate-500">Optimal: 6.5–7.5</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Organic Carbon (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={labOc}
                  onChange={(e) => setLabOc(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  placeholder="e.g. 0.38"
                  required
                />
                <span className="text-[10px] text-slate-500">Target: &gt; 0.75%</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 rounded text-xs font-semibold text-slate-700 border border-slate-300 bg-white hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingLab}
                className="px-4 py-1.5 rounded text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50"
              >
                {savingLab ? "Saving Records..." : "Save to Database"}
              </button>
            </div>
          </form>
        )}

        {/* Top Summary Scorecard */}
        <div className="gov-card p-6 border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Composite Soil Quality Index
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900">{currentScore}</span>
              <span className="text-xs text-slate-500 font-medium">
                / 100 ({currentScore >= 80 ? "Optimal Fertility" : currentScore >= 60 ? "Moderate Productivity (Fertilizer Needed)" : "Low Natural Fertility"})
              </span>
            </div>
            <p className="text-xs text-amber-800 font-semibold flex items-center gap-1.5 pt-1">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>{soilData?.statusHeadline ?? "Nitrogen Deficit & Low Organic Matter (Semi-Arid Loam)"}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Soil Classification:</span>
              <strong className="text-slate-900 text-xs block mt-0.5">{soilData?.soilNameEn ?? farm.soilType}</strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Texture Fractions:</span>
              <strong className="text-slate-900 text-xs block mt-0.5">
                {soilData?.sandPct ?? 68}% Sand • {soilData?.clayPct ?? 14}% Clay
              </strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Live Root Moisture:</span>
              <strong className="text-blue-800 text-xs block mt-0.5">
                {soilData?.moisturePercent ?? 17.3}% (0-7cm)
              </strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Drainage Capacity:</span>
              <strong className="text-slate-900 text-xs block mt-0.5">
                {soilData?.drainage ?? "Moderate to Fast"}
              </strong>
            </div>
          </div>
        </div>

        {/* Primary Macronutrient (NPK) & Chemical Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-800" />
              Chemical Macronutrients & Soil Horizon Parameters
            </h2>
            <span className="text-xs text-slate-500">
              Calibrated against ICAR / Soil Health Card Norms
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Nitrogen (N) */}
            <div className="gov-card p-5 border border-red-200 bg-red-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red-950">
                  Available Nitrogen (N)
                </span>
                <span className="rounded bg-red-200 text-red-900 px-2 py-0.5 text-[10px] font-extrabold">
                  {soilData?.nitrogen.status ?? "DEFICIT"}
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 flex items-baseline gap-1">
                {soilData?.nitrogen.value ?? 165}
                <span className="text-xs font-normal text-slate-600">kg/ha</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <div>Agronomic Range: <strong className="text-slate-800">280–560 kg/ha</strong></div>
                <p className="text-[11px] text-red-800 leading-relaxed font-medium">
                  Significant nitrogen shortfall. Will stunt vegetative tillering and reduce wheat yield unless supplemented with split urea/compost.
                </p>
              </div>
            </div>

            {/* Phosphorus (P) */}
            <div className="gov-card p-5 border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Available Phosphorus (P₂O₅)
                </span>
                <span className="rounded bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[10px] font-extrabold">
                  {soilData?.phosphorus.status ?? "OPTIMAL"}
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 flex items-baseline gap-1">
                {soilData?.phosphorus.value ?? 16}
                <span className="text-xs font-normal text-slate-600">kg/ha</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <div>Agronomic Range: <strong className="text-slate-800">15–25 kg/ha</strong></div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Adequate for root elongation and seedling establishment. No emergency phosphorus required.
                </p>
              </div>
            </div>

            {/* Potassium (K) */}
            <div className="gov-card p-5 border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Available Potassium (K₂O)
                </span>
                <span className="rounded bg-blue-100 text-blue-900 px-2 py-0.5 text-[10px] font-extrabold">
                  {soilData?.potassium.status ?? "HIGH"}
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 flex items-baseline gap-1">
                {soilData?.potassium.value ?? 290}
                <span className="text-xs font-normal text-slate-600">kg/ha</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <div>Agronomic Range: <strong className="text-slate-800">150–280 kg/ha</strong></div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Rich potassium reserve enhances crop drought resilience and grain plumpness during filling.
                </p>
              </div>
            </div>

            {/* Soil pH */}
            <div className="gov-card p-5 border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Soil Reaction (pH)
                </span>
                <span className="rounded bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-extrabold">
                  {soilData?.ph.status ?? "SLIGHTLY_ALKALINE"}
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {soilData?.ph.value ?? 7.8}
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <div>Target Agricultural Range: <strong className="text-slate-800">6.5–7.5 pH</strong></div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Typical for semi-arid calcareous soils. Suitable for wheat, mustard, and pearl millet.
                </p>
              </div>
            </div>

            {/* Soil Organic Carbon (SOC) */}
            <div className="gov-card p-5 border border-amber-200 bg-amber-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
                  Soil Organic Carbon (SOC)
                </span>
                <span className="rounded bg-amber-200 text-amber-900 px-2 py-0.5 text-[10px] font-extrabold">
                  {soilData?.organicCarbon.status ?? "LOW"}
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 flex items-baseline gap-1">
                {soilData?.organicCarbon.value ?? 0.38}%
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <div>Target Healthy Soil: <strong className="text-slate-800">&gt; 0.75%</strong></div>
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  Low organic matter reduces water retention and soil biological activity. Incorporate crop residues and farmyard compost.
                </p>
              </div>
            </div>

            {/* Root-Zone Volumetric Moisture */}
            <div className="gov-card p-5 border border-blue-200 bg-blue-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-950">
                  Root-Zone Moisture (0–7cm)
                </span>
                <span className="rounded bg-blue-200 text-blue-900 px-2 py-0.5 text-[10px] font-extrabold">
                  {soilData && soilData.moisturePercent < 18 ? "DEFICIT" : "ADEQUATE"}
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 flex items-baseline gap-1">
                {soilData?.moisturePercent ?? 17.3}%
                <span className="text-xs font-normal text-slate-600">vol.</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <div>Subsoil (7–28cm): <strong className="text-slate-800">{soilData?.subsurfaceMoisturePercent ?? 24.4}%</strong></div>
                <p className="text-[11px] text-blue-900 leading-relaxed font-medium">
                  Surface horizon is drying rapidly under ambient solar radiation. Subsoil moisture remains partially accessible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Agronomic Recommendation Card */}
        <div className="gov-card p-5 border border-emerald-300 bg-emerald-50/50 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-wider">
            <Sprout className="h-4 w-4 text-emerald-800" />
            <span>AI Soil Prescription & Best Suited Crops</span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed">
            {soilData?.actionableRecommendation ?? "Apply split doses of nitrogen (urea/DAP) and incorporate farmyard manure/vermicompost (2-3 t/acre) to improve organic carbon and moisture retention."}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Best Adapted Crops for this Soil:</span>
            {(soilData?.bestSuitedCrops ?? ["Wheat", "Mustard", "Bajra", "Gram"]).map((crop) => (
              <span key={crop} className="rounded bg-white px-2.5 py-0.5 text-xs font-bold text-emerald-900 border border-emerald-200 shadow-2xs">
                {crop}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
