"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  Code2,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Database,
  ArrowRight,
  Filter,
  Download,
  Layers,
  Globe2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface CadsRecordItem {
  country: "IN" | "BR" | "RU" | "CN" | "ZA";
  region: string;
  crop: string;
  soil: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph?: number;
    organicCarbon?: number;
  };
  weather: {
    temperature: number;
    rainfall: number;
    humidity?: number;
    windSpeed?: number;
  };
  vegetation: {
    ndvi: number;
    stressLevel?: "LOW" | "MODERATE" | "SEVERE" | "NONE";
  };
  timestamp?: string;
}

const SAMPLE_CADS_RECORD: CadsRecordItem = {
  country: "IN",
  region: "Rajasthan (Jaipur Grid)",
  crop: "wheat",
  soil: {
    nitrogen: 180,
    phosphorus: 18,
    potassium: 310,
    ph: 7.1,
    organicCarbon: 0.42,
  },
  weather: {
    temperature: 31,
    rainfall: 0.2,
    humidity: 41,
    windSpeed: 14,
  },
  vegetation: {
    ndvi: 0.61,
    stressLevel: "MODERATE",
  },
  timestamp: "2026-09-29T08:30:00Z",
};

export default function InteroperabilityPage() {
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<"query" | "schema" | "apis">("query");

  // Query Playground State
  const [countryFilter, setCountryFilter] = useState<string>("ALL");
  const [cropFilter, setCropFilter] = useState<string>("ALL");
  const [minNdviFilter, setMinNdviFilter] = useState<string>("0");
  const [records, setRecords] = useState<CadsRecordItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch CADS records
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (countryFilter !== "ALL") params.append("country", countryFilter);
      if (cropFilter !== "ALL") params.append("crop", cropFilter);
      if (parseFloat(minNdviFilter) > 0) params.append("minNdvi", minNdviFilter);

      const res = await fetch(`/api/brics/agricultural-data?${params.toString()}`);
      const data = await res.json();
      if (data.records) {
        setRecords(data.records);
      }
    } catch {
      setRecords([SAMPLE_CADS_RECORD]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [countryFilter, cropFilter, minNdviFilter]);

  // Export functions
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cads-brics-export-${Date.now().toString().slice(-6)}.json`;
    a.click();
  };

  const handleExportCsv = () => {
    if (records.length === 0) return;
    const headers = [
      "Country",
      "Region",
      "Crop",
      "Soil_N",
      "Soil_P",
      "Soil_K",
      "Soil_pH",
      "Soil_OC",
      "Temp_C",
      "Rain_mm",
      "Humidity",
      "NDVI",
      "Stress_Level",
      "Timestamp",
    ];
    const rows = records.map((r) => [
      r.country,
      `"${r.region}"`,
      r.crop,
      r.soil.nitrogen,
      r.soil.phosphorus,
      r.soil.potassium,
      r.soil.ph ?? "",
      r.soil.organicCarbon ?? "",
      r.weather.temperature,
      r.weather.rainfall,
      r.weather.humidity ?? "",
      r.vegetation.ndvi,
      r.vegetation.stressLevel ?? "NONE",
      r.timestamp ?? "",
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cads-brics-export-${Date.now().toString().slice(-6)}.csv`;
    a.click();
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(SAMPLE_CADS_RECORD, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-100 text-blue-900 px-2.5 py-0.5 text-xs font-bold border border-blue-300">
                Digital Public Good
              </span>
              <span className="text-xs text-slate-500 font-medium">CADS v1.0 Standard Specification</span>
            </div>

            <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
              <Code2 className="h-7 w-7 text-emerald-800 shrink-0" />
              Open CADS Registry & Interoperability Layer
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Harmonized Common Agricultural Data Schema (CADS) enabling cross-border research, soil carbon tracking, satellite vegetation telemetry, and scientific AI model exchange across BRICS nations.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/brics-network"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Globe2 className="h-3.5 w-3.5" />
              Farmer Commons Feed <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Security & Privacy Banner */}
        <div className="gov-card p-5 border border-emerald-300 bg-emerald-50/60 flex items-start gap-3.5 rounded-xl">
          <ShieldCheck className="h-6 w-6 text-emerald-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-emerald-950">
              Privacy-Preserving Zero-PII Protocol (PRD Section 16 & DPGA Criteria)
            </h3>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Private farmer-level identities, phone numbers, exact cadastral parcel coordinates, and financial records are strictly decoupled prior to entering the BRICS data layer. Records are normalized and aggregated into 10km regional spatial grids for open scientific research.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-6 text-sm font-bold" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("query")}
              className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === "query"
                  ? "border-emerald-800 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <Database className="h-4 w-4" />
              CADS Live Query Playground ({records.length} Records)
            </button>

            <button
              onClick={() => setActiveTab("schema")}
              className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === "schema"
                  ? "border-emerald-800 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <Code2 className="h-4 w-4" />
              CADS v1.0 Schema Specification
            </button>

            <button
              onClick={() => setActiveTab("apis")}
              className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === "apis"
                  ? "border-emerald-800 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <Terminal className="h-4 w-4" />
              Public REST API Directory
            </button>
          </nav>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: LIVE CADS QUERY PLAYGROUND                                   */}
        {/* =================================================================== */}
        {activeTab === "query" && (
          <div className="space-y-5">
            {/* Filter & Export Bar */}
            <div className="gov-card p-4 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-emerald-800" />
                  Telemetry Filter Parameters
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJson}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export JSON
                  </button>

                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export CSV
                  </button>

                  <button
                    onClick={fetchRecords}
                    disabled={loading}
                    className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-200 transition-colors"
                    title="Refresh data"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Member Nation</label>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="ALL">All BRICS Nations</option>
                    <option value="IN">[IN] India</option>
                    <option value="BR">[BR] Brazil</option>
                    <option value="RU">[RU] Russia</option>
                    <option value="CN">[CN] China</option>
                    <option value="ZA">[ZA] South Africa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crop Classification</label>
                  <select
                    value={cropFilter}
                    onChange={(e) => setCropFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="ALL">All Crops</option>
                    <option value="wheat">Wheat</option>
                    <option value="soybean">Soybean</option>
                    <option value="rice">Rice</option>
                    <option value="maize">Maize</option>
                    <option value="sunflower">Sunflower</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Canopy NDVI ({minNdviFilter})</label>
                  <input
                    type="range"
                    min="0"
                    max="0.85"
                    step="0.05"
                    value={minNdviFilter}
                    onChange={(e) => setMinNdviFilter(e.target.value)}
                    className="w-full accent-emerald-800 mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Live Data Records Table */}
            <div className="gov-card border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">Nation & Grid Region</th>
                      <th className="py-3 px-4">Crop</th>
                      <th className="py-3 px-4">Soil N-P-K (kg/ha)</th>
                      <th className="py-3 px-4">Soil pH / OC</th>
                      <th className="py-3 px-4">Weather Telemetry</th>
                      <th className="py-3 px-4">Canopy NDVI</th>
                      <th className="py-3 px-4">Stress Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                          No CADS records match current filter criteria.
                        </td>
                      </tr>
                    ) : (
                      records.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded text-[10px]">
                                [{r.country}]
                              </span>
                              <span className="font-semibold text-slate-900">{r.region}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize font-semibold text-slate-800">
                            {r.crop}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-700">
                            {r.soil.nitrogen}-{r.soil.phosphorus}-{r.soil.potassium}
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">
                            pH {r.soil.ph ?? "N/A"} • OC {r.soil.organicCarbon ? `${r.soil.organicCarbon}%` : "N/A"}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {r.weather.temperature}°C • {r.weather.rainfall}mm rain • {r.weather.humidity}% RH
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {r.vegetation.ndvi.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                r.vegetation.stressLevel === "SEVERE"
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : r.vegetation.stressLevel === "MODERATE"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              }`}
                            >
                              {r.vegetation.stressLevel || "NORMAL"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: CADS V1.0 SCHEMA SPECIFICATION                               */}
        {/* =================================================================== */}
        {activeTab === "schema" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 gov-card p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-800" />
                  <h3 className="text-sm font-bold text-slate-900">Standardized CADS v1.0 Observation Schema</h3>
                </div>

                <button
                  onClick={handleCopySchema}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
                >
                  {copiedSchema ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSchema ? "Copied" : "Copy JSON"}</span>
                </button>
              </div>

              <pre className="rounded-xl bg-slate-900 p-4 text-xs font-mono text-emerald-300 border border-slate-800 overflow-x-auto leading-relaxed max-h-[460px]">
                {JSON.stringify(SAMPLE_CADS_RECORD, null, 2)}
              </pre>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="gov-card p-5 border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-800" />
                  Schema Field Specifications
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-mono font-bold text-slate-900 block">soil (Object)</span>
                    <p className="text-slate-600">Standardized macronutrients: nitrogen (kg/ha), phosphorus (kg/ha), potassium (kg/ha), soil pH (0-14), and organicCarbon (%).</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-mono font-bold text-slate-900 block">weather (Object)</span>
                    <p className="text-slate-600">Surface atmospheric readings: temperature (°C), rainfall (24h mm), relative humidity (%), and wind speed (km/h).</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-mono font-bold text-slate-900 block">vegetation (Object)</span>
                    <p className="text-slate-600">Cross-calibrated satellite NDVI (-1 to 1) and stress classification (NONE, LOW, MODERATE, SEVERE).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: PUBLIC REST API DIRECTORY                                   */}
        {/* =================================================================== */}
        {activeTab === "apis" && (
          <div className="gov-card p-6 border border-slate-200 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-800" />
                Public BRICS Agri-Net REST API Directory
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Open APIs for researcher telemetry, national node synchronization, and cross-border machine-to-machine exchange.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                    GET
                  </span>
                  <a
                    href="/api/brics/agricultural-data"
                    target="_blank"
                    className="font-sans text-[11px] text-emerald-800 font-bold hover:underline flex items-center gap-1"
                  >
                    Test <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="font-bold text-slate-900">/api/brics/agricultural-data</div>
                <p className="font-sans text-slate-600 text-[11px]">
                  Query standardized CADS agricultural observations with country, crop, and minNdvi filters.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                    GET
                  </span>
                  <a
                    href="/api/brics/models"
                    target="_blank"
                    className="font-sans text-[11px] text-emerald-800 font-bold hover:underline flex items-center gap-1"
                  >
                    Test <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="font-bold text-slate-900">/api/brics/models</div>
                <p className="font-sans text-slate-600 text-[11px]">
                  List all 5 institutional shared data models (EMBRAPA, ICAR, CAAS, RAS, ARC) and simulation endpoints.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                    GET
                  </span>
                  <a
                    href="/api/brics/posts"
                    target="_blank"
                    className="font-sans text-[11px] text-emerald-800 font-bold hover:underline flex items-center gap-1"
                  >
                    Test <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="font-bold text-slate-900">/api/brics/posts</div>
                <p className="font-sans text-slate-600 text-[11px]">
                  Retrieve farmer field practice publications across BRICS nations with filtering by country & category.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                    GET
                  </span>
                  <a
                    href="/api/brics/countries"
                    target="_blank"
                    className="font-sans text-[11px] text-emerald-800 font-bold hover:underline flex items-center gap-1"
                  >
                    Test <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="font-bold text-slate-900">/api/brics/countries</div>
                <p className="font-sans text-slate-600 text-[11px]">
                  Member state metadata, reporting farm aggregates, and national telemetry status flags.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
