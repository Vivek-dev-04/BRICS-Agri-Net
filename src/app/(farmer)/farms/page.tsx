"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useFarm } from "@/context/FarmContext";
import {
  Sprout,
  MapPin,
  Plus,
  CheckCircle2,
  Calendar,
  Droplets,
  Trash2,
  ArrowRight,
  Globe2,
  Building2,
} from "lucide-react";

export default function FarmsPage() {
  const { user, farm: activeFarm, farms, addFarm, switchFarm, deleteFarm } = useFarm();
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [location, setLocation] = useState(user.region || "Jaipur, Rajasthan");
  const [country, setCountry] = useState<"IN" | "BR" | "RU" | "CN" | "ZA">(user.country || "IN");
  const [area, setArea] = useState("2.5");
  const [crop, setCrop] = useState("Wheat");
  const [cropVariety, setCropVariety] = useState("HD-2967");
  const [soilType, setSoilType] = useState("Loamy Sand");
  const [irrigation, setIrrigation] = useState("Drip Irrigation");

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;

    addFarm({
      name,
      owner: user.name,
      location,
      country,
      latitude: country === "IN" ? 26.91 : country === "BR" ? -15.79 : 35.86,
      longitude: country === "IN" ? 75.78 : country === "BR" ? -47.88 : 104.19,
      areaAcres: parseFloat(area) || 2.0,
      crop,
      cropVariety,
      sowingDate: new Date().toISOString().split("T")[0],
      irrigationType: irrigation,
      soilType,
    });

    setIsCreating(false);
    setName("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold border border-emerald-300">
                Official Farm Registry
              </span>
              <span className="text-xs text-slate-500 font-medium">Farmer: {user.name}</span>
            </div>

            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <Sprout className="h-6 w-6 text-emerald-700" />
              Registered Farm Parcels & Crops
            </h1>

            <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
              Manage land parcel records, crop calendars, soil classifications, and irrigation systems.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Globe2 className="h-4 w-4 text-emerald-700" />
              Switch Profile / Login
            </Link>

            <button
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              {isCreating ? "Cancel" : "Register New Plot"}
            </button>
          </div>
        </div>

        {/* Active Farm Highlight */}
        <div className="gov-card p-6 border-l-4 border-l-emerald-800 bg-white border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                <span>Currently Active Parcel Telemetry</span>
                <span className="font-mono text-slate-500 font-normal">({activeFarm.id})</span>
              </div>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {activeFarm.name}
              </h2>

              <p className="mt-0.5 text-xs text-slate-600 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-700" />
                <span>{activeFarm.location}</span>
                <span className="text-slate-400">•</span>
                <span>{activeFarm.areaAcres} Acres</span>
                <span className="text-slate-400">•</span>
                <span>{activeFarm.soilType}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block text-[11px]">Primary Crop</span>
                <strong className="text-slate-900">{activeFarm.crop}</strong>
                <span className="text-[10px] text-emerald-700 block">{activeFarm.cropVariety}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block text-[11px]">Irrigation Setup</span>
                <strong className="text-slate-900 flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-blue-600" />
                  {activeFarm.irrigationType}
                </strong>
                <span className="text-[10px] text-slate-500 block">Sown {activeFarm.sowingDate}</span>
              </div>

              <Link
                href="/dashboard"
                className="flex items-center gap-1 rounded-lg bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Open Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Add Farm Form Drawer */}
        {isCreating && (
          <form
            onSubmit={handleCreateFarm}
            className="gov-card p-6 border border-emerald-300 bg-emerald-50/30 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sprout className="h-4 w-4 text-emerald-700" />
                Register New Land Parcel & Crop Profile
              </h3>
              <span className="text-xs text-slate-500">Government Agricultural Registry Form</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Plot Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Ridge Wheat Field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="gov-input"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">State / Village *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur, Rajasthan"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="gov-input"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">BRICS Member Node *</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as any)}
                  className="gov-input font-medium"
                >
                  <option value="IN">🇮🇳 India (IN)</option>
                  <option value="BR">🇧🇷 Brazil (BR)</option>
                  <option value="RU">🇷🇺 Russia (RU)</option>
                  <option value="CN">🇨🇳 China (CN)</option>
                  <option value="ZA">🇿🇦 South Africa (ZA)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Parcel Area (Acres) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="gov-input"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Sown Crop *</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="gov-input"
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Paddy Rice">Paddy Rice</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Maize">Maize</option>
                  <option value="Cotton">Cotton</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Crop Variety</label>
                <input
                  type="text"
                  placeholder="e.g. Sharbati HD-2967"
                  value={cropVariety}
                  onChange={(e) => setCropVariety(e.target.value)}
                  className="gov-input"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Soil Texture</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="gov-input"
                >
                  <option value="Loamy Sand">Loamy Sand</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Clayey">Clayey</option>
                  <option value="Black Cotton">Black Cotton</option>
                  <option value="Alluvial">Alluvial</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Irrigation System</label>
                <select
                  value={irrigation}
                  onChange={(e) => setIrrigation(e.target.value)}
                  className="gov-input"
                >
                  <option value="Drip Irrigation">Drip Irrigation</option>
                  <option value="Sprinkler Irrigation">Sprinkler Irrigation</option>
                  <option value="Surface Flood">Surface Flood</option>
                  <option value="Rainfed">Rainfed / None</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-lg bg-emerald-800 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Save Land Parcel & Set Active
              </button>
            </div>
          </form>
        )}

        {/* Existing Farms List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span>Registered Agricultural Parcels ({farms.length})</span>
            <span className="text-xs text-slate-500 font-normal">Click &quot;Make Active&quot; to switch active telemetry</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {farms.map((f) => {
              const isActive = f.id === activeFarm.id;
              return (
                <div
                  key={f.id}
                  className={`gov-card p-5 border transition-all flex flex-col justify-between ${
                    isActive
                      ? "border-emerald-700 ring-2 ring-emerald-700 bg-white shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {f.id}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{f.name}</h4>
                        <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                          {f.location}
                        </p>
                      </div>

                      {isActive ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-xs font-bold border border-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> Active
                        </span>
                      ) : (
                        <button
                          onClick={() => switchFarm(f.id)}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                        >
                          Make Active
                        </button>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Crop:</span>
                        <p className="font-bold text-slate-900">{f.crop} ({f.cropVariety})</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Area:</span>
                        <p className="font-bold text-slate-900">{f.areaAcres} Acres</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Soil:</span>
                        <p className="font-bold text-slate-900">{f.soilType}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Irrigation:</span>
                        <p className="font-bold text-slate-900 flex items-center gap-1">
                          <Droplets className="h-3 w-3 text-blue-600" /> {f.irrigationType}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Sown: {f.sowingDate}
                    </span>

                    {!isActive && farms.length > 1 && (
                      <button
                        onClick={() => deleteFarm(f.id)}
                        className="text-red-600 hover:text-red-700 transition-colors p-1"
                        title="Delete record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
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
