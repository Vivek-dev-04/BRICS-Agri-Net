"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  DEMO_FARM,
  DEMO_HEALTH_SCORES,
  DEMO_WEATHER,
  DEMO_ADVISORY,
} from "@/lib/mock-data";
import {
  AlertTriangle,
  ArrowRight,
  CloudSun,
  Droplets,
  FlaskConical,
  Leaf,
  MapPin,
  RefreshCw,
  Satellite,
  ShieldAlert,
  Sparkles,
  Sprout,
  TrendingDown,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Farm Header Banner */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-emerald-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/30">
                  Active Farm Profile
                </span>
                <span className="text-xs text-slate-400">ID: {DEMO_FARM.id}</span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
                {DEMO_FARM.name}
                <span className="text-sm font-normal text-slate-400">({DEMO_FARM.crop} • {DEMO_FARM.cropVariety})</span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                {DEMO_FARM.location} • {DEMO_FARM.areaAcres} Acres • {DEMO_FARM.irrigationType}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/advisory"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate Advisory
              </Link>
              <Link
                href="/disease"
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-200 hover:border-emerald-500/40 hover:text-white transition-all"
              >
                <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                Diagnose Leaf
              </Link>
              <Link
                href="/farms"
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 transition-all"
              >
                Switch Farm
              </Link>
            </div>
          </div>
        </div>

        {/* Pillar Scores Grid (PRD Section 6.1) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <Sprout className="h-4 w-4 text-emerald-400" />
              Composite Agro-Health Indices
            </h2>
            <span className="text-xs text-slate-400">Synced 12 mins ago</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* Overall Farm Health */}
            <div className="glass-panel glass-panel-hover rounded-xl p-4 border border-emerald-500/30 bg-emerald-950/10">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                <span>Farm Health</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px]">Overall</span>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{DEMO_HEALTH_SCORES.overallHealth}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-1.5 rounded-full"
                  style={{ width: `${DEMO_HEALTH_SCORES.overallHealth}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-emerald-300/80">Optimal vegetative index</p>
            </div>

            {/* Weather Risk */}
            <div className="glass-panel glass-panel-hover rounded-xl p-4 border border-amber-500/30 bg-amber-950/10">
              <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
                <span>Weather Risk</span>
                <CloudSun className="h-3.5 w-3.5" />
              </div>
              <div className="mt-3 text-2xl font-bold text-amber-300">
                {DEMO_HEALTH_SCORES.weatherRisk}
              </div>
              <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-1.5 rounded-full"
                  style={{ width: `${DEMO_HEALTH_SCORES.weatherRiskScore}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-amber-300/80">Low 48h rain probability</p>
            </div>

            {/* Soil Health */}
            <div className="glass-panel glass-panel-hover rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Soil Health</span>
                <FlaskConical className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{DEMO_HEALTH_SCORES.soilHealth}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-400 h-1.5 rounded-full"
                  style={{ width: `${DEMO_HEALTH_SCORES.soilHealth}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Nitrogen deficit detected</p>
            </div>

            {/* Crop Health */}
            <div className="glass-panel glass-panel-hover rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Crop Health</span>
                <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{DEMO_HEALTH_SCORES.cropHealth}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${DEMO_HEALTH_SCORES.cropHealth}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Tillering stage active</p>
            </div>

            {/* Disease Risk */}
            <div className="glass-panel glass-panel-hover rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Disease Risk</span>
                <ShieldAlert className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="mt-3 text-2xl font-bold text-emerald-400">
                {DEMO_HEALTH_SCORES.diseaseRisk}
              </div>
              <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `25%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">No active pathogens</p>
            </div>
          </div>
        </div>

        {/* Active Agricultural Risk Alerts */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Active Agronomic Alerts ({DEMO_HEALTH_SCORES.activeAlerts.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEMO_HEALTH_SCORES.activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="glass-panel rounded-xl p-4 border border-amber-500/25 bg-amber-950/10 flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-amber-300">{alert.title}</h4>
                  <p className="mt-0.5 text-xs text-slate-300/90 leading-relaxed">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dual Core Sections: Latest AI Advisory & Telemetry Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 Cols: AI Agro-Advisory Preview */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Latest AI Agro-Advisory</h3>
                  <p className="text-xs text-slate-400">Synthesized from Soil + Weather + NDVI</p>
                </div>
              </div>
              <Link
                href="/advisory"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
              >
                Full Analysis <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3.5">
              <div className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                  <Droplets className="h-3.5 w-3.5" />
                  <span>💧 Irrigation Advisory</span>
                  <span className="ml-auto rounded bg-blue-500/20 px-2 py-0.5 text-[10px] text-blue-200">
                    Priority Action
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  {DEMO_ADVISORY.irrigation.recommendation}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <FlaskConical className="h-3.5 w-3.5" />
                  <span>🌱 Soil & Nutrient Supplementation</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  {DEMO_ADVISORY.soil.recommendation}
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>⚠ Disease & Pest Watch</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  {DEMO_ADVISORY.diseaseRisk.recommendation}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-900/60 p-3 text-[11px] text-slate-400 border border-slate-800/80">
              Disclaimer: AI-generated recommendations provide advisory intelligence and should not replace certified local agricultural extension services.
            </div>
          </div>

          {/* Right Col: Satellite NDVI & Weather Snippets */}
          <div className="space-y-4">
            {/* NDVI Glance */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Satellite className="h-4 w-4 text-emerald-400" />
                  <span>Sentinel-2 Vegetation NDVI</span>
                </div>
                <Link href="/satellite" className="text-[11px] text-emerald-400 hover:underline">
                  Trends →
                </Link>
              </div>

              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <div className="text-3xl font-bold text-white">{DEMO_HEALTH_SCORES.ndviCurrent}</div>
                  <p className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                    <TrendingDown className="h-3 w-3" />
                    Declining from 0.72 peak
                  </p>
                </div>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 border border-amber-500/30">
                  Moderate Stress
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                Vegetation canopy vigor indicates mild water/nitrogen stress in quadrant NW-2.
              </p>
            </div>

            {/* Weather Glance */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CloudSun className="h-4 w-4 text-blue-400" />
                  <span>Localized Weather</span>
                </div>
                <Link href="/weather" className="text-[11px] text-blue-400 hover:underline">
                  5-Day →
                </Link>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-white">{DEMO_WEATHER.current.temp}°C</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{DEMO_WEATHER.current.condition}</p>
                </div>
                <div className="text-right text-xs text-slate-300 space-y-1">
                  <div>Humidity: <span className="font-semibold text-white">{DEMO_WEATHER.current.humidity}%</span></div>
                  <div>Wind: <span className="font-semibold text-white">{DEMO_WEATHER.current.windSpeedKmh} km/h</span></div>
                </div>
              </div>
            </div>

            {/* BRICS Interoperability CTA */}
            <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 bg-gradient-to-br from-slate-900 to-emerald-950/20">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
                  BRICS Data Node
                </h4>
                <span className="text-[10px] text-emerald-400 font-mono">CADS-v1</span>
              </div>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Farm telemetry is standardized into the BRICS agricultural exchange format with farmer PII anonymized.
              </p>
              <Link
                href="/interoperability"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Inspect CADS Schema →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
