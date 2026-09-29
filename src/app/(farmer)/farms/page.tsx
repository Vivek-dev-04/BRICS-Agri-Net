"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DEMO_FARM } from "@/lib/mock-data";
import { Sprout, MapPin, Plus, CheckCircle2, Calendar, Droplets } from "lucide-react";

export default function FarmsPage() {
  const [farms, setFarms] = useState([DEMO_FARM]);
  const [activeFarmId, setActiveFarmId] = useState(DEMO_FARM.id);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("2.5");
  const [crop, setCrop] = useState("Wheat");
  const [cropVariety, setCropVariety] = useState("HD-2967");
  const [soilType, setSoilType] = useState("Loamy");
  const [irrigation, setIrrigation] = useState("Drip");

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;

    const newFarm = {
      id: `farm-in-00${farms.length + 1}`,
      name,
      owner: "Farmer",
      location,
      country: "IN" as const,
      latitude: 26.9 + Math.random() * 0.1,
      longitude: 75.7 + Math.random() * 0.1,
      areaAcres: parseFloat(area) || 2.0,
      crop,
      cropVariety,
      sowingDate: new Date().toISOString().split("T")[0],
      irrigationType: irrigation,
      soilType,
    };

    setFarms([...farms, newFarm]);
    setActiveFarmId(newFarm.id);
    setIsCreating(false);
    setName("");
    setLocation("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                Module 1
              </span>
              <span className="text-xs text-slate-400">Core Farm Registry</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sprout className="h-6 w-6 text-emerald-400" />
              Farm & Crop Management
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              Manage plot boundaries, soil classifications, crop lifecycle metadata, and irrigation systems.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? "Cancel" : "Register New Farm"}
          </button>
        </div>

        {/* Create Farm Form */}
        {isCreating && (
          <form
            onSubmit={handleCreateFarm}
            className="glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-emerald-950/10 space-y-4"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sprout className="h-4 w-4 text-emerald-400" />
              Register New Farm Boundary & Crop Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300">Farm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Green Valley Farm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Location (Village / State)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur, Rajasthan"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Farm Area (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Crop Type</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Paddy Rice</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Maize">Maize</option>
                  <option value="Cotton">Cotton</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Crop Variety</label>
                <input
                  type="text"
                  placeholder="e.g. Sharbati HD-2967"
                  value={cropVariety}
                  onChange={(e) => setCropVariety(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Soil Texture</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Loamy">Loamy</option>
                  <option value="Loamy Sand">Loamy Sand</option>
                  <option value="Clayey">Clayey</option>
                  <option value="Black Cotton">Black Cotton</option>
                  <option value="Alluvial">Alluvial</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Irrigation Setup</label>
                <select
                  value={irrigation}
                  onChange={(e) => setIrrigation(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Drip">Drip Irrigation</option>
                  <option value="Sprinkler">Sprinkler Irrigation</option>
                  <option value="Flood">Surface Flood</option>
                  <option value="Rainfed">Rainfed / None</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                Save Farm Profile
              </button>
            </div>
          </form>
        )}

        {/* Existing Farms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farms.map((f) => {
            const isActive = f.id === activeFarmId;
            return (
              <div
                key={f.id}
                className={`glass-panel rounded-2xl p-5 border transition-all ${
                  isActive
                    ? "border-emerald-500/50 bg-slate-900/90 shadow-lg shadow-emerald-500/5"
                    : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">{f.id}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{f.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-emerald-400" />
                      {f.location}
                    </p>
                  </div>
                  {isActive ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveFarmId(f.id)}
                      className="rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
                    >
                      Select
                    </button>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Crop:</span>
                    <p className="font-semibold text-white">{f.crop} ({f.cropVariety})</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Area:</span>
                    <p className="font-semibold text-white">{f.areaAcres} Acres</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Soil:</span>
                    <p className="font-semibold text-white">{f.soilType}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Irrigation:</span>
                    <p className="font-semibold text-white flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-blue-400" /> {f.irrigationType}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Sown: {f.sowingDate}
                  </span>
                  <span>Coords: {f.latitude.toFixed(2)}, {f.longitude.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
