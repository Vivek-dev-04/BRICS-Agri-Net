"use client";

import React from "react";
import { Sprout, CloudSun, Satellite, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export function LoginBranding() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 lg:p-12 h-full rounded-2xl shadow-xl">
      {/* Subtle background decorative agricultural contours & sun circles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg
          className="h-full w-full object-cover"
          viewBox="0 0 400 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="350" cy="100" r="180" stroke="white" strokeWidth="1.5" />
          <path
            d="M-50 450 C 100 400, 200 500, 450 420"
            stroke="white"
            strokeWidth="1.5"
          />
          <path
            d="M-50 500 C 120 460, 220 540, 450 480"
            stroke="white"
            strokeWidth="1.5"
          />
          <path
            d="M-50 550 C 150 520, 250 580, 450 540"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Top Banner Branding */}
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-700/60 border border-emerald-500/40 px-3.5 py-1 text-xs font-semibold tracking-wide text-emerald-100 backdrop-blur-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden="true" />
          <span>Official Agricultural Intelligence</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white shadow-inner">
            <Sprout className="h-7 w-7 text-emerald-300" aria-hidden="true" />
          </div>
          <div>
            <span className="font-extrabold text-2xl lg:text-3xl tracking-tight text-white block">
              BRICS Agri-Net
            </span>
            <span className="text-xs text-emerald-200/90 font-medium tracking-wide block uppercase">
              Digital Public Infrastructure
            </span>
          </div>
        </div>

        {/* Official Tagline */}
        <p className="text-base lg:text-lg font-medium text-emerald-50 leading-snug pt-2">
          &ldquo;Smart farming. Better decisions. A stronger agricultural future.&rdquo;
        </p>
      </div>

      {/* Centerpiece: Clean Agriculture + Technology Card Presentation */}
      <div className="relative z-10 my-8 space-y-3.5">
        <div className="rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
              <CloudSun className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hyperlocal Weather Intelligence</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed mt-0.5">
                5-day rainfall probability and early warnings for frost, water deficit, and heat stress.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
              <Satellite className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Satellite NDVI Telemetry</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed mt-0.5">
                Sentinel-2 multispectral monitoring tracking vegetative canopy vigor across your farm parcels.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">AI-Powered Agro-Advisories</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed mt-0.5">
                Timely, localized recommendations for irrigation cycles, soil nutrients, and crop disease risk.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 pt-4 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200/80">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          <span>Accessible to small & marginal farmers</span>
        </div>
        <span className="font-mono text-[11px] text-emerald-300">🇮🇳 🇧🇷 🇷🇺 🇨🇳 🇿🇦</span>
      </div>
    </div>
  );
}
