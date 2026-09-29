"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  DEMO_HEALTH_SCORES,
  DEMO_WEATHER,
  DEMO_ADVISORY,
} from "@/lib/mock-data";
import { useFarm } from "@/context/FarmContext";
import {
  AlertTriangle,
  ArrowRight,
  CloudSun,
  Droplets,
  FlaskConical,
  Leaf,
  MapPin,
  Satellite,
  ShieldAlert,
  Sparkles,
  Sprout,
  TrendingDown,
  Info,
} from "lucide-react";

export default function DashboardPage() {
  const { farm, user, soil } = useFarm();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Farm Header Banner (Government Style) */}
        <div className="gov-card bg-white p-6 border border-slate-200 border-l-4 border-l-emerald-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-50 text-emerald-800 px-2 py-0.5 text-xs font-bold border border-emerald-200">
                  Active Farm Parcel
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: {farm.id}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600 font-medium">Owner: {user.name}</span>
              </div>

              <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
                {farm.name}
                <span className="text-sm font-normal text-slate-600">
                  ({farm.crop} • {farm.cropVariety})
                </span>
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-700" />
                <span>{farm.location}</span>
                <span className="text-slate-400">•</span>
                <span>{farm.areaAcres} Acres</span>
                <span className="text-slate-400">•</span>
                <span>{farm.irrigationType}</span>
                <span className="text-slate-400">•</span>
                <span>{farm.soilType}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/advisory"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate Advisory
              </Link>
              <Link
                href="/disease"
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                <Leaf className="h-3.5 w-3.5 text-emerald-700" />
                Diagnose Leaf
              </Link>
              <Link
                href="/farms"
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                Switch Farm
              </Link>
            </div>
          </div>
        </div>

        {/* Agro-Health Scorecard */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sprout className="h-4 w-4 text-emerald-700" />
              Composite Agro-Health Indices
            </h2>
            <span className="text-xs text-slate-500">Updated today</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* Overall Farm Health */}
            <div className="gov-card p-4 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Farm Health</span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-800 font-bold border border-emerald-200">
                  Overall
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">{DEMO_HEALTH_SCORES.overallHealth}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{ width: `${DEMO_HEALTH_SCORES.overallHealth}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-emerald-800 font-medium">Optimal vegetative health</p>
            </div>

            {/* Weather Risk */}
            <div className="gov-card p-4 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Weather Risk</span>
                <CloudSun className="h-4 w-4 text-amber-600" />
              </div>
              <div className="mt-2.5 text-2xl font-bold text-amber-700">
                {DEMO_HEALTH_SCORES.weatherRisk}
              </div>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full"
                  style={{ width: `${DEMO_HEALTH_SCORES.weatherRiskScore}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-600">Low 48h rain probability</p>
            </div>

            {/* Soil Health */}
            <div className="gov-card p-4 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Soil Health</span>
                <FlaskConical className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">{soil?.soilScore ?? DEMO_HEALTH_SCORES.soilHealth}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${soil?.soilScore ?? DEMO_HEALTH_SCORES.soilHealth}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-600 truncate">{soil?.status ?? "Optimal NPK balance"}</p>
            </div>

            {/* Crop Health */}
            <div className="gov-card p-4 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Crop Health</span>
                <Leaf className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">{DEMO_HEALTH_SCORES.cropHealth}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{ width: `${DEMO_HEALTH_SCORES.cropHealth}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-600">Tillering stage active</p>
            </div>

            {/* Disease Risk */}
            <div className="gov-card p-4 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Disease Risk</span>
                <ShieldAlert className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2.5 text-2xl font-bold text-emerald-700">
                {DEMO_HEALTH_SCORES.diseaseRisk}
              </div>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{ width: "25%" }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-600">No active pathogens</p>
            </div>
          </div>
        </div>

        {/* Active Agronomic Warning Alerts */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Active Agronomic Bulletins & Warnings ({DEMO_HEALTH_SCORES.activeAlerts.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEMO_HEALTH_SCORES.activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="gov-card p-4 border-l-4 border-l-amber-500 bg-amber-50/50 border border-slate-200 flex items-start gap-3"
              >
                <div className="p-1.5 rounded bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">{alert.title}</h4>
                  <p className="mt-0.5 text-xs text-slate-700 leading-relaxed">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Split Grid: AI Agro-Advisory Preview & Telemetry Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 Cols: AI Agro-Advisory Preview */}
          <div className="lg:col-span-2 gov-card p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Latest AI Agro-Advisory</h3>
                  <p className="text-xs text-slate-500">Synthesized from Soil + Weather + Satellite</p>
                </div>
              </div>

              <Link
                href="/advisory"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
              >
                Full Analysis <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <Droplets className="h-4 w-4 text-blue-700" />
                  <span>Irrigation Advisory</span>
                  <span className="ml-auto rounded bg-blue-200 px-2 py-0.5 text-[10px] text-blue-900 font-bold">
                    Priority Action
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-800 leading-relaxed">
                  {DEMO_ADVISORY.irrigation.recommendation}
                </p>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <FlaskConical className="h-4 w-4 text-emerald-700" />
                  <span>Soil & Nutrient Supplementation</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-800 leading-relaxed">
                  {DEMO_ADVISORY.soil.recommendation}
                </p>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <ShieldAlert className="h-4 w-4 text-amber-700" />
                  <span>Disease & Pathogen Watch</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-800 leading-relaxed">
                  {DEMO_ADVISORY.diseaseRisk.recommendation}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-200">
              Disclaimer: Advisory generated via agricultural AI reasoning. Confirmation with district agricultural extension officers recommended.
            </div>
          </div>

          {/* Right Col: Satellite NDVI & Weather Highlights */}
          <div className="space-y-4">
            {/* NDVI Card */}
            <div className="gov-card p-5 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Satellite className="h-4 w-4 text-emerald-700" />
                  <span>Sentinel-2 Vegetation NDVI</span>
                </div>
                <Link href="/satellite" className="text-xs text-emerald-800 font-semibold hover:underline">
                  Trends →
                </Link>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900">{DEMO_HEALTH_SCORES.ndviCurrent}</div>
                  <p className="text-[11px] text-amber-700 flex items-center gap-1 mt-0.5 font-medium">
                    <TrendingDown className="h-3 w-3" /> Declining from 0.72 peak
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-bold border border-amber-300">
                  Moderate Stress
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                Vegetation canopy vigor indicates mild moisture/nitrogen deficit in quadrant NW-2.
              </p>
            </div>

            {/* Weather Card */}
            <div className="gov-card p-5 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <CloudSun className="h-4 w-4 text-blue-700" />
                  <span>Local Meteorological Station</span>
                </div>
                <Link href="/weather" className="text-xs text-blue-800 font-semibold hover:underline">
                  5-Day →
                </Link>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900">{DEMO_WEATHER.current.temp}°C</div>
                  <p className="text-xs text-slate-600 mt-0.5">{DEMO_WEATHER.current.condition}</p>
                </div>
                <div className="text-right text-xs text-slate-600 space-y-1">
                  <div>Humidity: <strong className="text-slate-900">{DEMO_WEATHER.current.humidity}%</strong></div>
                  <div>Wind: <strong className="text-slate-900">{DEMO_WEATHER.current.windSpeedKmh} km/h</strong></div>
                </div>
              </div>
            </div>

            {/* BRICS Interoperability Node */}
            <div className="gov-card p-5 border border-slate-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sprout className="h-4 w-4 text-emerald-700" />
                  BRICS Data Node Status
                </h4>
                <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Farm telemetry is standardized into the BRICS Common Agricultural Data Schema (CADS).
              </p>
              <Link
                href="/brics-network"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 pt-1"
              >
                Inspect Network Nodes →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
