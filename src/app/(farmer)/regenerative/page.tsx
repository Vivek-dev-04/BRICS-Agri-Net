"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DEMO_REGENERATIVE_PRACTICES, DEMO_FARM } from "@/lib/mock-data";
import { Leaf, Sparkles, CheckCircle2, Clock, Award, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function RegenerativePage() {
  const [practices, setPractices] = useState(DEMO_REGENERATIVE_PRACTICES);

  const toggleStatus = (id: string) => {
    setPractices((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextStatus =
          p.status === "Recommended"
            ? "Planned"
            : p.status === "Planned"
            ? "Active"
            : "Recommended";
        return { ...p, status: nextStatus };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="rounded bg-teal-500/10 px-2 py-0.5 text-xs font-semibold text-teal-400 border border-teal-500/30">
              Module 8
            </span>
            <span className="text-xs text-slate-400">Ecological Sustainability & Soil Carbon</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Leaf className="h-6 w-6 text-teal-400" />
            Regenerative Agriculture Engine
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Tailored climate-smart farming interventions matching the Crop + Soil + Climate + Water availability matrix for {DEMO_FARM.name}.
          </p>
        </div>

        {/* Hero Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-teal-500/30 bg-teal-950/10">
            <span className="text-xs font-semibold text-teal-400">Estimated Carbon Sequestration</span>
            <div className="mt-2 text-3xl font-extrabold text-white">+1.15</div>
            <p className="text-xs text-slate-400 mt-1">t CO2e / acre / year potential</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Soil Organic Carbon Goal</span>
            <div className="mt-2 text-3xl font-extrabold text-white">0.42% → 1.0%</div>
            <p className="text-xs text-emerald-400 mt-1">3-year restoration roadmap</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Water Retention Gain</span>
            <div className="mt-2 text-3xl font-extrabold text-white">+28%</div>
            <p className="text-xs text-blue-400 mt-1">via residue mulching & root networks</p>
          </div>
        </div>

        {/* Practices List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-400" />
              Tailored Regenerative Interventions ({practices.length})
            </h3>
            <span className="text-xs text-slate-400">Click a card status button to cycle Planned / Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practices.map((p) => {
              const isActive = p.status === "Active";
              const isPlanned = p.status === "Planned";

              return (
                <div
                  key={p.id}
                  className={`glass-panel rounded-2xl p-5 border transition-all ${
                    isActive
                      ? "border-teal-500/40 bg-teal-950/15"
                      : isPlanned
                      ? "border-amber-500/30 bg-amber-950/10"
                      : "border-slate-800 bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                        {p.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{p.title}</h4>
                    </div>

                    <button
                      onClick={() => toggleStatus(p.id)}
                      className={`rounded-full px-3 py-1 text-xs font-bold border transition-colors shrink-0 ${
                        isActive
                          ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
                          : isPlanned
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                      }`}
                    >
                      {p.status}
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" /> {p.carbonImpact}
                    </span>
                    <span className="text-slate-400 text-[11px]">Interoperable BRICS Practice</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
