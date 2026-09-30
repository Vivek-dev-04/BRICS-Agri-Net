"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useFarm } from "@/context/FarmContext";
import { inferSoilFromCoordinates } from "@/lib/auth/soilGeoService";
import { geocodeAddress, GeocodingResult } from "@/lib/services/geocodingService";
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
  Navigation,
  Layers,
  Activity,
  Layers3,
  X,
  Compass,
  Search,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function FarmsPage() {
  const router = useRouter();
  const { user, farm: activeFarm, farms, addFarm, switchFarm, deleteFarm } = useFarm();
  const [isCreating, setIsCreating] = useState(false);
  const [locating, setLocating] = useState(false);

  // Form states for adding new parcel
  const [name, setName] = useState("");
  const [location, setLocation] = useState(user.region || "Jaipur, Rajasthan");
  const [country, setCountry] = useState<"IN" | "BR" | "RU" | "CN" | "ZA">(user.country || "IN");
  const [area, setArea] = useState("2.5");
  const [crop, setCrop] = useState("Wheat");
  const [cropVariety, setCropVariety] = useState("High-Yield Hybrid");
  const [soilType, setSoilType] = useState("Sandy Loam");
  const [irrigation, setIrrigation] = useState("Drip Irrigation");
  const [latitude, setLatitude] = useState<number>(26.9124);
  const [longitude, setLongitude] = useState<number>(75.7873);
  const [sowingDate, setSowingDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const [addressQuery, setAddressQuery] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geoResults, setGeoResults] = useState<GeocodingResult[]>([]);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [coordsSource, setCoordsSource] = useState<"address" | "gps" | "default">("default");

  // GPS Auto-Detection for new plot (Option B: Device GPS)
  const handleDetectGPS = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        setCoordsSource("gps");

        // Auto-infer realistic regional soil classification from GPS
        const soilInfo = inferSoilFromCoordinates(lat, lon);
        setSoilType(soilInfo.soilType);

        setLocating(false);
      },
      (err) => {
        console.warn("GPS error:", err);
        setLocating(false);
        setGeoError("Could not detect device GPS location. You can enter address or PIN code instead.");
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  // Address Geocoding Auto-Detection (Option A: Exact Address / PIN Code)
  const handleAddressGeocode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = addressQuery.trim() || location.trim();
    if (!query) {
      setGeoError("Please enter village, tehsil, district, or 6-digit PIN code.");
      return;
    }

    setIsGeocoding(true);
    setGeoError(null);
    setGeoResults([]);

    const res = await geocodeAddress(query, country);
    setIsGeocoding(false);

    if (!res.success || res.results.length === 0) {
      setGeoError("Could not pinpoint exact location. You can refine the address or use device GPS below.");
      return;
    }

    if (res.results.length === 1) {
      const match = res.results[0];
      setLatitude(match.latitude);
      setLongitude(match.longitude);
      setLocation(match.displayName);
      const soilInfo = inferSoilFromCoordinates(match.latitude, match.longitude);
      setSoilType(soilInfo.soilType);
      setCoordsSource("address");
      setGeoResults([]);
    } else {
      setGeoResults(res.results);
      const topMatch = res.results[0];
      setLatitude(topMatch.latitude);
      setLongitude(topMatch.longitude);
      setLocation(topMatch.displayName);
      const soilInfo = inferSoilFromCoordinates(topMatch.latitude, topMatch.longitude);
      setSoilType(soilInfo.soilType);
      setCoordsSource("address");
    }
  };

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;

    addFarm({
      name,
      owner: user.name,
      location,
      country,
      latitude,
      longitude,
      areaAcres: parseFloat(area) || 2.5,
      crop,
      cropVariety,
      sowingDate,
      irrigationType: irrigation,
      soilType,
    });

    setIsCreating(false);
    setName("");

    // Directly navigate to dashboard to view the stats of this farm
    router.push("/dashboard");
  };

  const handleSelectFarmAndGoToStats = (farmId: string) => {
    switchFarm(farmId);
    router.push("/dashboard");
  };

  const totalAcres = farms.reduce((acc, f) => acc + (f.areaAcres || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold border border-emerald-300">
                Official Farm Registry
              </span>
              <span className="text-xs text-slate-500 font-medium">Farmer: {user.name}</span>
            </div>

            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <Sprout className="h-7 w-7 text-emerald-700" />
              My Registered Farm Parcels
            </h1>

            <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
              Select any farm parcel below to view its live telemetry, weather risks, soil health, and AI advisory stats.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>{isCreating ? "Close Form" : "Add New Farm Parcel"}</span>
            </button>
          </div>
        </div>

        {/* Portfolio Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="gov-card p-4 border border-slate-200 bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Registered Parcels</span>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">{farms.length}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Active cultivation fields</p>
          </div>

          <div className="gov-card p-4 border border-slate-200 bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Cultivated Area</span>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">{totalAcres.toFixed(1)} <span className="text-xs font-normal text-slate-500">Acres</span></div>
            <p className="text-[11px] text-emerald-800 font-medium mt-0.5">Under digital monitoring</p>
          </div>

          <div className="gov-card p-4 border border-slate-200 bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Parcel</span>
            <div className="mt-1 text-base font-bold text-slate-900 truncate">
              {farms.length > 0 ? activeFarm.name : "None registered"}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {farms.length > 0 ? `${activeFarm.crop} • ${activeFarm.areaAcres} Acres` : "No active parcel"}
            </p>
          </div>

          <div className="gov-card p-4 border border-slate-200 bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Telemetry Feed</span>
            <div className="mt-1 text-base font-bold text-emerald-800 flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${farms.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
              {farms.length > 0 ? "Live Connected" : "Awaiting Farm"}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {farms.length > 0 ? "Open-Meteo & Soil Grids" : "Register a parcel to connect"}
            </p>
          </div>
        </div>

        {/* Add Farm Form Section (Collapsible / Prominent) */}
        {isCreating && (
          <form
            onSubmit={handleCreateFarm}
            className="gov-card p-6 border border-emerald-400 bg-emerald-50/40 rounded-xl space-y-4 shadow-sm animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-emerald-800" />
                  Add New Farm Land Parcel
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Enter your land parcel details or auto-detect via GPS to configure dedicated weather and soil tracking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Plot Name */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Plot / Farm Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Ridge Mustard Field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="gov-input"
                />
              </div>

              {/* Village / District */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Location (Village, District, State) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur, Rajasthan"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="gov-input"
                />
              </div>

              {/* BRICS Member State */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  BRICS Member Country *
                </label>
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

              {/* Area Acres */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Parcel Land Area (Acres) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="2.5"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="gov-input"
                />
              </div>

              {/* Crop */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Primary Crop *
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="gov-input font-medium"
                >
                  <option value="Wheat">Wheat (गेंहू)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Bajra">Bajra / Pearl Millet (बाजरा)</option>
                  <option value="Gram">Gram / Chickpea (चना)</option>
                  <option value="Paddy Rice">Paddy Rice (धान)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Maize">Maize (मक्का)</option>
                </select>
              </div>

              {/* Crop Variety */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Crop Variety / Seed
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sharbati HD-2967 or Pusa Bold"
                  value={cropVariety}
                  onChange={(e) => setCropVariety(e.target.value)}
                  className="gov-input"
                />
              </div>

              {/* Soil Type */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Soil Classification
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="gov-input font-medium"
                >
                  <option value="Sandy Loam">Sandy Loam (बलुई दोमट - राजस्थान)</option>
                  <option value="Arid Sandy">Arid Sandy (थार रेतीली)</option>
                  <option value="Alluvial">Alluvial (जलोढ़ मैदानी)</option>
                  <option value="Black (Regur)">Black Cotton / Regur (काली मिट्टी)</option>
                  <option value="Red & Yellow">Red & Yellow (लाल-पीली)</option>
                  <option value="Laterite">Laterite (लैटेराइट)</option>
                  <option value="Loam">Agricultural Loam (सामान्य दोमट)</option>
                </select>
              </div>

              {/* Irrigation System */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Irrigation System
                </label>
                <select
                  value={irrigation}
                  onChange={(e) => setIrrigation(e.target.value)}
                  className="gov-input font-medium"
                >
                  <option value="Drip Irrigation">Drip Irrigation (ड्रिप सिंचाई)</option>
                  <option value="Sprinkler Irrigation">Sprinkler Irrigation (फव्वारा सिंचाई)</option>
                  <option value="Canal Irrigation">Canal Irrigation (नहरी पानी)</option>
                  <option value="Tube Well / Borewell">Tube Well / Borewell</option>
                  <option value="Rainfed (Barani)">Rainfed / Barani (वर्षा आधारित)</option>
                </select>
              </div>

              {/* Sowing Date */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Sowing Date
                </label>
                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="gov-input"
                />
              </div>
            </div>

            {/* DUAL LOCATION DETECTION BOX: Option A (Address/PIN) & Option B (Device GPS) */}
            <div className="rounded-xl border border-emerald-300 bg-white p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-800" />
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    GPS Coordinates & Soil Classification Detection
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800">
                  Select either method below
                </span>
              </div>

              {/* Option A: Search Exact Farm Address / PIN Code */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-emerald-800 text-[10px] text-white font-bold">
                      1
                    </span>
                    <span>Option A: Detect via Farm Address, Village, or PIN Code</span>
                  </label>
                  <span className="text-[10px] text-slate-500">e.g. 303702 or Chomu, Jaipur</span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter village, tehsil, district, or 6-digit postal PIN..."
                      value={addressQuery}
                      onChange={(e) => {
                        setAddressQuery(e.target.value);
                        if (e.target.value) setLocation(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddressGeocode();
                        }
                      }}
                      className="gov-input pl-8 text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddressGeocode()}
                    disabled={isGeocoding}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    {isGeocoding ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Detecting...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-3.5 w-3.5" />
                        <span>Detect GPS</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Multiple geocoding suggestions */}
                {geoResults.length > 1 && (
                  <div className="space-y-1 rounded border border-emerald-200 bg-emerald-50/50 p-2 max-h-28 overflow-y-auto">
                    <span className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      Multiple locations found. Click to select exact parcel:
                    </span>
                    {geoResults.map((r, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setLatitude(r.latitude);
                          setLongitude(r.longitude);
                          setLocation(r.displayName);
                          const s = inferSoilFromCoordinates(r.latitude, r.longitude);
                          setSoilType(s.soilType);
                          setCoordsSource("address");
                          setGeoResults([]);
                        }}
                        className="w-full text-left p-1 rounded hover:bg-white text-xs text-slate-800 transition-colors flex items-start gap-1"
                      >
                        <MapPin className="h-3 w-3 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{r.displayName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Option B: Current Device GPS */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-emerald-800 text-[10px] text-white font-bold">
                      2
                    </span>
                    <span>Option B: Auto-Detect via Current Device GPS</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Use when physically standing at the farm land parcel.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={locating}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  <Navigation className={`h-3.5 w-3.5 text-emerald-700 ${locating ? "animate-spin" : ""}`} />
                  <span>{locating ? "Detecting GPS..." : "Auto-Detect Plot GPS"}</span>
                </button>
              </div>

              {/* Error Notice */}
              {geoError && (
                <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  {geoError}
                </p>
              )}

              {/* Live Coordinates & Auto-Inferred Soil Strip */}
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-800">
                  <Compass className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>
                    Captured GPS:{" "}
                    <strong className="font-mono text-emerald-950">
                      {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
                    </strong>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {coordsSource === "address"
                      ? "Detected from Address"
                      : coordsSource === "gps"
                      ? "Captured from Device GPS"
                      : "Preset Agro Coordinates"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-700">
                  <Layers className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Auto Soil:</span>
                  <strong className="text-emerald-900">{soilType}</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-emerald-200">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 border border-slate-300 bg-white hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-800 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>Save Parcel & View Stats</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* Existing Farms Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-emerald-700" />
              <span>Select Farm Parcel to View Live Stats ({farms.length})</span>
            </h3>
            <span className="text-xs text-slate-500">Click any card to open detailed farm analysis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {farms.length === 0 && (
              <div className="col-span-full py-8 text-center bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <Sprout className="h-10 w-10 text-emerald-700 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-900">No Farm Parcels Registered Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  You haven&apos;t added any farm parcels to your account. Click &quot;Add New Farm Parcel&quot; below to register your land and start receiving weather forecasts and AI advisories.
                </p>
              </div>
            )}
            {farms.map((f) => {
              const isActive = f.id === activeFarm.id;
              return (
                <div
                  key={f.id}
                  onClick={() => handleSelectFarmAndGoToStats(f.id)}
                  className={`gov-card p-5 border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-lg hover:-translate-y-0.5 ${isActive
                      ? "border-emerald-700 ring-2 ring-emerald-700/80 bg-white shadow-md"
                      : "border-slate-200 bg-white hover:border-emerald-500"
                    }`}
                >
                  <div>
                    {/* Top Card Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {f.id}
                          </span>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[10px] font-bold border border-emerald-300">
                              <CheckCircle2 className="h-3 w-3 text-emerald-700" /> Active Parcel
                            </span>
                          )}
                        </div>

                        <h4 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-emerald-800 transition-colors">
                          {f.name}
                        </h4>

                        <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                          <span>{f.location}</span>
                        </p>
                      </div>

                      {!isActive && farms.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFarm(f.id);
                          }}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded hover:bg-red-50"
                          title="Delete parcel record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Farm Details Grid */}
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Crop</span>
                        <p className="font-bold text-slate-900 truncate mt-0.5">{f.crop}</p>
                        <span className="text-[10px] text-emerald-800 block truncate">{f.cropVariety}</span>
                      </div>

                      <div className="p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Land Area</span>
                        <p className="font-bold text-slate-900 mt-0.5">{f.areaAcres} Acres</p>
                        <span className="text-[10px] text-slate-500 block">Cultivated</span>
                      </div>

                      <div className="p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Soil Profile</span>
                        <p className="font-bold text-slate-900 truncate mt-0.5">{f.soilType}</p>
                        <span className="text-[10px] text-slate-500 block font-mono">
                          {f.latitude ? `${f.latitude.toFixed(2)}°N` : "GPS mapped"}
                        </span>
                      </div>

                      <div className="p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Irrigation</span>
                        <p className="font-bold text-slate-900 flex items-center gap-1 mt-0.5 truncate">
                          <Droplets className="h-3 w-3 text-blue-600 shrink-0" />
                          <span className="truncate">{f.irrigationType}</span>
                        </p>
                        <span className="text-[10px] text-slate-500 block">Sown {f.sowingDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Clickable Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectFarmAndGoToStats(f.id);
                      }}
                      className={`w-full flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-4 text-xs font-bold transition-all shadow-sm ${isActive
                          ? "bg-emerald-800 hover:bg-emerald-700 text-white"
                          : "bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-800"
                        }`}
                    >
                      <Activity className="h-3.5 w-3.5" />
                      <span>View Farm Stats & Analytics</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Quick "Add Another Farm" Card in Grid */}
            <div
              onClick={() => setIsCreating(true)}
              className="gov-card p-6 border-2 border-dashed border-slate-300 hover:border-emerald-600 hover:bg-emerald-50/20 cursor-pointer flex flex-col items-center justify-center text-center transition-all min-h-[260px] group"
            >
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                Add Another Farm Parcel
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Register an additional land parcel to track independent weather forecasts, soil nutrients, and AI advisories.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:underline">
                Register New Land Plot →
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
