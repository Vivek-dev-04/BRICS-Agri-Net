"use client";

import { Navbar } from "@/components/Navbar";
import { DEMO_FARM, DEMO_NDVI_SERIES, DEMO_HEALTH_SCORES } from "@/lib/mock-data";
import { Satellite, TrendingDown, Layers, Info } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function SatellitePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              Module 4
            </span>
            <span className="text-xs text-slate-400">Earth Observation & Remote Sensing</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Satellite className="h-6 w-6 text-emerald-400" />
            Satellite Crop Health & NDVI Monitoring
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Multispectral Sentinel-2 remote sensing telemetry tracking canopy chlorophyll absorption and vegetative stress.
          </p>
        </div>

        {/* Current Indicator & Scale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 bg-amber-950/10">
            <div className="text-xs font-semibold text-amber-400">Current NDVI Index</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">{DEMO_HEALTH_SCORES.ndviCurrent}</span>
              <span className="text-xs text-amber-400 flex items-center gap-0.5 font-medium">
                <TrendingDown className="h-3.5 w-3.5" /> -0.11 vs Heading Peak
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-300">
              Classification: <strong className="text-amber-300">Moderate Canopy Stress</strong>
            </p>
            <div className="mt-3 text-[11px] text-slate-400 leading-relaxed">
              Drop observed between heading and grain filling stages indicates accelerated leaf senescence due to water/nitrogen shortfall.
            </div>
          </div>

          <div className="md:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-3">
              <span>NDVI Agricultural Interpretation Scale</span>
              <span className="text-[10px] text-slate-500">PRD Ref: Section 9</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                <span className="font-semibold text-emerald-400">0.75 – 1.00</span>
                <span className="text-emerald-300">Vigorous / Healthy Canopy</span>
                <span className="text-slate-400 text-[11px]">Dense biomass, peak photosynthesis</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-slate-300">0.60 – 0.74</span>
                <span className="text-slate-300">Normal Vegetative State</span>
                <span className="text-slate-400 text-[11px]">Standard vegetative canopy</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/20 border border-amber-500/40">
                <span className="font-semibold text-amber-400">0.45 – 0.59</span>
                <span className="text-amber-300">Moderate Stress Zone</span>
                <span className="text-amber-200/80 text-[11px]">Current Status: Requires Irrigation</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-950/20 border border-red-500/30">
                <span className="font-semibold text-red-400">&lt; 0.45</span>
                <span className="text-red-300">Severe Stress / Sparse</span>
                <span className="text-slate-400 text-[11px]">Severe chlorosis, soil exposure, pest damage</span>
              </div>
            </div>
          </div>
        </div>

        {/* NDVI Temporal Trend Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                Temporal NDVI Progression vs Seasonal Benchmark
              </h3>
              <p className="text-xs text-slate-400">
                Crop: {DEMO_FARM.crop} ({DEMO_FARM.cropVariety}) • Sentinel-2 10m Ground Resolution
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" /> Observed NDVI
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-slate-500 inline-block" /> Benchmark Normal
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEMO_NDVI_SERIES} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0.2, 0.9]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <ReferenceLine y={0.65} stroke="#3b82f6" strokeDasharray="4 4" label={{ value: "Healthy Threshold", fill: "#93c5fd", fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="ndvi"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981" }}
                  activeDot={{ r: 6 }}
                  name="Observed NDVI"
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Regional Benchmark"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <Info className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              The divergence detected at the Current observation point triggers an automated advisory rule flagging water and nutrient stress.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
