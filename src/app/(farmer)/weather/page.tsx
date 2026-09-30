"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useFarm } from "@/context/FarmContext";
import { WeatherData } from "@/lib/services/weatherService";
import {
  CloudSun,
  Droplets,
  Wind,
  AlertTriangle,
  SunMedium,
  Thermometer,
  Calendar,
  CloudRain,
  RefreshCw,
  Sparkles,
  MapPin,
  Compass,
  Sprout,
  CheckCircle2,
  XCircle,
  Activity,
  Layers,
  Info,
} from "lucide-react";

export default function WeatherPage() {
  const { farm, farms, switchFarm } = useFarm();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const lat = farm.latitude || 26.9124;
      const lon = farm.longitude || 75.7873;
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();

      if (data.success && data.data) {
        setWeather(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch weather telemetry");
      }
    } catch (err: unknown) {
      console.error("Error loading weather telemetry:", err);
      setError("Unable to reach meteorological station. Displaying cached agricultural models.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [farm.latitude, farm.longitude]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const renderWeatherIcon = (iconType: string, className = "h-6 w-6") => {
    switch (iconType) {
      case "rain":
        return <CloudRain className={`${className} text-blue-600`} />;
      case "thunder":
        return <AlertTriangle className={`${className} text-amber-600`} />;
      case "sun":
        return <SunMedium className={`${className} text-amber-500`} />;
      case "cloud":
        return <CloudSun className={`${className} text-slate-500`} />;
      default:
        return <CloudSun className={`${className} text-emerald-600`} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header Banner */}
        <div className="gov-card bg-white p-6 border border-slate-200 border-l-4 border-l-blue-700 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-bold border border-blue-200">
                  Module 3: Agrometeorology
                </span>
                {weather?.isLive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Open-Meteo Telemetry
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-300">
                    Offline Simulation Active
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  Elevation: {weather?.station.elevation ?? 427}m
                </span>
              </div>

              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
                <CloudSun className="h-7 w-7 text-blue-700" />
                Weather Intelligence & Climate Risk
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

            {/* Farm Selector & Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {farms.length > 1 && (
                <select
                  value={farm.id}
                  onChange={(e) => switchFarm(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      Parcel: {f.name} ({f.crop})
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={() => fetchWeather(true)}
                disabled={loading || refreshing}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-blue-700" : ""}`} />
                {refreshing ? "Updating..." : "Refresh Telemetry"}
              </button>

              <Link
                href="/advisory"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Feed into AI Advisory
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Agrometeorological Warning Banners */}
        {weather && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Water Stress Banner */}
            <div
              className={`rounded-xl p-4 border flex items-start gap-3 transition-colors ${
                weather.agroRisks.waterStress.level === "CRITICAL"
                  ? "border-red-300 bg-red-50/70"
                  : weather.agroRisks.waterStress.level === "HIGH" || weather.agroRisks.waterStress.level === "MODERATE"
                  ? "border-amber-300 bg-amber-50/70"
                  : "border-emerald-300 bg-emerald-50/70"
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  weather.agroRisks.waterStress.level === "CRITICAL"
                    ? "bg-red-100 text-red-700"
                    : weather.agroRisks.waterStress.level === "HIGH" || weather.agroRisks.waterStress.level === "MODERATE"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {weather.agroRisks.waterStress.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      weather.agroRisks.waterStress.level === "CRITICAL"
                        ? "bg-red-200 text-red-900"
                        : "bg-amber-200 text-amber-900"
                    }`}
                  >
                    {weather.agroRisks.waterStress.level}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {weather.agroRisks.waterStress.description}
                </p>
                <p className="text-xs font-semibold text-slate-800 pt-1">
                  Field Recommendation: {weather.agroRisks.waterStress.recommendation}
                </p>
              </div>
            </div>

            {/* Spraying & Fungal Window */}
            <div className="rounded-xl p-4 border border-blue-200 bg-blue-50/60 flex items-start gap-3">
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  weather.agroRisks.sprayingWindow.suitable
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {weather.agroRisks.sprayingWindow.suitable ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Agrochemical Spraying Feasibility
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      weather.agroRisks.sprayingWindow.suitable
                        ? "bg-emerald-200 text-emerald-900"
                        : "bg-amber-200 text-amber-900"
                    }`}
                  >
                    {weather.agroRisks.sprayingWindow.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {weather.agroRisks.sprayingWindow.reason}
                </p>
                <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-2">
                  <span>Fungal Spore Risk:</span>
                  <strong className="text-slate-800">{weather.agroRisks.fungalRisk.title}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8-Card Observations Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-700" />
              Real-Time Atmospheric & Soil Telemetry
            </h2>
            <span className="text-xs text-slate-500">
              {weather ? `Observation Time: ${new Date(weather.fetchedAt).toLocaleTimeString()}` : "Loading..."}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Ambient Temp */}
            <div className="gov-card p-4 border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Ambient Air</span>
                <Thermometer className="h-4 w-4 text-amber-600" />
              </div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">
                {weather?.current.temp ?? "--"}°C
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Feels like {weather?.current.feelsLike ?? "--"}°C • {weather?.current.weatherText}
              </p>
            </div>

            {/* Relative Humidity */}
            <div className="gov-card p-4 border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Relative Humidity</span>
                <Droplets className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">
                {weather?.current.humidity ?? "--"}%
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {weather?.current.humidity && weather.current.humidity > 70
                  ? "Elevated fungal spore risk"
                  : "Normal transpiration rate"}
              </p>
            </div>

            {/* Volumetric Soil Moisture (0-7cm) */}
            <div className="gov-card p-4 border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Root Soil Moisture</span>
                <Sprout className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900 flex items-baseline gap-1.5">
                {weather?.current.soilMoisturePercent ?? "--"}%
                <span className="text-xs font-semibold text-slate-500 font-normal">vol. (0-7cm)</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {weather?.current.soilMoisturePercent && weather.current.soilMoisturePercent < 18
                  ? "Severe root-zone depletion"
                  : "Adequate capillary water"}
              </p>
            </div>

            {/* Soil Temp (0-7cm) */}
            <div className="gov-card p-4 border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Soil Temp (0-7cm)</span>
                <Layers className="h-4 w-4 text-amber-700" />
              </div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">
                {weather?.current.soilTempC ?? "--"}°C
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Biological microbial activity active
              </p>
            </div>

            {/* Reference Evapotranspiration (ET0) */}
            <div className="gov-card p-4 border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Evapotranspiration (ET₀)</span>
                <SunMedium className="h-4 w-4 text-orange-600" />
              </div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900 flex items-baseline gap-1.5">
                {weather?.forecast[0]?.et0Mm ?? "--"}
                <span className="text-xs font-normal text-slate-500">mm / day</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                FAO Penman-Monteith crop water loss
              </p>
            </div>

            {/* Wind Velocity */}
            <div className="gov-card p-4 border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Wind Velocity</span>
                <Wind className="h-4 w-4 text-teal-600" />
              </div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900 flex items-baseline gap-1.5">
                {weather?.current.windSpeedKmh ?? "--"}
                <span className="text-xs font-normal text-slate-500">km/h</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                <Compass className="h-3 w-3" />
                <span>Direction: {weather?.current.windDirectionDeg ?? 0}°</span>
              </p>
            </div>

            {/* Rainfall Probability */}
            <div className="gov-card p-4 border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Rain Probability</span>
                <CloudRain className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">
                {weather?.forecast[0]?.rainProb ?? 0}%
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Precipitation sum: {weather?.forecast[0]?.precipitationMm ?? 0} mm
              </p>
            </div>

            {/* Solar UV Index */}
            <div className="gov-card p-4 border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">UV Solar Index</span>
                <SunMedium className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900 flex items-baseline gap-1.5">
                {weather?.current.uvIndex ?? "--"}
                <span className="text-xs font-normal text-slate-500">/ 11</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {weather?.current.uvIndex && weather.current.uvIndex > 7
                  ? "High photosynthetic irradiance"
                  : "Moderate solar radiation"}
              </p>
            </div>
          </div>
        </div>

        {/* 7-Day Agrometeorological Forecast Table */}
        <div className="gov-card bg-white p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-700" />
              7-Day Crop Agrometeorological Forecast
            </h3>
            <span className="text-xs text-slate-500">
              FAO Penman-Monteith ET₀ & Precipitation Model
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 pt-2">
            {weather?.forecast.map((fc, idx) => (
              <div
                key={fc.date}
                className={`rounded-xl p-3.5 border text-center transition-all ${
                  idx === 0
                    ? "border-blue-300 bg-blue-50/50 shadow-sm ring-1 ring-blue-200"
                    : "border-slate-200 bg-slate-50/40 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between sm:block">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{fc.day}</span>
                    <span className="text-[10px] text-slate-500 block">{fc.date}</span>
                  </div>

                  <div className="my-2 flex justify-center py-1">
                    {renderWeatherIcon(fc.conditionIcon, "h-8 w-8")}
                  </div>

                  <div className="text-xs text-slate-700 font-medium line-clamp-1 pb-1">
                    {fc.weatherText}
                  </div>
                </div>

                <div className="text-sm font-extrabold text-slate-900 pt-1">
                  {fc.tempMax}° / <span className="text-slate-500 font-medium">{fc.tempMin}°C</span>
                </div>

                {/* Rain Probability Badge */}
                <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-center gap-1 font-semibold">
                  <Droplets className="h-3 w-3 text-blue-600" />
                  <span>Rain: {fc.rainProb}%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  ({fc.precipitationMm} mm)
                </div>

                {/* ET0 Water Loss */}
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-600">
                  <span className="text-slate-400">ET₀: </span>
                  <strong className="text-orange-700">{fc.et0Mm} mm</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agricultural Interpretation Guide (PRD Section 8) */}
        <div className="gov-card p-5 bg-slate-100/70 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Agrometeorological Decision Rule (PRD Section 8):</strong>
              <p className="text-slate-600 mt-0.5">
                When daily Reference Evapotranspiration (ET₀) exceeds 4.5 mm and 48-hour rain probability is below 20%, root-zone water depletion accelerates by 1.8%/day. The system automatically elevates irrigation urgency in the AI Agro-Advisory engine.
              </p>
            </div>
          </div>
          <Link
            href="/advisory"
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-blue-800 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm"
          >
            Review Crop Advisory →
          </Link>
        </div>
      </main>
    </div>
  );
}
