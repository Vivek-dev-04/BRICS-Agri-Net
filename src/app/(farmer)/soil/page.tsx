"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DEMO_SOIL } from "@/lib/mock-data";
import { useFarm } from "@/context/FarmContext";
import { FlaskConical, CheckCircle2, AlertCircle, Info, RefreshCw } from "lucide-react";

export default function SoilHealthPage() {
  const { farm, soil: activeSoil } = useFarm();
  const [isEditing, setIsEditing] = useState(false);

  // Synthesize reactive soil data from active farm
  const soil = {
    nitrogen: {
      value: activeSoil?.nitrogen ?? DEMO_SOIL.nitrogen.value,
      status: (activeSoil?.nitrogen ?? 180) > 220 ? "OPTIMAL" : "MEDIUM",
      unit: "kg/ha",
      optimal: "280-560",
    },
    phosphorus: {
      value: activeSoil?.phosphorus ?? DEMO_SOIL.phosphorus.value,
      status: (activeSoil?.phosphorus ?? 18) > 20 ? "OPTIMAL" : "MEDIUM",
      unit: "kg/ha",
      optimal: "15-25",
    },
    potassium: {
      value: activeSoil?.potassium ?? DEMO_SOIL.potassium.value,
      status: (activeSoil?.potassium ?? 310) > 250 ? "HIGH" : "OPTIMAL",
      unit: "kg/ha",
      optimal: "150-280",
    },
    ph: {
      value: activeSoil?.ph ?? DEMO_SOIL.ph.value,
      status: "OPTIMAL",
      unit: "pH",
      optimal: "6.5-7.5",
    },
    organicCarbon: {
      value: activeSoil?.organicCarbon ?? DEMO_SOIL.organicCarbon.value,
      status: (activeSoil?.organicCarbon ?? 0.42) > 0.6 ? "OPTIMAL" : "MODERATE",
      unit: "%",
      optimal: "> 0.75%",
    },
    moisture: {
      value: activeSoil?.moisture ?? DEMO_SOIL.moisture.value,
      status: (activeSoil?.moisture ?? 18.5) > 25 ? "ADEQUATE" : "DEFICIT",
      unit: "%",
      optimal: "25-35%",
    },
  };

  const soilScore = activeSoil?.soilScore ?? 68;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/30">
                Module 5
              </span>
              <span className="text-xs text-slate-400">Soil Chemical & Physical Telemetry</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-blue-400" />
              Soil Health & Nutrient Profiling
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              Laboratory and field test evaluation of primary macronutrients (NPK), pH equilibrium, organic matter, and moisture for <strong className="text-emerald-400">{farm.name}</strong> ({farm.location}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 transition-colors"
            >
              {isEditing ? "Close Editor" : "Log New Soil Test"}
            </button>
          </div>
        </div>

        {/* Top Summary Card */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 to-blue-950/20">
          <div>
            <span className="text-xs text-slate-400">Composite Soil Quality Index</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-white">{soilScore}</span>
              <span className="text-xs text-slate-400">/ 100 ({soilScore >= 80 ? "Optimal Condition" : soilScore >= 70 ? "Good Condition" : "Fair Condition"})</span>
            </div>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {activeSoil?.status ?? "Optimal NPK balance and nutrient availability"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">Soil Texture:</span>
              <div className="font-semibold text-white mt-0.5">{farm.soilType}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">pH Reaction:</span>
              <div className="font-semibold text-emerald-400 mt-0.5">{soil.ph.value} (Optimal)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">GPS Telemetry:</span>
              <div className="font-semibold text-slate-200 mt-0.5 font-mono text-[11px]">{farm.latitude.toFixed(2)}°N, {farm.longitude.toFixed(2)}°E</div>
            </div>
          </div>
        </div>

        {/* Macronutrients and Chemical Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Nitrogen */}
          <div className="glass-panel rounded-2xl p-5 border border-red-500/30 bg-red-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Available Nitrogen (N)</span>
              <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300">
                {soil.nitrogen.status}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-white">{soil.nitrogen.value}</span>
              <span className="text-xs text-slate-400">{soil.nitrogen.unit}</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Target Range: <strong className="text-slate-200">{soil.nitrogen.optimal}</strong>
            </div>
            <p className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
              Recommendation: Supplement with 25 kg/acre urea or organic compost tea before flowering.
            </p>
          </div>

          {/* Phosphorus */}
          <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Available Phosphorus (P)</span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                {soil.phosphorus.status}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-white">{soil.phosphorus.value}</span>
              <span className="text-xs text-slate-400">{soil.phosphorus.unit}</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Target Range: <strong className="text-slate-200">{soil.phosphorus.optimal}</strong>
            </div>
            <p className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
              Status: Adequate for vegetative root architecture and tillering.
            </p>
          </div>

          {/* Potassium */}
          <div className="glass-panel rounded-2xl p-5 border border-blue-500/30 bg-blue-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Available Potassium (K)</span>
              <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                {soil.potassium.status}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-white">{soil.potassium.value}</span>
              <span className="text-xs text-slate-400">{soil.potassium.unit}</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Target Range: <strong className="text-slate-200">{soil.potassium.optimal}</strong>
            </div>
            <p className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
              Status: High reserves enhance plant osmotic regulation and rust tolerance.
            </p>
          </div>

          {/* Soil pH */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Soil Reaction (pH)</span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                {soil.ph.status}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-white">{soil.ph.value}</span>
              <span className="text-xs text-slate-400">{soil.ph.unit}</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Target Range: <strong className="text-slate-200">{soil.ph.optimal}</strong>
            </div>
            <p className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
              Neutral pH ensures optimal availability of both macro and micro nutrients without toxicity.
            </p>
          </div>

          {/* Organic Carbon */}
          <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 bg-amber-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Organic Carbon (OC)</span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                {soil.organicCarbon.status}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-white">{soil.organicCarbon.value}</span>
              <span className="text-xs text-slate-400">{soil.organicCarbon.unit}</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Target Range: <strong className="text-slate-200">{soil.organicCarbon.optimal}</strong>
            </div>
            <p className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
              Critical Deficit: Adopt crop residue mulching and vermicompost to rebuild microbial biomass.
            </p>
          </div>

          {/* Soil Moisture */}
          <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 bg-amber-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Volumetric Moisture</span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                {soil.moisture.status}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-white">{soil.moisture.value}</span>
              <span className="text-xs text-slate-400">{soil.moisture.unit}</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Target Range: <strong className="text-slate-200">{soil.moisture.optimal}</strong>
            </div>
            <p className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
              Approaching temporary wilting threshold for wheat during grain fill. Drip cycle recommended.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
