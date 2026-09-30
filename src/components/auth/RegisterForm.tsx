"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Compass,
  Navigation,
  Sprout,
  ShieldCheck,
  Layers,
  Sparkles,
} from "lucide-react";
import { LanguageSelector, SupportedLanguage } from "./LanguageSelector";
import { validateIndianMobile, validatePassword, registerFarmer } from "@/lib/auth/authService";
import {
  inferSoilFromCoordinates,
  inferRegionFromCoordinates,
  reverseGeocodeCoordinates,
  SoilInfo,
  RegionInfo,
} from "@/lib/auth/soilGeoService";
import { useFarm } from "@/context/FarmContext";

const PRESET_CROPS = [
  { id: "Wheat", labelEn: "Wheat", labelHi: "गेहूं", emoji: "🌾" },
  { id: "Rice", labelEn: "Rice / Paddy", labelHi: "धान / चावल", emoji: "🌾" },
  { id: "Cotton", labelEn: "Cotton", labelHi: "कपास", emoji: "🌿" },
  { id: "Soybean", labelEn: "Soybean", labelHi: "सोयाबीन", emoji: "🌱" },
  { id: "Mustard", labelEn: "Mustard", labelHi: "सरसों", emoji: "🌼" },
  { id: "Maize", labelEn: "Maize / Corn", labelHi: "मक्का", emoji: "🌽" },
  { id: "Sugarcane", labelEn: "Sugarcane", labelHi: "गन्ना", emoji: "🎋" },
  { id: "Pulses", labelEn: "Pulses / Dal", labelHi: "दालें", emoji: "🫘" },
  { id: "Vegetables", labelEn: "Vegetables", labelHi: "सब्जियां", emoji: "🥦" },
  { id: "Fruits", labelEn: "Fruits / Orchards", labelHi: "फल", emoji: "🍎" },
];

const IRRIGATION_TYPES = [
  { id: "Canal", labelEn: "Canal Irrigation", labelHi: "नहर सिंचाई" },
  { id: "Borewell", labelEn: "Borewell / Tubewell", labelHi: "बोरवेल / नलकूप" },
  { id: "Drip", labelEn: "Drip / Sprinkler Irrigation", labelHi: "ड्रिप / फव्वारा सिंचाई" },
  { id: "Rainfed", labelEn: "Rainfed (Monsoon Dependent)", labelHi: "वर्षा आधारित (मानसून)" },
];

