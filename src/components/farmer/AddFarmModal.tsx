"use client";

import React, { useState } from "react";
import { useFarm } from "@/context/FarmContext";
import { inferSoilFromCoordinates } from "@/lib/auth/soilGeoService";
import { geocodeAddress, GeocodingResult } from "@/lib/services/geocodingService";
import {
  Sprout,
  MapPin,
  Navigation,
  Compass,
  Search,
  Loader2,
  CheckCircle2,
  X,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddFarmModal({ isOpen, onClose, onSuccess }: AddFarmModalProps) {
  const { user, farms, addFarm } = useFarm();

  // Basic Form States
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState<"IN" | "BR" | "RU" | "CN" | "ZA">(user.country || "IN");
  const [area, setArea] = useState("2.5");
  const [crop, setCrop] = useState("Wheat");
  const [cropVariety, setCropVariety] = useState("High-Yield Hybrid");
  const [soilType, setSoilType] = useState("Sandy Loam");
  const [irrigation, setIrrigation] = useState("Drip Irrigation");
  const [sowingDate, setSowingDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Coordinates
  const [latitude, setLatitude] = useState<number>(26.9124);
  const [longitude, setLongitude] = useState<number>(75.7873);
  const [coordinatesSource, setCoordinatesSource] = useState<"address" | "gps" | "default">("default");

  // Geocoding Address Search States
  const [addressQuery, setAddressQuery] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geoResults, setGeoResults] = useState<GeocodingResult[]>([]);
  const [geoError, setGeoError] = useState<string | null>(null);

  // GPS Device Locating States
  const [isLocating, setIsLocating] = useState(false);

  // Apply coordinates and automatically update soil classification
  const applyCoordinates = (lat: number, lon: number, source: "address" | "gps", placeLabel?: string) => {
    setLatitude(lat);
    setLongitude(lon);
    setCoordinatesSource(source);

    // Auto-infer soil classification from coordinates
    const soilInfo = inferSoilFromCoordinates(lat, lon);
    setSoilType(soilInfo.soilType);

    if (placeLabel && !location) {
      setLocation(placeLabel);
    }
  };

  // Option 1: Search Exact Address / Village / Pincode
  const handleAddressGeocode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = addressQuery.trim() || location.trim();
    if (!query) {
      setGeoError("Please enter an address, village, district, or 6-digit PIN code.");
      return;
    }

    setIsGeocoding(true);
    setGeoError(null);
    setGeoResults([]);

    const res = await geocodeAddress(query, country);
    setIsGeocoding(false);

    if (!res.success || res.results.length === 0) {
      setGeoError(
        "Could not pinpoint exact location. You can adjust the address or use device GPS below."
      );
      return;
    }

    if (res.results.length === 1) {
      const match = res.results[0];
      applyCoordinates(match.latitude, match.longitude, "address", match.displayName);
      setLocation(match.displayName);
      setGeoResults([]);
    } else {
      // Multiple matches: show options and select the top one
      setGeoResults(res.results);
      const topMatch = res.results[0];
      applyCoordinates(topMatch.latitude, topMatch.longitude, "address", topMatch.displayName);
      setLocation(topMatch.displayName);
    }
  };

  // Option 2: Use Device GPS
  const handleDeviceGps = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        applyCoordinates(lat, lon, "gps");
        setIsLocating(false);
      },
      (err) => {
        console.warn("Device GPS error:", err);
        setIsLocating(false);
        setGeoError("Device GPS could not be acquired. You can search by address or PIN code.");
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    // Check duplicate farm name for this farmer
    const isDuplicate = farms.some(
      (f) => f.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (isDuplicate) {
      setNameError(
        `You already have a farm registered with the name "${cleanName}". Please specify a distinct plot name (e.g. "${cleanName} - Plot 2").`
      );
      return;
    }

    const farmLoc = location.trim() || addressQuery.trim() || `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;

    addFarm({
      name: cleanName,
      owner: user.name,
      location: farmLoc,
      country,
      latitude,
      longitude,
      areaAcres: parseFloat(area) || 2.5,
      crop,
      cropVariety: cropVariety.trim() || "Local Standard",
      sowingDate,
      irrigationType: irrigation,
      soilType,
    });

    onClose();
    if (onSuccess) onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-800 text-white">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Register New Farm Land Parcel</h2>
              <p className="text-xs text-emerald-200">
                Auto-detect Latitude & Longitude from exact address or device GPS to configure live telemetry.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-emerald-200 hover:bg-emerald-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Farm Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Farm / Plot Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. South Ridge Mustard Field"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                className={`gov-input ${nameError ? "border-red-500 ring-2 ring-red-500/20" : ""}`}
              />
              {nameError && (
                <p className="text-[11px] text-red-600 font-semibold mt-1">
                  {nameError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                BRICS Member Country <span className="text-red-500">*</span>
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as any)}
                className="gov-input font-medium"
              >
                <option value="IN">India (IN)</option>
                <option value="BR">Brazil (BR)</option>
                <option value="RU">Russia (RU)</option>
                <option value="CN">China (CN)</option>
                <option value="ZA">South Africa (ZA)</option>
              </select>
            </div>
          </div>

          {/* DUAL LOCATION DETECTION BOX */}
          <div className="rounded-xl border-2 border-emerald-600/30 bg-emerald-50/40 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-800" />
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  GPS Location & Soil Detection
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800">
                Choose either method below
              </span>
            </div>

            {/* OPTION 1: Detect via Exact Address / Village / Pincode */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-emerald-800 text-[10px] text-white font-bold">
                    1
                  </span>
                  <span>Option A: Detect via Farm Address, Village, or PIN Code</span>
                </label>
                <span className="text-[10px] text-slate-500">e.g. 303702, Chomu, Jaipur</span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
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
                    className="gov-input pl-9 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddressGeocode()}
                  disabled={isGeocoding}
                  className="px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 disabled:opacity-50"
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

              {/* Multiple Geocoding Suggestions */}
              {geoResults.length > 1 && (
                <div className="mt-2 space-y-1 rounded-lg border border-emerald-200 bg-emerald-50/60 p-2 max-h-32 overflow-y-auto">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">
                    Multiple locations found. Click to select exact area:
                  </span>
                  {geoResults.map((r, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        applyCoordinates(r.latitude, r.longitude, "address", r.displayName);
                        setLocation(r.displayName);
                        setGeoResults([]);
                      }}
                      className="w-full text-left p-1.5 rounded hover:bg-white text-xs text-slate-800 transition-colors flex items-start gap-1.5"
                    >
                      <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{r.displayName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* OPTION 2: Auto-Detect via Device GPS */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-emerald-800 text-[10px] text-white font-bold">
                    2
                  </span>
                  <span>Option B: Auto-Detect via Current Device GPS</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Ideal if you are currently standing on your field parcel.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDeviceGps}
                disabled={isLocating}
                className="px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-700" />
                    <span>Detecting GPS...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Use Current Device GPS</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Display */}
            {geoError && (
              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                {geoError}
              </p>
            )}

            {/* Captured Coordinates & Inferred Soil Banner */}
            <div className="rounded-lg bg-emerald-900/5 border border-emerald-300 p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-emerald-800 shrink-0" />
                  <span className="font-semibold text-slate-800">
                    Detected Coordinates:{" "}
                    <strong className="font-mono text-emerald-950">
                      {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
                    </strong>
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  {coordinatesSource === "address"
                    ? "Detected from Address"
                    : coordinatesSource === "gps"
                    ? "Captured from Device GPS"
                    : "Preset Agro Coordinates"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-emerald-200 text-xs text-slate-700">
                <span className="flex items-center gap-1.5 font-medium">
                  <Layers className="h-3.5 w-3.5 text-emerald-700" />
                  Auto-Inferred Soil Profile:
                </span>
                <span className="font-bold text-emerald-900">{soilType}</span>
              </div>
            </div>
          </div>

          {/* Farm Parcel Agronomic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Crop Variety / Seed
              </label>
              <input
                type="text"
                placeholder="e.g. Sharbati HD-2967"
                value={cropVariety}
                onChange={(e) => setCropVariety(e.target.value)}
                className="gov-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Soil Classification (Auto-filled)
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Irrigation System
              </label>
              <select
                value={irrigation}
                onChange={(e) => setIrrigation(e.target.value)}
                className="gov-input font-medium"
              >
                <option value="Drip Irrigation">Drip Irrigation (ड्रिप सिंचाई)</option>
                <option value="Sprinkler Irrigation">Sprinkler Irrigation (फव्वारा)</option>
                <option value="Canal Irrigation">Canal Irrigation (नहरी पानी)</option>
                <option value="Tube Well / Borewell">Tube Well / Borewell</option>
                <option value="Rainfed (Barani)">Rainfed / Barani (वर्षा आधारित)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
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

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Sprout className="h-4 w-4" />
              <span>Register Farm & Connect Live Telemetry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
