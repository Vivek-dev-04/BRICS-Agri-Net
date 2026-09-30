"use client";

import React from "react";
import { Sprout, MapPin, Satellite, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export function RegisterBranding() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 lg:p-12 h-full rounded-2xl shadow-xl">
      {/* Background SVG Contours */}
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

      {/* Top Header */}
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-700/60 border border-emerald-500/40 px-3.5 py-1 text-xs font-semibold tracking-wide text-emerald-100 backdrop-blur-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-300" />
          <span>Official Farmer Onboarding Portal</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white shadow-inner">
            <Sprout className="h-7 w-7 text-emerald-300" />
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

        <p className="text-base lg:text-lg font-medium text-emerald-50 leading-snug pt-2">
          &ldquo;Connecting smallholder farmers to space telemetry, climate models, and AI agronomy.&rdquo;
        </p>
      </div>

      {/* 3 Simple Onboarding Steps */}
      <div className="relative z-10 my-8 space-y-3.5">
        <div className="rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/30 text-emerald-300 font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Farmer Account Setup</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed mt-0.5">
                Set up your mobile number and credentials for secure farm data protection.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/30 text-emerald-300 font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Automated GPS & Soil Classification</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed mt-0.5">
                Your device's GPS instantly determines your agro-climatic region and soil pedology.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/30 text-emerald-300 font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Crop Telemetry & AI Advisories</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed mt-0.5">
                Enter your cultivated crop and acreage to start receiving personalized agricultural intelligence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 pt-4 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200/80">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Completely free for farmers</span>
        </div>
        <span className="font-mono text-[10px] text-emerald-300 font-semibold tracking-wider">
          BRICS • IN BR RU CN ZA
        </span>
      </div>
    </div>
  );
}
