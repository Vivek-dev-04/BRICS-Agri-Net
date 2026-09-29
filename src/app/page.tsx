"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  Sprout,
  LayoutDashboard,
  CloudSun,
  Satellite,
  FlaskConical,
  Sparkles,
  ScanEye,
  Leaf,
  Globe2,
  Code2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  CheckCircle2,
} from "lucide-react";

const MODULES = [
  {
    num: "01",
    title: "Farm & Crop Profile Management",
    desc: "Register farms, set geographic boundaries, track crop calendars and irrigation setup.",
    href: "/farms",
    icon: Sprout,
    category: "Farmer Operations",
    badge: "Module 1",
  },
  {
    num: "02",
    title: "Unified Farmer Dashboard",
    desc: "Single-pane-of-glass overview with composite Farm Health scoring (0–100) and alert feeds.",
    href: "/dashboard",
    icon: LayoutDashboard,
    category: "Farmer Operations",
    badge: "Module 2",
  },
  {
    num: "03",
    title: "Weather Intelligence Engine",
    desc: "5-day agrometeorological forecasting, precipitation alerts, and water-stress flags.",
    href: "/weather",
    icon: CloudSun,
    category: "Microclimate Telemetry",
    badge: "Module 3",
  },
  {
    num: "04",
    title: "Satellite NDVI Monitoring",
    desc: "Sentinel-2 remote sensing vegetation monitoring, canopy chlorophyll trends, and stress zones.",
    href: "/satellite",
    icon: Satellite,
    category: "Earth Observation",
    badge: "Module 4",
  },
  {
    num: "05",
    title: "Soil Health & Nutrient Profiling",
    desc: "NPK macronutrient balance, pH reaction, organic carbon deficit, and soil quality indexing.",
    href: "/soil",
    icon: FlaskConical,
    category: "Soil Telemetry",
    badge: "Module 5",
  },
  {
    num: "06",
    title: "AI Agro-Advisory Engine",
    desc: "Multimodal LLM reasoning fusing Farm + Weather + Soil + NDVI for precision recommendations.",
    href: "/advisory",
    icon: Sparkles,
    category: "AI Reasoning",
    badge: "Module 6",
  },
  {
    num: "07",
    title: "Vision Crop Disease Diagnosis",
    desc: "Computer vision pathology classification on leaf imagery with remediation guidelines.",
    href: "/disease",
    icon: ScanEye,
    category: "Computer Vision",
    badge: "Module 7",
  },
  {
    num: "08",
    title: "Regenerative Agriculture Engine",
    desc: "Tailored climate-resilient practices: crop residue retention, cover crops, and carbon tracking.",
    href: "/regenerative",
    icon: Leaf,
    category: "Sustainability",
    badge: "Module 8",
  },
  {
    num: "09",
    title: "BRICS Cooperation Dashboard",
    desc: "Macro cross-country insights across Brazil, Russia, India, China, and South Africa.",
    href: "/brics-network",
    icon: Globe2,
    category: "Multilateral Network",
    badge: "Module 9",
  },
  {
    num: "10",
    title: "Interoperable Data Layer & API",
    desc: "Standardized CADS schema, privacy-preserving anonymization pipeline, and public REST APIs.",
    href: "/interoperability",
    icon: Code2,
    category: "Data Standardization",
    badge: "Module 10",
  },
];

const DEMO_STEPS = [
  "Farmer from Rajasthan registers 2.5-acre wheat farm",
  "Logs soil test: Nitrogen LOW (180 kg/ha), Organic Carbon 0.42%",
  "System fetches 5-day weather: 31°C, low rain probability (12%)",
  "Satellite telemetry detects declining NDVI (0.61 vs 0.75 benchmark)",
  "AI Agro-Advisory synthesizes 24-48h drip irrigation & urea supplement",
  "Farmer uploads leaf image: Vision model detects Wheat Leaf Rust (92%)",
  "Regenerative engine prescribes residue mulching & chickpea rotation",
  "Telemetry is anonymized & ingested into BRICS CADS exchange layer",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Hackathon MVP v1.0 • Complete 10-Module Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Interoperable AI Platform for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Climate-Resilient Agriculture
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            BRICS Agri-Net transforms fragmented agricultural data into localized AI-powered farm intelligence while creating an interoperable digital foundation for cooperation across BRICS nations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              <LayoutDashboard className="h-4 w-4" />
              Launch Farmer Dashboard
            </Link>
            <Link
              href="/brics-network"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-white transition-all"
            >
              <Globe2 className="h-4 w-4 text-emerald-400" />
              Explore BRICS Network
            </Link>
          </div>
        </div>

        {/* PRD End-to-End Demo Scenario Walkthrough (PRD Section 25) */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 to-emerald-950/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Play className="h-3.5 w-3.5 fill-current" />
                PRD Section 25 • Core Demonstration Scenario
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Ram Singh Farm: End-to-End Pipeline Walkthrough
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
            >
              Open Active Scenario <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DEMO_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">
                    STEP {idx + 1}
                  </span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <p className="text-slate-200 leading-relaxed font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 10 Modules Showcase Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-white">The 10 Architectural Modules</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Structured into modular subsystems covering local farmer intelligence and cross-border cooperation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.num}
                  href={mod.href}
                  className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {mod.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">{mod.category}</span>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>Explore Module</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 BRICS Agri-Net. Digital Public Good for Climate-Resilient Agriculture.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/brics-network" className="hover:text-slate-300 transition-colors">
              BRICS Nodes
            </Link>
            <Link href="/interoperability" className="hover:text-slate-300 transition-colors">
              CADS API Docs
            </Link>
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
              Farmer App
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
