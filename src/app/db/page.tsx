"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { localDb, StoredUser, StoredFarm, StoredSoilData } from "@/lib/db/localStorageDb";
import {
  Database,
  Users,
  Sprout,
  FlaskConical,
  RefreshCw,
  Trash2,
  Download,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  MapPin,
  ExternalLink,
  FileCode,
} from "lucide-react";

export default function DatabaseViewerPage() {
  const [activeTab, setActiveTab] = useState<"users" | "farms" | "soil" | "raw">("users");
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [farms, setFarms] = useState<StoredFarm[]>([]);
  const [soilRecords, setSoilRecords] = useState<StoredSoilData[]>([]);
  const [copied, setCopied] = useState(false);

  const loadData = () => {
    setUsers(localDb.getUsers());
    setFarms(localDb.getFarms());
    setSoilRecords(localDb.getSoilRecords());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearAll = () => {
    if (confirm("Permanently remove all data from the database? This will delete all registered farmers, farm parcels, and telemetry.")) {
      localDb.clearAll();
      loadData();
    }
  };

  const handleReset = () => {
    if (confirm("Load initial demo records (Ram Singh)? This will populate the demo farmer and farm parcel.")) {
      localDb.resetToDefaults();
      loadData();
    }
  };

  const fullDbDump = {
    users,
    farms,
    soilRecords,
    activeSession: localDb.getActiveSession(),
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(fullDbDump, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Card */}
        <div className="gov-card bg-white p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-bold border border-emerald-300">
                Local Storage Database
              </span>
              <span className="text-xs text-slate-500 font-mono">Status: Active & Persistent</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <Database className="h-7 w-7 text-emerald-800" />
              <span>Database Inspector (Local Storage)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              All registered farmers, farm parcels, coordinates, and soil observations stored directly in your browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-300"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{copied ? "Copied JSON!" : "Export Database JSON"}</span>
            </button>

            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              title="Completely remove all records from database"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Wipe / Remove All Data</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-300"
              title="Populate demo farmer (Ram Singh) for testing"
            >
              <Sprout className="h-3.5 w-3.5 text-emerald-700" />
              <span>Load Demo Records</span>
            </button>
          </div>
        </div>

        {/* Database Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveTab("users")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeTab === "users"
                ? "bg-emerald-50/80 border-emerald-600 shadow-xs ring-2 ring-emerald-600/20"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Farmers Table</span>
              <Users className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">{users.length}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">`brics_users_db` records</p>
          </div>

          <div
            onClick={() => setActiveTab("farms")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeTab === "farms"
                ? "bg-emerald-50/80 border-emerald-600 shadow-xs ring-2 ring-emerald-600/20"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Farm Parcels Table</span>
              <Sprout className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">{farms.length}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">`brics_farms_db` records</p>
          </div>

          <div
            onClick={() => setActiveTab("soil")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeTab === "soil"
                ? "bg-emerald-50/80 border-emerald-600 shadow-xs ring-2 ring-emerald-600/20"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Soil Telemetry Records</span>
              <FlaskConical className="h-4 w-4 text-blue-700" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">{soilRecords.length}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">`brics_soil_db` records</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "users"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span>Farmers ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("farms")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "farms"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Sprout className="h-3.5 w-3.5 shrink-0" />
            <span>Farm Parcels ({farms.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("soil")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "soil"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5 shrink-0" />
            <span>Soil Telemetry ({soilRecords.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "raw"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FileCode className="h-3.5 w-3.5 shrink-0" />
            <span>Raw JSON Storage</span>
          </button>
        </div>

        {/* TAB 1: USERS TABLE */}
        {activeTab === "users" && (
          <div className="gov-card bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">
                Table: `brics_users_db`
              </span>
              <span className="text-xs text-slate-500">
                Credentials used for farmer login
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Farmer ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Mobile (+91)</th>
                    <th className="p-3">Password</th>
                    <th className="p-3">Region</th>
                    <th className="p-3">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No farmer accounts registered. The database is empty.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-mono text-[11px] text-slate-500">{u.id}</td>
                        <td className="p-3 font-bold text-slate-900">{u.name}</td>
                        <td className="p-3 font-mono text-emerald-800 font-bold">+91 {u.mobile}</td>
                        <td className="p-3 font-mono text-slate-500">
                          {u.password ? "••••••••" : "N/A"}
                        </td>
                        <td className="p-3 text-slate-600">{u.region}</td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: FARMS TABLE */}
        {activeTab === "farms" && (
          <div className="gov-card bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">
                Table: `brics_farms_db`
              </span>
              <span className="text-xs text-slate-500">
                Farms bound to Sentinel-2 satellite telemetry
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Farm ID</th>
                    <th className="p-3">Farm Name</th>
                    <th className="p-3">Owner</th>
                    <th className="p-3">Exact GPS Coordinates</th>
                    <th className="p-3">Land Size</th>
                    <th className="p-3">Primary Crop</th>
                    <th className="p-3">Auto-Detected Soil</th>
                    <th className="p-3">Irrigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {farms.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        No farm parcels registered. The database is empty.
                      </td>
                    </tr>
                  ) : (
                    farms.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-mono text-[11px] text-emerald-800 font-bold">{f.id}</td>
                        <td className="p-3 font-bold text-slate-900">{f.name}</td>
                        <td className="p-3 text-slate-700">{f.owner}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-700">
                          {f.latitude.toFixed(4)}°N, {f.longitude.toFixed(4)}°E
                        </td>
                        <td className="p-3 font-bold text-slate-800">{f.areaAcres} Acres</td>
                        <td className="p-3 font-bold text-emerald-800">{f.crop}</td>
                        <td className="p-3 text-slate-700 font-semibold">{f.soilType}</td>
                        <td className="p-3 text-slate-500">{f.irrigationType}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SOIL TELEMETRY TABLE */}
        {activeTab === "soil" && (
          <div className="gov-card bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">
                Table: `brics_soil_db`
              </span>
              <span className="text-xs text-slate-500">
                Chemical NPK, pH, and composite soil quality index
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Farm ID</th>
                    <th className="p-3">Soil Type</th>
                    <th className="p-3">Nitrogen (N)</th>
                    <th className="p-3">Phosphorus (P)</th>
                    <th className="p-3">Potassium (K)</th>
                    <th className="p-3">pH</th>
                    <th className="p-3">Organic Carbon</th>
                    <th className="p-3">Moisture</th>
                    <th className="p-3">Quality Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {soilRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500">
                        No soil telemetry records. The database is empty.
                      </td>
                    </tr>
                  ) : (
                    soilRecords.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-mono text-[11px] text-slate-700">{s.farmId}</td>
                        <td className="p-3 font-bold text-slate-900">{s.soilType}</td>
                        <td className="p-3 font-mono">{s.nitrogen} kg/ha</td>
                        <td className="p-3 font-mono">{s.phosphorus} kg/ha</td>
                        <td className="p-3 font-mono">{s.potassium} kg/ha</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">{s.ph}</td>
                        <td className="p-3 font-mono">{s.organicCarbon}%</td>
                        <td className="p-3 font-mono">{s.moisture}%</td>
                        <td className="p-3 font-bold text-emerald-800">{s.soilScore} / 100</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: RAW JSON STORAGE */}
        {activeTab === "raw" && (
          <div className="gov-card bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-4 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="font-mono text-emerald-400">Complete JSON Dump of Browser LocalStorage</span>
              <button
                onClick={handleCopyJson}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors"
              >
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            </div>
            <pre className="mt-3 p-4 bg-slate-950 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto max-h-96">
              {JSON.stringify(fullDbDump, null, 2)}
            </pre>
          </div>
        )}

        {/* Quick Links */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
          <Link
            href="/farms"
            className="flex items-center gap-1.5 font-bold text-emerald-800 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Farms</span>
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-1.5 font-bold text-emerald-800 hover:underline"
          >
            <span>Register Another Farm Parcel</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