const TRANSLATIONS = {
  en: {
    badge: "Official Farmer Registration",
    step1Title: "1. Farmer Account",
    step1Subtitle: "Create your secure farmer credentials to access AI advisories and telemetry.",
    step2Title: "2. GPS Telemetry & Soil",
    step2Subtitle: "Allow GPS location to automatically identify your region and soil classification.",
    step3Title: "3. Crop & Acreage",
    step3Subtitle: "Enter what you cultivate so our models can customize agricultural intelligence.",
    nameLabel: "Farmer Full Name",
    namePlaceholder: "Enter your full name",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "10-digit mobile number",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 6 characters",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter password",
    gpsBtn: "Detect Farm Location & Soil via GPS",
    gpsDetecting: "Requesting location permission from browser...",
    gpsGranted: "GPS Telemetry & Soil Classification Verified",
    gpsDenied: "Location permission denied. Click below to retry or use coordinates.",
    autoRegionLabel: "Identified Region & Agro-Climatic Zone",
    autoSoilLabel: "Automated Soil Classification",
    autoSoilSubtitle: "Calculated from your farm's geographical coordinates",
    areaLabel: "Farm Land Size (in Acres)",
    areaPlaceholder: "e.g. 4.5",
    cropLabel: "What Primary Crop Do You Grow?",
    customCropBtn: "✏️ Other Crop",
    customCropPlaceholder: "Type your crop name...",
    irrigationLabel: "Main Source of Irrigation",
    btnNext: "Continue to Next Step",
    btnBack: "Back",
    btnSubmit: "Complete Farm Registration",
    submitting: "Submitting farm registration...",
    alreadyRegistered: "Already registered?",
    signInLink: "Sign in here",
    successTitle: "Farm Registered Successfully! 🎉",
    successSubtitle: "Your farm has been registered with automated GPS telemetry and satellite soil classification.",
    goToDashboard: "Go to Farm Dashboard",
    goToLogin: "Back to Login",
  },
  hi: {
    badge: "आधिकारिक किसान पंजीकरण",
    step1Title: "1. किसान खाता",
    step1Subtitle: "एआई सलाह और उपग्रह निगरानी के लिए अपना सुरक्षित किसान खाता बनाएं।",
    step2Title: "2. GPS और मिट्टी पहचान",
    step2Subtitle: "अपने क्षेत्र और मिट्टी के प्रकार की स्वचालित पहचान के लिए GPS अनुमति दें।",
    step3Title: "3. फसल और रकबा",
    step3Subtitle: "अपनी फसल का विवरण दर्ज करें ताकि एआई सटीक कृषि मार्गदर्शन प्रदान कर सके।",
    nameLabel: "किसान का पूरा नाम",
    namePlaceholder: "अपना पूरा नाम दर्ज करें",
    mobileLabel: "मोबाइल नंबर",
    mobilePlaceholder: "10 अंकों का मोबाइल नंबर",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "कम से कम 6 अक्षर",
    confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "पासवर्ड पुनः दर्ज करें",
    gpsBtn: "GPS द्वारा स्थान और मिट्टी की पहचान करें",
    gpsDetecting: "ब्राउज़र से स्थान की अनुमति मांगी जा रही है...",
    gpsGranted: "सटीक GPS और मिट्टी का प्रकार सत्यापित हुआ",
    gpsDenied: "स्थान की अनुमति नहीं मिली। पुनः प्रयास करने के लिए नीचे क्लिक करें।",
    autoRegionLabel: "पहचाना गया कृषि-जलवायु क्षेत्र",
    autoSoilLabel: "स्वचालित रूप से पहचानी गई मिट्टी",
    autoSoilSubtitle: "आपके खेत के भौगोलिक निर्देशांकों से स्वचालित रूप से निर्धारित",
    areaLabel: "खेत का क्षेत्रफल (एकड़ में)",
    areaPlaceholder: "उदा. 4.5",
    cropLabel: "आप मुख्य रूप से कौन सी फसल उगाते हैं?",
    customCropBtn: "✏️ अन्य फसल",
    customCropPlaceholder: "फसल का नाम लिखें...",
    irrigationLabel: "सिंचाई का मुख्य स्रोत",
    btnNext: "अगले चरण पर जाएं",
    btnBack: "पीछे जाएं",
    btnSubmit: "खेत पंजीकरण पूरा करें",
    submitting: "पंजीकरण हो रहा है...",
    alreadyRegistered: "क्या पहले से पंजीकृत हैं?",
    signInLink: "यहां साइन इन करें",
    successTitle: "खेत सफलतापूर्वक पंजीकृत हुआ! 🎉",
    successSubtitle: "आपका खेत सटीक GPS और उपग्रह मिट्टी वर्गीकरण के साथ सक्रिय हो गया है।",
    goToDashboard: "खेत डैशबोर्ड पर जाएं",
    goToLogin: "लॉगिन पर वापस जाएं",
  },
};

