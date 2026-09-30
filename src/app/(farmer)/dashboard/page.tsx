"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  DEMO_HEALTH_SCORES,
  DEMO_WEATHER,
} from "@/lib/mock-data";
import { useFarm } from "@/context/FarmContext";
import { WeatherData } from "@/lib/services/weatherService";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CloudSun,
  Droplets,
  FlaskConical,
  Leaf,
  MapPin,
  Plus,
  Satellite,
  ShieldAlert,
  Sparkles,
  Sprout,
  TrendingDown,
  Info,
  Compass,
  CheckCircle2,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Clock,
  Check,
} from "lucide-react";
import { AddFarmModal } from "@/components/farmer/AddFarmModal";

export default function DashboardPage() {
  const { farm, user, soil } = useFarm();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"farmer" | "technical">("farmer");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [actionDone, setActionDone] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const lat = farm.latitude || 26.9124;
    const lon = farm.longitude || 75.7873;
    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setWeather(data.data);
        }
      })
      .catch((err) => console.error("Dashboard weather fetch error:", err));
  }, [farm.latitude, farm.longitude]);

  // Audio Read Aloud for Farmers (using browser SpeechSynthesis)
  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `Today's Field Action Summary for ${farm.name}. 
      First action: Irrigation needed today. Run drip for 4 to 5 hours. Soil moisture is low at 17 percent.
      Second action: Apply 25 kilograms per acre Urea with watering to support tillering stage.
      Third action: High morning humidity. Inspect lower leaves for yellow or rust spots.
      Overall farm condition is good at 81 out of 100.`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleAction = (id: string) => {
    setActionDone((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb back to My Farms */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link
              href="/farms"
              className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-bold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>← Back to My Farms</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold">{farm.name}</span>
          </div>

          {/* Farmer-Friendly View Mode & Audio Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSpeech}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isSpeaking
                  ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
              title="Listen to today's field actions read aloud"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-amber-700" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Audio Field Guide</span>
                </>
              )}
            </button>

            {/* View Mode Toggle: Simple Farmer vs Detailed Technical */}
            <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("farmer")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === "farmer"
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Farmer View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("technical")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === "technical"
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Technical Data
              </button>
            </div>
          </div>
        </div>

        {/* Farm Header Banner */}
        <div className="gov-card bg-white p-5 sm:p-6 border border-slate-200 border-l-4 border-l-emerald-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-emerald-50 text-emerald-800 px-2 py-0.5 text-xs font-bold border border-emerald-200">
                  Active Farm Parcel
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: {farm.id}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-600 font-medium">Farmer: {user.name}</span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Field Status: Growing Well
                </span>
              </div>

              <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
                {farm.name}
                <span className="text-sm font-semibold text-slate-600">
                  ({farm.crop} • {farm.cropVariety})
                </span>
              </h1>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-600">
                <span className="flex items-center gap-1 font-medium text-slate-800">
                  <MapPin className="h-4 w-4 text-emerald-700" />
                  {farm.location}
                </span>
                <span className="text-slate-300">•</span>
                <span><strong>{farm.areaAcres}</strong> Total Acres</span>
                <span className="text-slate-300">•</span>
                <span>Irrigation: <strong>{farm.irrigationType}</strong></span>
                <span className="text-slate-300">•</span>
                <span>Soil: <strong>{farm.soilType}</strong></span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
              <Link
                href="/advisory"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Live AI Advisory
              </Link>
              <Link
                href="/crop-planner"
                className="flex items-center gap-1.5 rounded-lg border border-teal-600 bg-teal-50 px-3.5 py-2.5 text-xs font-bold text-teal-900 hover:bg-teal-100 transition-colors shadow-2xs"
              >
                <Compass className="h-3.5 w-3.5 text-teal-700" />
                <span>What to Plant?</span>
              </Link>
              <Link
                href="/disease"
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Leaf className="h-3.5 w-3.5 text-emerald-700" />
                Diagnose Leaf
              </Link>
              <button
                type="button"
                onClick={() => setIsAddFarmOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Plus className="h-3.5 w-3.5 text-slate-500" />
                + Add Farm
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 1: TODAY'S FIELD ACTION GUIDE (Direct & Action-First for Farmers) */}
        <div className="gov-card p-5 sm:p-6 border border-slate-200 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-700/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-700/60 rounded-lg text-emerald-200">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Today&apos;s Field Action Guide
                  <span className="bg-amber-400 text-slate-950 text-[10px] uppercase font-black px-2 py-0.5 rounded-full">
                    Action Plan
                  </span>
                </h2>
                <p className="text-xs text-emerald-200/90">
                  Clear, practical field tasks for {farm.name} synthesized from real-time weather and soil telemetry.
                </p>
              </div>
            </div>

            <span className="text-[11px] text-emerald-300/80 font-mono">
              Auto-calibrated for {farm.crop}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Task 1: Irrigation */}
            <div
              className={`rounded-xl p-4 transition-all border ${
                actionDone["irrigation"]
                  ? "bg-emerald-950/60 border-emerald-600/40 opacity-75"
                  : "bg-white text-slate-900 border-white shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-700">
                  <Droplets className="h-4 w-4" /> 1. Irrigation Task
                </span>
                <span className="rounded-full bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 text-[10px] font-bold">
                  Urgent Today
                </span>
              </div>

              <h3 className="mt-2 text-base font-extrabold text-slate-900 leading-snug">
                Run Drip for 4–5 Hours Today
              </h3>

              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {viewMode === "farmer" ? (
                  <>
                    <strong>Why:</strong> The soil at root depth is drying out ({weather?.current.soilMoisturePercent ?? 17.3}% moisture). With hot sunny weather, water your field by evening to keep crop vigorous.
                  </>
                ) : (
                  <>
                    <strong>Telemetry:</strong> Root moisture 17.3% (Threshold: 35%). Evaporation rate (ET₀): {weather?.forecast[0]?.et0Mm ?? 4.5} mm/day. 48h precipitation probability: {weather?.forecast[0]?.rainProb ?? 15}%.
                  </>
                )}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                  Dose: 30–35 mm
                </span>
                <button
                  type="button"
                  onClick={() => toggleAction("irrigation")}
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                    actionDone["irrigation"]
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                  {actionDone["irrigation"] ? "Completed" : "Mark Done"}
                </button>
              </div>
            </div>

            {/* Task 2: Fertilizer */}
            <div
              className={`rounded-xl p-4 transition-all border ${
                actionDone["fertilizer"]
                  ? "bg-emerald-950/60 border-emerald-600/40 opacity-75"
                  : "bg-white text-slate-900 border-white shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
                  <FlaskConical className="h-4 w-4" /> 2. Nutrition Task
                </span>
                <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                  Due This Week
                </span>
              </div>

              <h3 className="mt-2 text-base font-extrabold text-slate-900 leading-snug">
                Apply 25 kg/acre Urea or Compost
              </h3>

              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {viewMode === "farmer" ? (
                  <>
                    <strong>Why:</strong> Your {farm.crop} is in active leafy tillering stage. Soil test shows Nitrogen is low; adding fertilizer with irrigation promotes strong stems and prevents pale leaves.
                  </>
                ) : (
                  <>
                    <strong>Telemetry:</strong> Available N: {soil?.nitrogen ?? 165} kg/ha (Target &gt; 280 kg/ha). Organic carbon: {soil?.organicCarbon ?? 0.38}%. pH: {soil?.ph ?? 7.8}.
                  </>
                )}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Split Top-Dressing
                </span>
                <button
                  type="button"
                  onClick={() => toggleAction("fertilizer")}
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                    actionDone["fertilizer"]
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                  {actionDone["fertilizer"] ? "Completed" : "Mark Done"}
                </button>
              </div>
            </div>

            {/* Task 3: Crop Scouting & Disease */}
            <div
              className={`rounded-xl p-4 transition-all border ${
                actionDone["scouting"]
                  ? "bg-emerald-950/60 border-emerald-600/40 opacity-75"
                  : "bg-white text-slate-900 border-white shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700">
                  <ShieldAlert className="h-4 w-4" /> 3. Crop Inspection
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                  Recommended
                </span>
              </div>

              <h3 className="mt-2 text-base font-extrabold text-slate-900 leading-snug">
                Check Lower Leaves for Rust Spots
              </h3>

              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {viewMode === "farmer" ? (
                  <>
                    <strong>Why:</strong> Morning air is humid ({weather?.current.humidity ?? 46}%), which can trigger leaf rust. Walk your field rows; if leaves have orange/brown spots, snap a quick photo.
                  </>
                ) : (
                  <>
                    <strong>Telemetry:</strong> Microclimate RH {weather?.current.humidity ?? 46}%, Wind {weather?.current.windSpeedKmh ?? 11} km/h. Canopy NDVI 0.61.
                  </>
                )}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/disease"
                  className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline"
                >
                  Scan Leaf Photo →
                </Link>
                <button
                  type="button"
                  onClick={() => toggleAction("scouting")}
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                    actionDone["scouting"]
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                  {actionDone["scouting"] ? "Completed" : "Mark Done"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPOSITE AGRO-HEALTH INDICES (Simplified Orientation with Calibrated Status) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sprout className="h-4 w-4 text-emerald-700" />
                Composite Agro-Health Indices
              </h2>
              <p className="text-xs text-slate-500">
                {viewMode === "farmer"
                  ? "Traffic-light statuses tell you at a glance how each pillar of your farm is performing."
                  : "Calibrated 4-Pillar agronomic index incorporating satellite, meteorological, and pedological feeds."}
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">Updated today</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* 1. Overall Farm Health */}
            <div className="gov-card p-4 border border-slate-200 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>1. Overall Health</span>
                <span className="rounded bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Optimal
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
              <p className="mt-2 text-[11px] text-emerald-800 font-semibold leading-tight">
                {viewMode === "farmer" ? "Growing strongly; maintain irrigation." : "Optimal vegetative vigor index."}
              </p>
            </div>

            {/* 2. Weather Risk */}
            <div className="gov-card p-4 border border-slate-200 hover:border-amber-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>2. Water & Weather</span>
                <span className="rounded bg-red-100 text-red-900 px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600" /> Moisture Deficit
                </span>
              </div>
              <div className="mt-2.5 text-2xl font-extrabold text-red-700 capitalize">
                Water Needed
              </div>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-red-500 h-1.5 rounded-full w-4/5" />
              </div>
              <p className="mt-2 text-[11px] text-slate-600 leading-tight">
                {viewMode === "farmer" ? "No rain expected in 48h. Evaporation high." : "Low precipitation; ET₀ exceeds soil recharge."}
              </p>
            </div>

            {/* 3. Soil Health */}
            <div className="gov-card p-4 border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>3. Soil Fertility</span>
                <span className="rounded bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-600" /> Low Nitrogen
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900" suppressHydrationWarning>
                  {soil?.soilScore ?? DEMO_HEALTH_SCORES.soilHealth}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${soil?.soilScore ?? DEMO_HEALTH_SCORES.soilHealth}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-600 truncate leading-tight" suppressHydrationWarning>
                {viewMode === "farmer" ? "P & K great; add Nitrogen/compost." : (soil?.status ?? "Optimal NPK balance")}
              </p>
            </div>

            {/* 4. Crop Health */}
            <div className="gov-card p-4 border border-slate-200 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>4. Crop Canopy</span>
                <span className="rounded bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Dense Canopy
                </span>
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
              <p className="mt-2 text-[11px] text-slate-600 leading-tight">
                {viewMode === "farmer" ? "Active leafy stage; green foliage." : "Tillering stage active, NDVI 0.61."}
              </p>
            </div>

            {/* 5. Disease Risk */}
            <div className="gov-card p-4 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>5. Disease Risk</span>
                <span className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Unscreened
                </span>
              </div>
              <div className="mt-2.5 text-2xl font-extrabold text-slate-700">
                Unscreened
              </div>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-slate-300 h-1.5 rounded-full w-0" />
              </div>
              <Link href="/disease" className="mt-2 text-[11px] text-emerald-800 font-bold hover:underline block leading-tight">
                + Scan Leaf Photo →
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 3: ACTIVE AGRONOMIC BULLETINS */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Active Agronomic Bulletins & Alarms
            </h3>
            <span className="text-xs text-slate-500">
              {viewMode === "farmer" ? "What the numbers mean for your work" : "Pedo-climatic thresholds"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Water Bulletin */}
            <div className="gov-card p-4 border-l-4 border-l-amber-500 bg-amber-50/60 border border-slate-200 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <Droplets className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-amber-950">
                    Water Shortage Advisory: Evaporative Demand Exceeds Rainfall
                  </h4>
                  <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {viewMode === "farmer" ? (
                    "Soil moisture has dropped to 17%. With warm afternoon sun and mild breeze, moisture will evaporate rapidly. Irrigate your field today to protect root health."
                  ) : (
                    weather?.agroRisks.waterStress.description ?? "Low rain probability over next 48h. Evaporation exceeds soil recharge."
                  )}
                </p>
                <div className="text-[11px] font-bold text-slate-900 bg-white/70 p-1.5 rounded border border-amber-200 inline-block">
                  <strong>Recommendation:</strong> {weather?.agroRisks.waterStress.recommendation ?? "Schedule irrigation within next 24-48 hours."}
                </div>
              </div>
            </div>

            {/* Soil Bulletin */}
            <div className="gov-card p-4 border-l-4 border-l-emerald-600 bg-emerald-50/60 border border-slate-200 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                <FlaskConical className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-emerald-950" suppressHydrationWarning>
                    Soil Chemistry: Nitrogen Shortfall Detected
                  </h4>
                  <span className="bg-emerald-200 text-emerald-950 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    Fertilizer Tip
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed" suppressHydrationWarning>
                  {viewMode === "farmer" ? (
                    `Your ${farm.soilType} soil has strong potassium and balanced phosphorus, but available nitrogen is low (165 kg/ha). Top-dressing with urea will promote lush tillering.`
                  ) : (
                    `Soil Health Index is ${soil?.soilScore ?? 64}/100. High potassium with low organic carbon and nitrogen shortfall.`
                  )}
                </p>
                <div className="text-[11px] font-bold text-slate-900 bg-white/70 p-1.5 rounded border border-emerald-200 inline-block">
                  <strong>Recommendation:</strong> Apply 25 kg/acre urea or organic compost with next irrigation cycle.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: SPLIT GRID - AI ADVISORY & TELEMETRY WIDGETS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 Cols: AI Agro-Advisory Preview */}
          <div className="lg:col-span-2 gov-card p-5 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Latest AI Agro-Advisory Preview
                  </h3>
                  <p className="text-xs text-slate-500">
                    {viewMode === "farmer"
                      ? "Direct recommendations broken down into What To Do, Dosage, and Why."
                      : "Harmonized synthesis of Weather + Soil Chemistry + Sentinel-2 NDVI."}
                  </p>
                </div>
              </div>

              <Link
                href="/advisory"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs self-start sm:self-auto"
              >
                <span>Synthesize Live Advisory</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Clean 3-Part Advisory Cards */}
            <div className="space-y-3">
              {/* 1. Irrigation */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <Droplets className="h-4 w-4 text-blue-700" />
                    <span>Irrigation Directive: Apply 30–35 mm Drip Irrigation</span>
                  </div>
                  <span className="rounded bg-blue-200 text-blue-900 px-2 py-0.5 text-[10px] font-bold">
                    High Priority
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-blue-950">
                  <span className="bg-white/80 border border-blue-200 px-2 py-0.5 rounded">
                    Schedule: Early Morning / Evening
                  </span>
                  <span className="bg-white/80 border border-blue-200 px-2 py-0.5 rounded">
                    Target: 4–5 Hours Drip Run
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pt-1">
                  <strong>Why it matters:</strong> Current root-zone moisture is at {weather?.current.soilMoisturePercent ?? 17.3}% with upcoming daily evaporative demand (ET₀) of {weather?.forecast[0]?.et0Mm ?? 4.5} mm/day. Watering now prevents moisture stress during tillering.
                </p>
              </div>

              {/* 2. Soil Nutrient */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <FlaskConical className="h-4 w-4 text-emerald-700" />
                    <span>Nutrient Directive: Top-Dress Nitrogen Prior to Watering</span>
                  </div>
                  <span className="rounded bg-emerald-200 text-emerald-950 px-2 py-0.5 text-[10px] font-bold">
                    Nutrient Protocol
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-emerald-950">
                  <span className="bg-white/80 border border-emerald-200 px-2 py-0.5 rounded">
                    Dosage: 25 kg/acre Urea
                  </span>
                  <span className="bg-white/80 border border-emerald-200 px-2 py-0.5 rounded">
                    Alternative: Azotobacter Bio-Fertilizer
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pt-1" suppressHydrationWarning>
                  <strong>Why it matters:</strong> {soil?.soilType ?? "Semi-Arid Loam"}: Available Nitrogen is at {soil?.nitrogen ?? 165} kg/ha (deficit). Applying nitrogen now ensures the crop has nutrients dissolved immediately into the root zone.
                </p>
              </div>

              {/* 3. Crop Leaf Pathology Scan */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-slate-500" />
                    <span>Crop Leaf Health Status</span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-mono">
                      Not Scanned
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    No leaf photo uploaded yet for this parcel. Upload a smartphone leaf photo to diagnose any fungal, bacterial, or pest symptoms.
                  </p>
                </div>
                <Link
                  href="/disease"
                  className="rounded-lg bg-emerald-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shrink-0 shadow-sm text-center"
                >
                  Diagnose Leaf
                </Link>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-200 flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400 shrink-0" />
              <span>
                Disclaimer: AI advisory synthesized from field sensors and agronomic models. You can also consult your local agricultural extension officer.
              </span>
            </div>
          </div>

          {/* Right Col: Telemetry Widgets with Clean Explanations */}
          <div className="space-y-4">
            {/* Satellite NDVI Card */}
            <div className="gov-card p-5 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Satellite className="h-4 w-4 text-emerald-700" />
                  <span>Sentinel-2 Satellite Greenness</span>
                </div>
                <Link href="/satellite" className="text-xs text-emerald-800 font-bold hover:underline">
                  Full View →
                </Link>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {DEMO_HEALTH_SCORES.ndviCurrent}
                  </div>
                  <p className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5 font-bold">
                    Canopy Coverage: 61%
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-xs font-bold border border-emerald-200">
                  Healthy Leaf Vigor
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {viewMode === "farmer"
                  ? "Satellite measures how thick and green your crop leaves are. Your crop looks healthy and dense, with slight thirst in western rows."
                  : "Canopy reflectance (Sentinel-2 band B8/B4) indicates vegetative vigor with mild moisture deficit in quadrant NW-2."}
              </p>
            </div>

            {/* Weather Telemetry Card */}
            <div className="gov-card p-5 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <CloudSun className="h-4 w-4 text-blue-700" />
                  <span>Local Weather Station</span>
                  {weather?.isLive && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Live sensor connection" />
                  )}
                </div>
                <Link href="/weather" className="text-xs text-blue-800 font-bold hover:underline">
                  7-Day Forecast →
                </Link>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {weather?.current.temp ?? DEMO_WEATHER.current.temp}°C
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {weather?.current.weatherText ?? DEMO_WEATHER.current.condition}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-600 space-y-1">
                  <div>
                    Humidity: <strong className="text-slate-900">{weather?.current.humidity ?? DEMO_WEATHER.current.humidity}%</strong>
                  </div>
                  <div>
                    Wind: <strong className="text-slate-900">{weather?.current.windSpeedKmh ?? DEMO_WEATHER.current.windSpeedKmh} km/h</strong>
                  </div>
                  {weather?.current.soilMoisturePercent !== undefined && (
                    <div className="text-[11px] text-blue-900 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                      Soil Moisture: {weather.current.soilMoisturePercent}%
                    </div>
                  )}
                </div>
              </div>

              {/* Farmer Friendly Spraying Window Note */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-600">Spraying Condition:</span>
                <span className="font-bold text-emerald-800">
                  Safe (Low Wind {weather?.current.windSpeedKmh ?? 11} km/h)
                </span>
              </div>
            </div>

            {/* BRICS CADS Interoperability Card */}
            <div className="gov-card p-5 border border-slate-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sprout className="h-4 w-4 text-emerald-700" />
                  BRICS Data Node Status
                </h4>
                <span className="text-[10px] text-emerald-900 font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {viewMode === "farmer"
                  ? "Your farm participates in the BRICS Digital Public Good network, sharing anonymous climate-resilient farming insights across member nations."
                  : "Telemetry is standardized into the BRICS Common Agricultural Data Schema (CADS v1.0)."}
              </p>
              <Link
                href="/brics-network"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 pt-1"
              >
                Inspect Network Nodes →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Register New Farm Parcel Modal */}
      <AddFarmModal isOpen={isAddFarmOpen} onClose={() => setIsAddFarmOpen(false)} />
    </div>
  );
}

