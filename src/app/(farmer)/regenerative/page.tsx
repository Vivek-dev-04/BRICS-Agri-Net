"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DEMO_REGENERATIVE_PRACTICES, DEMO_FARM } from "@/lib/mock-data";
import { Leaf, Sparkles, Award } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <span className="rounded bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-900 border border-teal-300">
              Module 8
            </span>
            <span className="text-xs text-slate-500 font-medium">Ecological Sustainability & Soil Carbon</span>
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Leaf className="h-7 w-7 text-emerald-800" />
            Regenerative Agriculture Engine
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Tailored climate-smart farming interventions matching the Crop + Soil + Climate + Water availability matrix for {DEMO_FARM.name}.
          </p>
        </div>

        {/* Hero Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="gov-card rounded-2xl p-5 border border-slate-200 bg-white shadow-xs">
            <span className="text-xs font-bold text-emerald-800">Estimated Carbon Sequestration</span>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">+1.15</div>
            <p className="text-xs text-slate-500 mt-1">t CO2e / acre / year potential</p>
          </div>

          <div className="gov-card rounded-2xl p-5 border border-slate-200 bg-white shadow-xs">
            <span className="text-xs font-bold text-slate-600">Soil Organic Carbon Goal</span>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">0.42% → 1.0%</div>
            <p className="text-xs text-emerald-800 font-medium mt-1">3-year restoration roadmap</p>
          </div>

          <div className="gov-card rounded-2xl p-5 border border-slate-200 bg-white shadow-xs">
            <span className="text-xs font-bold text-slate-600">Water Retention Gain</span>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">+28%</div>
            <p className="text-xs text-blue-700 font-medium mt-1">via residue mulching & root networks</p>
          </div>
        </div>

        {/* Practices List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-800" />
              Tailored Regenerative Interventions ({practices.length})
            </h3>
            <span className="text-xs text-slate-500">Click a card status button to cycle Planned / Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practices.map((p) => {
              const isActive = p.status === "Active";
              const isPlanned = p.status === "Planned";

              return (
                <div
                  key={p.id}
                  className={`gov-card rounded-2xl p-5 border transition-all ${
                    isActive
                      ? "border-emerald-300 bg-emerald-50/40 shadow-xs"
                      : isPlanned
                      ? "border-amber-300 bg-amber-50/30 shadow-xs"
                      : "border-slate-200 bg-white shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                        {p.category}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1.5">{p.title}</h4>
                    </div>

                    <button
                      onClick={() => toggleStatus(p.id)}
                      className={`rounded-full px-3 py-1 text-xs font-bold border transition-colors shrink-0 shadow-xs ${
                        isActive
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : isPlanned
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {p.status}
                    </button>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {p.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-emerald-800 font-bold flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" /> {p.carbonImpact}
                    </span>
                    <span className="text-slate-500 text-[11px] font-medium">Interoperable BRICS Practice</span>
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
