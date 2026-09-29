"use client";

import { Navbar } from "@/components/Navbar";
import { DEMO_FARM, DEMO_WEATHER } from "@/lib/mock-data";
import {
  CloudSun,
  Droplets,
  Wind,
  AlertTriangle,
  SunMedium,
  Thermometer,
  Calendar,
  CloudRain,
} from "lucide-react";

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/30">
              Module 3
            </span>
            <span className="text-xs text-slate-400">Microclimate Telemetry & Forecast</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CloudSun className="h-6 w-6 text-blue-400" />
            Weather Intelligence & Climate Risk
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Localized 5-day agrometeorological forecast, moisture deficits, and extreme weather risk signals for {DEMO_FARM.name}.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="glass-panel rounded-xl p-4 border border-amber-500/30 bg-amber-950/15 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-300">⚠ Agrometeorological Warning: Water Stress Detected</h3>
            <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">
              Low rain probability (&lt;15%) alongside high evaporative demand (32°C peak daytime) over the next 48 hours will accelerate root-zone moisture depletion. Recommended action: schedule a drip cycle before Wednesday.
            </p>
          </div>
        </div>

        {/* Current Observations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Ambient Temp</span>
              <Thermometer className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-3xl font-bold text-white">{DEMO_WEATHER.current.temp}°C</div>
            <p className="mt-1 text-[11px] text-slate-400">Feels like {DEMO_WEATHER.current.feelsLike}°C</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Relative Humidity</span>
              <Droplets className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 text-3xl font-bold text-white">{DEMO_WEATHER.current.humidity}%</div>
            <p className="mt-1 text-[11px] text-slate-400">Moderate fungal risk zone</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Wind Velocity</span>
              <Wind className="h-4 w-4 text-teal-400" />
            </div>
            <div className="mt-2 text-3xl font-bold text-white">{DEMO_WEATHER.current.windSpeedKmh} <span className="text-sm font-normal text-slate-400">km/h</span></div>
            <p className="mt-1 text-[11px] text-slate-400">Suitable for bio-spraying</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>UV Index</span>
              <SunMedium className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="mt-2 text-3xl font-bold text-white">{DEMO_WEATHER.current.uvIndex} <span className="text-sm font-normal text-slate-400">/ 11</span></div>
            <p className="mt-1 text-[11px] text-amber-400">High solar radiation</p>
          </div>
        </div>

        {/* 5-Day Agrometeorological Forecast */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              5-Day Agrometeorological Forecast
            </h3>
            <span className="text-xs text-slate-400">Station: Jaipur Met Grid #48</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 pt-2">
            {DEMO_WEATHER.forecast.map((fc, idx) => (
              <div
                key={fc.day}
                className={`rounded-xl p-4 border text-center transition-all ${
                  idx === 0
                    ? "border-blue-500/40 bg-blue-950/20"
                    : "border-slate-800/80 bg-slate-900/40"
                }`}
              >
                <span className="text-xs font-semibold text-slate-300 block">{fc.day}</span>
                <div className="my-2 flex justify-center text-blue-400">
                  {fc.rainProb > 40 ? <CloudRain className="h-7 w-7 text-blue-400" /> : <CloudSun className="h-7 w-7 text-amber-400" />}
                </div>
                <div className="text-base font-bold text-white">
                  {fc.tempMax}° / <span className="text-slate-400 font-normal">{fc.tempMin}°C</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Droplets className="h-3 w-3 text-blue-400" />
                  <span>Rain: {fc.rainProb}%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">({fc.rainfall} mm)</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