export function RegisterForm() {
  const router = useRouter();
  const { register: registerInContext } = useFarm();

  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const t = TRANSLATIONS[language];

  // Multi-Page Wizard: Step 1, Step 2, Step 3, or Step 4 (Success)
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Farmer Identity
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Automated GPS Location & Soil Telemetry
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "granted" | "denied">("idle");
  const [detectedSoil, setDetectedSoil] = useState<SoilInfo | null>(null);
  const [detectedRegion, setDetectedRegion] = useState<RegionInfo | null>(null);

  // Step 3: Crop & Farm Details
  const [areaAcres, setAreaAcres] = useState("");
  const [crop, setCrop] = useState("Wheat");
  const [customCrop, setCustomCrop] = useState("");
  const [isCustomCropSelected, setIsCustomCropSelected] = useState(false);
  const [irrigationType, setIrrigationType] = useState("Canal");

  // Validation & Loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredSummary, setRegisteredSummary] = useState<{
    name: string;
    farmId: string;
    region: string;
    crop: string;
    soilType: string;
    area: number;
    lat: number;
    lng: number;
  } | null>(null);

  // Request browser GPS permission and infer soil & region
  const requestGpsLocation = () => {
    if (!navigator.geolocation) {
      // Fallback coordinates for demonstration
      applyCoordinates(26.9124, 75.7873, 20);
      return;
    }

    setIsLocating(true);
    setGpsStatus("idle");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const acc = position.coords.accuracy;
        await applyCoordinates(lat, lng, acc);
        setGpsStatus("granted");
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation permission error:", error.message);
        setGpsStatus("denied");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Helper to calculate soil and region from coordinates
  const applyCoordinates = async (lat: number, lng: number, acc?: number) => {
    setLatitude(lat);
    setLongitude(lng);
    if (acc) setGpsAccuracy(acc);

    // 1. Automatically infer soil classification
    const soil = inferSoilFromCoordinates(lat, lng);
    setDetectedSoil(soil);

    // 2. Automatically infer agro-climatic region
    const region = await reverseGeocodeCoordinates(lat, lng);
    setDetectedRegion(region);

    if (errors.gps) setErrors((prev) => ({ ...prev, gps: "" }));
  };

  // Auto-request GPS when the farmer navigates to Page 2
  useEffect(() => {
    if (currentPage === 2 && !latitude && typeof window !== "undefined") {
      requestGpsLocation();
    }
  }, [currentPage]);

  // Handle Mobile input
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(raw);
    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = language === "hi" ? "कृपया किसान का पूरा नाम दर्ज करें।" : "Please enter your full name.";
    }

    const mobileVal = validateIndianMobile(mobile);
    if (!mobileVal.isValid) {
      newErrors.mobile = mobileVal.error || "Please enter a valid 10-digit mobile number.";
    }

    const passVal = validatePassword(password);
    if (!passVal.isValid) {
      newErrors.password = passVal.error || "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword =
        language === "hi" ? "पासवर्ड मेल नहीं खाते हैं।" : "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation (GPS must be acquired)
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!latitude || !longitude) {
      newErrors.gps =
        language === "hi"
          ? "कृपया खेत का स्थान और मिट्टी निर्धारित करने के लिए GPS अनुमति दें।"
          : "Please allow GPS location permission to detect your farm coordinates and soil.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 3 Validation (Acreage & Crop)
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    const parsedArea = parseFloat(areaAcres);
    if (!areaAcres || isNaN(parsedArea) || parsedArea <= 0) {
      newErrors.areaAcres =
        language === "hi"
          ? "कृपया अपने खेत का क्षेत्रफल (एकड़ में) दर्ज करें।"
          : "Please enter your farm land size in acres.";
    }

    const finalCrop = isCustomCropSelected ? customCrop.trim() : crop;
    if (!finalCrop) {
      newErrors.crop =
        language === "hi" ? "कृपया अपनी मुख्य फसल चुनें।" : "Please select or type your primary crop.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Multi-Page Navigation Handlers
  const goToNextPage = () => {
    setServerError(null);
    if (currentPage === 1 && validateStep1()) {
      setCurrentPage(2);
    } else if (currentPage === 2 && validateStep2()) {
      setCurrentPage(3);
    }
  };

  const goToPrevPage = () => {
    setServerError(null);
    setErrors({});
    if (currentPage === 2) setCurrentPage(1);
    if (currentPage === 3) setCurrentPage(2);
  };

  // Final Submission on Step 3
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    setServerError(null);

    const parsedArea = parseFloat(areaAcres);
    const finalCrop = isCustomCropSelected ? customCrop.trim() : crop;
    const finalLat = latitude ?? 26.9124;
    const finalLng = longitude ?? 75.7873;
    const finalSoil = detectedSoil ? detectedSoil.soilType : "Alluvial";
    const finalRegion = detectedRegion ? detectedRegion.region : "National Agricultural Grid";
    const finalFarmName = `${name.trim()}'s Farm`;

    try {
      // 1. Submit to server API route
      const apiResponse = await registerFarmer({
        name: name.trim(),
        mobile: mobile.trim(),
        password,
        country: "IN",
        state: detectedRegion?.state,
        district: detectedRegion?.district,
        farmName: finalFarmName,
        latitude: finalLat,
        longitude: finalLng,
        areaAcres: parsedArea,
        crop: finalCrop,
        soilType: finalSoil,
        irrigationType,
      });

      if (!apiResponse.success) {
        setServerError(apiResponse.error || "Failed to register farm. Please try again.");
        setIsLoading(false);
        return;
      }

      // 2. Synchronize with FarmContext for immediate application hydration
      registerInContext({
        name: name.trim(),
        email: `${mobile.trim()}@brics-agri.net`,
        password,
        country: "IN",
        region: finalRegion,
        farmName: finalFarmName,
        latitude: finalLat,
        longitude: finalLng,
        areaAcres: parsedArea,
        crop: finalCrop,
        cropVariety: "High-Yield Hybrid",
        sowingDate: new Date().toISOString().split("T")[0],
        soilType: finalSoil,
        irrigationType,
      });

      // 3. Move to Page 4 (Success Card)
      setRegisteredSummary({
        name: name.trim(),
        farmId: apiResponse.farmId || `farm-in-${Date.now().toString().slice(-4)}`,
        region: finalRegion,
        crop: finalCrop,
        soilType: finalSoil,
        area: parsedArea,
        lat: finalLat,
        lng: finalLng,
      });

      setCurrentPage(4);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // PAGE 4: SUCCESS CONFIRMATION VIEW
  // =========================================================================
  if (currentPage === 4 && registeredSummary) {
    return (
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
          <CheckCircle2 className="h-10 w-10 text-emerald-700" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Farm & Crop Telemetry Registered</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {t.successTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {t.successSubtitle}
          </p>
        </div>

        {/* Registered Farm Profile Details Card */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-left text-xs space-y-3.5 shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="font-extrabold text-sm text-slate-900 block">{registeredSummary.name}</span>
              <span className="text-[11px] text-slate-500 font-mono">Mobile: +91 {mobile}</span>
            </div>
            <span className="font-mono text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md">
              {registeredSummary.farmId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Identified Region</span>
              <span className="font-semibold text-slate-900 text-xs">{registeredSummary.region}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Exact GPS Telemetry</span>
              <span className="font-semibold font-mono text-emerald-800 text-[11px] flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" />
                {registeredSummary.lat.toFixed(4)}° N, {registeredSummary.lng.toFixed(4)}° E
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Primary Crop</span>
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                <Sprout className="h-3.5 w-3.5 text-emerald-700" />
                {registeredSummary.crop}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Auto-Identified Soil</span>
              <span className="font-semibold text-slate-900 text-xs flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-amber-700" />
                {registeredSummary.soilType} Soil
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Farm Land Size</span>
              <span className="font-semibold text-slate-900 text-xs">{registeredSummary.area} Acres</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Satellite Monitoring</span>
              <span className="font-bold text-emerald-700 text-xs flex items-center gap-1">
                <Check className="h-3 w-3" /> Sentinel-2 Active
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/farms")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold py-3.5 px-4 text-sm transition-all shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-700/30"
          >
            <span>View My Farms & Add Plots</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            href="/login"
            className="flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 px-4 text-sm transition-colors"
          >
            {t.goToLogin}
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MULTI-PAGE REGISTRATION WIZARD (PAGES 1, 2, 3)
  // =========================================================================
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
      {/* Top Header Row with Language Selector */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <span className="text-[11px] font-semibold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          {t.badge}
        </span>
        <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
      </div>

      {/* Dynamic Title by Page */}
      <div className="pt-4 pb-4 space-y-1 text-left">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
          {currentPage === 1 && t.step1Title}
          {currentPage === 2 && t.step2Title}
          {currentPage === 3 && t.step3Title}
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          {currentPage === 1 && t.step1Subtitle}
          {currentPage === 2 && t.step2Subtitle}
          {currentPage === 3 && t.step3Subtitle}
        </p>
      </div>

      {/* Clean Multi-Page Progress Indicator */}
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold mb-2">
          <div
            className={`py-1.5 px-2 rounded-lg border transition-all ${
              currentPage === 1
                ? "bg-emerald-800 text-white border-emerald-800 shadow-xs"
                : currentPage > 1
                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
          >
            <span>1. Account</span>
          </div>

          <div
            className={`py-1.5 px-2 rounded-lg border transition-all ${
              currentPage === 2
                ? "bg-emerald-800 text-white border-emerald-800 shadow-xs"
                : currentPage > 2
                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
          >
            <span>2. GPS & Soil</span>
          </div>

          <div
            className={`py-1.5 px-2 rounded-lg border transition-all ${
              currentPage === 3
                ? "bg-emerald-800 text-white border-emerald-800 shadow-xs"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
          >
            <span>3. Crop & Land</span>
          </div>
        </div>

        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-700 transition-all duration-300"
            style={{ width: `${(currentPage / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Global Server Error Notice */}
      {serverError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800"
        >
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span className="font-medium">{serverError}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 1: FARMER ACCOUNT DETAILS */}
      {/* ========================================================================= */}
      {currentPage === 1 && (
        <div className="space-y-4 text-left animate-in fade-in duration-200">
          {/* Farmer Full Name */}
          <div className="space-y-1">
            <label htmlFor="reg-name" className="block text-xs font-bold text-slate-800">
              {t.nameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-name"
              type="text"
              required
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15"
            />
            {errors.name && (
              <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Mobile Number with +91 Country Badge */}
          <div className="space-y-1">
            <label htmlFor="reg-mobile" className="block text-xs font-bold text-slate-800">
              {t.mobileLabel} <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-xl border border-slate-300 bg-white focus-within:border-emerald-700 focus-within:ring-3 focus-within:ring-emerald-700/15 overflow-hidden">
              <div className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-2.5 border-r border-slate-200 text-slate-700 select-none">
                <span className="text-sm">🇮🇳</span>
                <span className="text-xs font-bold font-mono">+91</span>
              </div>
              <input
                id="reg-mobile"
                type="tel"
                inputMode="numeric"
                required
                maxLength={10}
                placeholder={t.mobilePlaceholder}
                value={mobile}
                onChange={handleMobileChange}
                className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none bg-transparent"
              />
            </div>
            {errors.mobile && (
              <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.mobile}</span>
              </p>
            )}
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="reg-password" className="block text-xs font-bold text-slate-800">
                {t.passwordLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-white focus-within:border-emerald-700 focus-within:ring-3 focus-within:ring-emerald-700/15 overflow-hidden">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="reg-confirm-password" className="block text-xs font-bold text-slate-800">
                {t.confirmPasswordLabel} <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-confirm-password"
                type="password"
                required
                placeholder={t.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15"
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={goToNextPage}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 text-sm transition-all shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-700/30"
            >
              <span>{t.btnNext}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: GPS TELEMETRY & AUTOMATIC SOIL IDENTIFICATION */}
      {/* ========================================================================= */}
      {currentPage === 2 && (
        <div className="space-y-5 text-left animate-in fade-in duration-200">
          {/* Main GPS Permission Action Card */}
          <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/80 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-800 text-white shrink-0 mt-0.5">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {latitude && longitude
                      ? "✓ GPS Location & Soil Telemetry Captured"
                      : "Detect Farm Location via GPS"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    We use your device's GPS to bind satellite observations and automatically determine your farm's soil profile.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={requestGpsLocation}
                disabled={isLocating}
                className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Detecting...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{latitude ? "Re-detect GPS" : t.gpsBtn}</span>
                  </>
                )}
              </button>
            </div>

            {/* In-Flight Detecting State */}
            {isLocating && (
              <div className="p-3 bg-white/80 rounded-lg border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-medium animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
                <span>{t.gpsDetecting}</span>
              </div>
            )}

            {/* Permission Denied Message */}
            {gpsStatus === "denied" && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
                  <span>{t.gpsDenied}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => applyCoordinates(26.9124, 75.7873, 25)}
                    className="px-2.5 py-1 bg-amber-200/70 hover:bg-amber-200 text-amber-950 font-bold rounded text-[11px] transition-colors"
                  >
                    📍 Use Default National Agro-Grid Coordinates (26.91°N, 75.78°E)
                  </button>
                </div>
              </div>
            )}

            {/* Live GPS Coordinates Display */}
            {latitude && longitude && (
              <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-900">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Latitude: {latitude.toFixed(5)}° N</span>
                    <span className="text-slate-300">|</span>
                    <span>Longitude: {longitude.toFixed(5)}° E</span>
                  </div>
                  {gpsAccuracy && (
                    <span className="text-[10px] text-slate-500 font-medium">
                      (GPS Accuracy: ±{Math.round(gpsAccuracy)}m)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {errors.gps && (
            <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.gps}</span>
            </p>
          )}

          {/* AUTOMATICALLY INFERRED REGION & SOIL CARDS */}
          {detectedSoil && detectedRegion && (
            <div className="space-y-3 animate-in fade-in duration-300">
              {/* Automated Region */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  {t.autoRegionLabel}
                </span>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span className="text-sm font-bold text-slate-900">{detectedRegion.region}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium pl-6">
                  Agro-Climatic Zone: {detectedRegion.agroZone}
                </p>
              </div>

              {/* Automated Soil Profile */}
              <div className="p-4 rounded-xl border-2 border-emerald-600/30 bg-emerald-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-700" />
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      {t.autoSoilLabel}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300/60">
                    <Sparkles className="h-3 w-3" /> Auto-Identified
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {language === "hi" ? detectedSoil.soilNameHi : detectedSoil.soilNameEn}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {language === "hi" ? detectedSoil.descriptionHi : detectedSoil.descriptionEn}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/70 text-[11px] text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Natural Drainage</span>
                    <span className="font-semibold text-slate-800">{detectedSoil.drainage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Organic Matter</span>
                    <span className="font-semibold text-slate-800">{detectedSoil.organicMatter}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goToPrevPage}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t.btnBack}</span>
            </button>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={!latitude || !longitude}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-700/30"
            >
              <span>{t.btnNext}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 3: CROP & LAND DETAILS */}
      {/* ========================================================================= */}
      {currentPage === 3 && (
        <form onSubmit={handleFinalSubmit} noValidate className="space-y-5 text-left animate-in fade-in duration-200">
          {/* Farm Land Size in Acres */}
          <div className="space-y-1">
            <label htmlFor="reg-area" className="block text-xs font-bold text-slate-800">
              {t.areaLabel} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="reg-area"
                type="number"
                step="0.1"
                min="0.1"
                required
                placeholder={t.areaPlaceholder}
                value={areaAcres}
                onChange={(e) => {
                  setAreaAcres(e.target.value);
                  if (errors.areaAcres) setErrors((prev) => ({ ...prev, areaAcres: "" }));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15"
              />
              <span className="text-xs font-bold text-slate-600 bg-slate-200/80 px-3 py-2.5 rounded-xl select-none">
                Acres
              </span>
            </div>

            {/* Quick selector buttons */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500">Quick set:</span>
              {["2.0", "4.5", "8.0", "15.0"].map((ac) => (
                <button
                  key={ac}
                  type="button"
                  onClick={() => {
                    setAreaAcres(ac);
                    if (errors.areaAcres) setErrors((prev) => ({ ...prev, areaAcres: "" }));
                  }}
                  className={`px-2 py-0.5 text-xs rounded-md border font-medium transition-colors ${
                    areaAcres === ac
                      ? "bg-emerald-800 text-white border-emerald-800"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {ac} Ac
                </button>
              ))}
            </div>

            {errors.areaAcres && (
              <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.areaAcres}</span>
              </p>
            )}
          </div>

          {/* Primary Crop Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                {t.cropLabel} <span className="text-red-500">*</span>
              </label>
              {detectedSoil && (
                <span className="text-[10px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Suited for {detectedSoil.soilType}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRESET_CROPS.map((cr) => {
                const isSelected = !isCustomCropSelected && crop === cr.id;
                return (
                  <button
                    key={cr.id}
                    type="button"
                    onClick={() => {
                      setCrop(cr.id);
                      setIsCustomCropSelected(false);
                      if (errors.crop) setErrors((prev) => ({ ...prev, crop: "" }));
                    }}
                    className={`p-2 rounded-xl border text-left text-xs font-medium transition-all flex flex-col gap-1 items-start ${
                      isSelected
                        ? "bg-emerald-100/80 border-emerald-700 text-emerald-950 font-bold ring-2 ring-emerald-700/30 shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-base">{cr.emoji}</span>
                    <span className="line-clamp-1 leading-tight text-[11px]">
                      {language === "hi" ? cr.labelHi : cr.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Crop input */}
            <div className="pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomCropSelected(true);
                    if (customCrop.trim()) setCrop(customCrop.trim());
                    else setCrop("");
                  }}
                  className={`px-3 py-2 text-xs rounded-xl border font-bold shrink-0 transition-colors ${
                    isCustomCropSelected
                      ? "bg-emerald-800 text-white border-emerald-800"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {t.customCropBtn}
                </button>
                {isCustomCropSelected && (
                  <input
                    type="text"
                    required
                    placeholder={t.customCropPlaceholder}
                    value={customCrop}
                    onChange={(e) => {
                      setCustomCrop(e.target.value);
                      setCrop(e.target.value);
                      if (errors.crop) setErrors((prev) => ({ ...prev, crop: "" }));
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-700 bg-white font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                  />
                )}
              </div>
            </div>

            {errors.crop && (
              <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.crop}</span>
              </p>
            )}
          </div>

          {/* Irrigation Method */}
          <div className="space-y-1">
            <label htmlFor="reg-irrigation" className="block text-xs font-bold text-slate-800">
              {t.irrigationLabel}
            </label>
            <select
              id="reg-irrigation"
              value={irrigationType}
              onChange={(e) => setIrrigationType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 bg-white"
            >
              {IRRIGATION_TYPES.map((ir) => (
                <option key={ir.id} value={ir.id}>
                  {language === "hi" ? ir.labelHi : ir.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Action Buttons */}
          <div className="pt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goToPrevPage}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t.btnBack}</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-700/30 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>{t.submitting}</span>
                </>
              ) : (
                <>
                  <span>{t.btnSubmit}</span>
                  <Check className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Link to Login */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600 font-medium">
          {t.alreadyRegistered}{" "}
          <Link
            href="/login"
            className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline transition-colors ml-1"
          >
            {t.signInLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
