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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-900 border border-emerald-300">
              Module 4
            </span>
            <span className="text-xs text-slate-500 font-medium">Earth Observation & Remote Sensing</span>
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Satellite className="h-7 w-7 text-emerald-800" />
            Satellite Crop Health & NDVI Monitoring
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Multispectral Sentinel-2 remote sensing telemetry tracking canopy chlorophyll absorption and vegetative stress.
          </p>
        </div>

        {/* Current Indicator & Scale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="gov-card rounded-2xl p-5 border border-slate-200 bg-white shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current NDVI Index</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900">{DEMO_HEALTH_SCORES.ndviCurrent}</span>
              <span className="text-xs text-amber-700 flex items-center gap-0.5 font-bold">
                <TrendingDown className="h-3.5 w-3.5" /> -0.11 vs Heading Peak
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-700">
              Classification: <strong className="text-amber-800">Moderate Canopy Stress</strong>
            </p>
            <div className="mt-3 text-[11px] text-slate-500 leading-relaxed">
              Drop observed between heading and grain filling stages indicates accelerated leaf senescence due to water/nitrogen shortfall.
            </div>
          </div>

          <div className="md:col-span-2 gov-card rounded-2xl p-5 border border-slate-200 bg-white shadow-xs">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between mb-3 uppercase tracking-wider">
              <span>NDVI Agricultural Interpretation Scale</span>
              <span className="text-[10px] text-slate-500 font-mono">PRD Ref: Section 9</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-900 font-mono">0.75 – 1.00</span>
                <span className="text-emerald-800 font-semibold">Vigorous / Healthy Canopy</span>
                <span className="text-slate-600 text-[11px]">Dense biomass, peak photosynthesis</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 font-mono">0.60 – 0.74</span>
                <span className="text-slate-800 font-semibold">Normal Vegetative State</span>
                <span className="text-slate-600 text-[11px]">Standard vegetative canopy</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-900 font-mono">0.45 – 0.59</span>
                <span className="text-amber-800 font-semibold">Moderate Stress Zone</span>
                <span className="text-amber-900 text-[11px] font-bold">Current Status: Requires Irrigation</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 border border-red-200">
                <span className="font-bold text-red-900 font-mono">&lt; 0.45</span>
                <span className="text-red-800 font-semibold">Severe Stress / Sparse</span>
                <span className="text-slate-600 text-[11px]">Severe chlorosis, soil exposure, pest damage</span>
              </div>
            </div>
          </div>
        </div>

        {/* NDVI Temporal Trend Chart */}
        <div className="gov-card rounded-2xl p-6 border border-slate-200 bg-white space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-800" />
                Temporal NDVI Progression vs Seasonal Benchmark
              </h3>
              <p className="text-xs text-slate-600">
                Crop: {DEMO_FARM.crop} ({DEMO_FARM.cropVariety}) • Sentinel-2 10m Ground Resolution
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-700 inline-block" /> Observed NDVI
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400 inline-block" /> Benchmark Normal
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEMO_NDVI_SERIES} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0.2, 0.9]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#cbd5e1",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#0f172a",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <ReferenceLine y={0.65} stroke="#2563eb" strokeDasharray="4 4" label={{ value: "Healthy Threshold", fill: "#1e40af", fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="ndvi"
                  stroke="#047857"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#047857" }}
                  activeDot={{ r: 6 }}
                  name="Observed NDVI"
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Regional Benchmark"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <Info className="h-4 w-4 text-emerald-800 shrink-0" />
            <span>
              The divergence detected at the Current observation point triggers an automated advisory rule flagging water and nutrient stress.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
