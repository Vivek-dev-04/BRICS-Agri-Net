"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useFarm } from "@/context/FarmContext";
import { useLanguage } from "@/context/LanguageContext";
import { BricsLanguage, getLlmLanguageName } from "@/lib/i18n/languages";
import {
  DiseaseDiagnosisResult,
  BRICS_PATHOLOGY_SAMPLES,
  BRICS_SURVEILLANCE_ALERTS,
} from "@/lib/services/diseaseService";
import { localDb, StoredDiseaseRecord } from "@/lib/db/localStorageDb";
import {
  ScanEye,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Camera,
  Info,
  Volume2,
  VolumeX,
  Printer,
  Leaf,
  FlaskConical,
  Layers,
  Bot,
  Cpu,
  Calculator,
  History,
  Radio,
  Clock,
  Trash2,
} from "lucide-react";

export default function DiseaseDiagnosisPage() {
  const { farm, farms, switchFarm } = useFarm();
  const { language, setLanguage, t, localeInfo } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiseaseDiagnosisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"farmer" | "technical">("farmer");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  // Field Scouting History
  const [history, setHistory] = useState<StoredDiseaseRecord[]>([]);

  // Application Dosage Calculator
  const [sprayAcreage, setSprayAcreage] = useState<number>(farm.areaAcres || 4.5);
  const [sprayerType, setSprayerType] = useState<"knapsack" | "tractor" | "drone">("knapsack");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const loadHistory = useCallback(() => {
    const records = localDb.getDiseaseRecords(farm.id);
    setHistory(records);
  }, [farm.id]);

  useEffect(() => {
    fetch("/api/disease")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHasGeminiKey(Boolean(data.hasGeminiKey));
        }
      })
      .catch((err) => console.warn("Failed to check vision engine status:", err));

    loadHistory();
  }, [loadHistory]);

  // Keep spray acreage in sync when switching farms
  useEffect(() => {
    if (farm.areaAcres) {
      setSprayAcreage(farm.areaAcres);
    }
  }, [farm.areaAcres]);

  // Handle Real File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setSelectedSample(null);
      runDiagnosis({ image: base64 });
    };
    reader.readAsDataURL(file);
  };

  // Run Diagnosis via API
  const runDiagnosis = async (payload: { image?: string; sampleId?: string }) => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          crop: farm.crop,
          variety: farm.cropVariety,
          language: getLlmLanguageName(language),
        }),
      });

      const data = await res.json();
      if (data.success && data.diagnosis) {
        const diag: DiseaseDiagnosisResult = data.diagnosis;
        setDiagnosis(diag);

        // Persist to local database
        const recordId = `diag-${Date.now().toString().slice(-6)}`;
        localDb.saveDiseaseRecord({
          id: recordId,
          farmId: farm.id,
          crop: diag.crop || farm.crop,
          diseaseName: diag.diseaseName,
          scientificName: diag.scientificName,
          severity: diag.severity,
          confidence: diag.confidence,
          isHealthy: diag.isHealthy,
          symptoms: diag.symptoms,
          organicRemedy: diag.organicRemedy,
          chemicalRemedy: diag.chemicalRemedy,
          engine: diag.engine,
          diagnosedAt: diag.diagnosedAt || new Date().toISOString(),
          status: "Under Observation",
        });

        loadHistory();
      }
    } catch (err) {
      console.error("Diagnosis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Handle Quick Sample Selection
  const handleSelectSample = (sampleId: string) => {
    setSelectedSample(sampleId);
    setImagePreview(null);
    runDiagnosis({ sampleId });
  };

  // Handle Status Change on Historical Scans
  const handleStatusChange = (id: string, newStatus: StoredDiseaseRecord["status"]) => {
    localDb.updateDiseaseRecordStatus(id, newStatus);
    loadHistory();
  };

  // Handle Delete Record
  const handleDeleteRecord = (id: string) => {
    localDb.deleteDiseaseRecord(id);
    loadHistory();
  };

  // Load Past Scan into Active View
  const handleViewHistoricalScan = (rec: StoredDiseaseRecord) => {
    setDiagnosis({
      diseaseName: rec.diseaseName,
      scientificName: rec.scientificName,
      crop: rec.crop,
      confidence: rec.confidence,
      severity: rec.severity,
      isHealthy: rec.isHealthy,
      symptoms: rec.symptoms,
      organicRemedy: rec.organicRemedy,
      chemicalRemedy: rec.chemicalRemedy,
      treatments: [rec.organicRemedy, rec.chemicalRemedy],
      preventiveMeasures: [
        "Maintain crop spacing and balanced irrigation",
        "Monitor for recurring spore germination following rain events",
      ],
      engine: rec.engine,
      diagnosedAt: rec.diagnosedAt,
    });
    setImagePreview(null);
    setSelectedSample(null);
  };

  // Reset
  const handleReset = () => {
    setDiagnosis(null);
    setImagePreview(null);
    setSelectedSample(null);
    if (isSpeaking && typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Audio Readout for Farmers
  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!diagnosis) return;

    const textToSpeak = `Crop disease diagnosis for ${diagnosis.crop}. 
      Detected condition: ${diagnosis.diseaseName}. 
      Severity: ${diagnosis.severity}. 
      Symptoms: ${diagnosis.symptoms}. 
      Organic treatment: ${diagnosis.organicRemedy}. 
      Chemical treatment: ${diagnosis.chemicalRemedy}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92;
    utterance.lang = localeInfo.speechLocale;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Calculations for Dosage Helper
  const waterRatePerAcre = sprayerType === "drone" ? 30 : sprayerType === "tractor" ? 250 : 180;
  const totalWaterLitres = Math.round(sprayAcreage * waterRatePerAcre);
  const knapsackTanks = Math.ceil(totalWaterLitres / 15);

  // Parse approximate chemical rate (defaulting to 1ml/L or 2g/L)
  const isGramUnit = diagnosis?.chemicalRemedy.includes("g/L") || diagnosis?.chemicalRemedy.includes("g per liter");
  const chemicalMultiplier = isGramUnit ? 2 : 1;
  const totalChemicalQty = Math.round(totalWaterLitres * chemicalMultiplier);
  const organicBioQty = Math.round(totalWaterLitres * 0.05); // 5% extract

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/farms" className="text-emerald-800 font-semibold hover:underline">
              ← Farm Dashboard
            </Link>
            <span>/</span>
            <span>{farm.name}</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">AI Crop Disease Vision Diagnostic</span>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 text-xs font-bold shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("farmer")}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === "farmer"
                  ? "bg-emerald-800 text-white font-extrabold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Farmer View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("technical")}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === "technical"
                  ? "bg-emerald-800 text-white font-extrabold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Agronomist Data
            </button>
          </div>
        </div>

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-900 border border-emerald-300">
                Module 7
              </span>
              <span className="text-xs text-slate-500 font-medium">Multimodal AI Computer Vision Pathology</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
              <ScanEye className="h-7 w-7 text-emerald-800" />
              Leaf Disease Vision Diagnostic
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
              {viewMode === "farmer"
                ? `Take a photo of any unhealthy leaves on ${farm.name}. Our AI instantly detects the disease, calculates required field spray dosages, and prescribes eco-friendly organic remedies.`
                : "Multimodal Gemini 2.5 Flash Vision diagnostic pipeline cross-referencing chromatic lesions and leaf enations against calibrated BRICS plant pathology protocols."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as BricsLanguage)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-800 font-semibold shadow-xs"
            >
              <option value="en">[EN] English</option>
              <option value="hi">[HI] हिन्दी (Hindi)</option>
              <option value="pt">[PT] Português</option>
              <option value="ru">[RU] Русский</option>
              <option value="zh">[ZH] 中文 (Chinese)</option>
            </select>

            {diagnosis && (
              <>
                <button
                  onClick={toggleSpeech}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all border shadow-xs ${
                    isSpeaking
                      ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                      : "bg-white text-emerald-800 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5" />
                      <span>{t.advisory.stopAudio}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>{t.advisory.listenAloud}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Slip</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Farm Selector Strip (if user has multiple farms) */}
        {farms.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-semibold flex items-center gap-1 shrink-0">
              <Layers className="h-3.5 w-3.5 text-emerald-800" /> Active Farm Parcel:
            </span>
            {farms.map((f) => (
              <button
                key={f.id}
                onClick={() => switchFarm(f.id)}
                className={`px-3 py-1 rounded-full border transition-all whitespace-nowrap shadow-xs ${
                  f.id === farm.id
                    ? "bg-emerald-800 text-white border-emerald-800 font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:text-slate-900"
                }`}
              >
                {f.name} ({f.crop})
              </button>
            ))}
          </div>
        )}

        {/* Engine Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white text-xs shadow-xs">
          <div className="flex items-center gap-2">
            {hasGeminiKey ? (
              <span className="flex items-center gap-1.5 text-emerald-900 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                <Bot className="h-3.5 w-3.5 text-emerald-800" /> Google Gemini 2.5 Flash Multimodal Vision Active
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-900 font-bold bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-300">
                <Cpu className="h-3.5 w-3.5 text-slate-700" /> Calibrated BRICS Plant Pathology Database Active
              </span>
            )}
            <span className="text-slate-600">
              Target Crop: <strong className="text-slate-900">{farm.crop} ({farm.cropVariety})</strong>
            </span>
          </div>
          <span className="text-slate-500 text-[11px] hidden sm:inline">
            Zero-shot lesion & chlorosis detection
          </span>
        </div>

        {/* Hidden File Inputs for Camera & File Picker */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
          className="hidden"
        />

        {/* Main Diagnostic Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Upload & Quick Samples */}
          <div className="lg:col-span-5 space-y-4">
            <div className="gov-card rounded-2xl p-5 sm:p-6 border border-slate-200 bg-white space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="h-4 w-4 text-emerald-800" />
                Upload or Snap Leaf Photo
              </h3>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-6 text-center transition-all bg-slate-50 hover:bg-slate-100/70 group relative overflow-hidden"
              >
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Leaf Preview"
                      className="mx-auto max-h-48 rounded-lg object-contain border border-slate-300 shadow-md"
                    />
                    <p className="text-xs text-emerald-800 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> Photo Loaded • Tap to change
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 group-hover:scale-105 transition-transform">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <h4 className="mt-2 text-sm font-semibold text-slate-800">
                      Tap to Choose Photo from Device
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      JPG, PNG, WEBP (Max 10MB)
                    </p>
                  </>
                )}
              </div>

              {/* Mobile Camera Trigger Button */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold transition-colors shadow-xs"
                >
                  <Camera className="h-4 w-4" />
                  <span>Take Photo with Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 py-2.5 text-xs font-bold transition-colors shadow-xs"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Browse Gallery</span>
                </button>
              </div>

              {/* Quick Sample Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Or Test with Calibrated BRICS Pathogen Samples:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {BRICS_PATHOLOGY_SAMPLES.map((sample) => {
                    const isSelected = selectedSample === sample.id;
                    const isHealthy = sample.id === "healthy-leaf";
                    const isCritical = sample.risk === "Critical";
                    const isHigh = sample.risk === "High";

                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectSample(sample.id)}
                        className={`p-2.5 rounded-lg text-left text-xs border transition-all ${
                          isSelected
                            ? isHealthy
                              ? "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20"
                              : isCritical || isHigh
                              ? "bg-red-100 border-red-500 text-red-950 font-bold ring-2 ring-red-500/20"
                              : "bg-amber-100 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-500/20"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold block truncate">{sample.name}</span>
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${
                              isHealthy ? "bg-emerald-600" : isCritical || isHigh ? "bg-red-600" : "bg-amber-600"
                            }`}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {sample.pathogen}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <Info className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
                <span>
                  Tip for farmers: Hold phone 10-15 cm away in daylight so leaf spot margins and vein patterns are sharp.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Diagnostic Output Stage */}
          <div className="lg:col-span-7 space-y-5">
            {analyzing ? (
              <div className="gov-card rounded-2xl p-12 border border-emerald-300 bg-white text-center space-y-4 flex flex-col items-center justify-center h-full min-h-[380px] shadow-sm">
                <RefreshCw className="h-10 w-10 text-emerald-800 animate-spin" />
                <h4 className="text-lg font-bold text-slate-900">Running Vision Model Inference...</h4>
                <p className="text-xs text-slate-600 max-w-sm">
                  Segmenting leaf surface, analyzing chromatic pustules, and evaluating pathology against BRICS plant protection protocols.
                </p>
              </div>
            ) : diagnosis ? (
              <div className="gov-card rounded-2xl p-6 sm:p-7 border border-slate-200 bg-white space-y-5 shadow-sm">
                {/* Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      {diagnosis.crop} Diagnostic Assessment
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
                      {diagnosis.diseaseName}
                    </h3>
                    {diagnosis.scientificName && viewMode === "technical" && (
                      <p className="text-xs text-slate-500 italic">Scientific: {diagnosis.scientificName}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-300">
                      {(diagnosis.confidence * 100).toFixed(0)}% Match
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold border ${
                        diagnosis.isHealthy
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : diagnosis.severity === "High" || diagnosis.severity === "Critical"
                          ? "bg-red-100 text-red-900 border border-red-300"
                          : "bg-amber-100 text-amber-900 border border-amber-300"
                      }`}
                    >
                      {diagnosis.severity} Severity
                    </span>
                  </div>
                </div>

                {/* Visible Symptoms */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">Visible Symptoms on Leaf:</h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    {diagnosis.symptoms}
                  </p>
                </div>

                {/* Treatment Grid: Organic vs Chemical */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Organic Remedy */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <Leaf className="h-4 w-4 text-emerald-800" />
                        Organic Biological Remedy
                      </span>
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                        Eco-Friendly
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      {diagnosis.organicRemedy}
                    </p>
                  </div>

                  {/* Chemical Remedy */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <FlaskConical className="h-4 w-4 text-amber-800" />
                        Agronomic Chemical Protocol
                      </span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300">
                        Standard Dosage
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      {diagnosis.chemicalRemedy}
                    </p>
                  </div>
                </div>

                {/* Immediate Field Action Steps */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-800" /> Immediate Field Action Steps
                  </h4>
                  <div className="space-y-2">
                    {diagnosis.treatments.map((t, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preventive Cultural Controls */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" /> Preventive Cultural Controls
                  </h4>
                  <div className="space-y-2">
                    {diagnosis.preventiveMeasures.map((p, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 flex items-start gap-2.5"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Dosage Calculator */}
                {!diagnosis.isHealthy && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Calculator className="h-4 w-4 text-emerald-800" />
                        Field Application Dosage Calculator
                      </h4>
                      <span className="text-[11px] text-slate-600">
                        Acreage: <strong className="text-slate-900">{sprayAcreage} acres</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Sprayer Type Selector */}
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1 font-semibold">Spraying Method</label>
                        <select
                          value={sprayerType}
                          onChange={(e) => setSprayerType(e.target.value as any)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-xs"
                        >
                          <option value="knapsack">15L Knapsack Sprayer</option>
                          <option value="tractor">Tractor Boom Sprayer</option>
                          <option value="drone">Precision Agri-Drone</option>
                        </select>
                      </div>

                      {/* Land Acreage Input */}
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1 font-semibold">Parcel Acreage</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="100"
                          value={sprayAcreage}
                          onChange={(e) => setSprayAcreage(parseFloat(e.target.value) || 1)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-xs"
                        />
                      </div>

                      {/* Total Water Computed */}
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1 font-semibold">Total Water Required</label>
                        <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-emerald-800">
                          {totalWaterLitres} Liters ({knapsackTanks} tank refills)
                        </div>
                      </div>
                    </div>

                    {/* Computed Dosages */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200 text-xs">
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                        <span className="text-[10px] uppercase font-bold text-amber-900 block">Chemical Requirement:</span>
                        <span className="text-slate-900 font-bold text-sm">
                          {totalChemicalQty} {isGramUnit ? "grams" : "ml"}
                        </span>
                        <span className="text-slate-600 text-[11px] block mt-0.5">
                          Mix ~{(totalChemicalQty / knapsackTanks).toFixed(1)} {isGramUnit ? "g" : "ml"} per 15L tank
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] uppercase font-bold text-emerald-900 block">Organic Bio-Extract:</span>
                        <span className="text-slate-900 font-bold text-sm">
                          {organicBioQty} Liters (5% dilution)
                        </span>
                        <span className="text-slate-600 text-[11px] block mt-0.5">
                          Mix ~{(organicBioQty / knapsackTanks).toFixed(2)}L per 15L tank
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 italic">
                      Spray between 6:00 AM and 9:30 AM before wind speed exceeds 12 km/h. Always wear a protective respirator mask.
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Engine: {diagnosis.engine}
                  </span>
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-emerald-800 hover:underline transition-colors"
                  >
                    Scan Another Leaf Sample →
                  </button>
                </div>
              </div>
            ) : (
              <div className="gov-card rounded-2xl p-12 border border-slate-200 bg-white text-center space-y-3 flex flex-col items-center justify-center h-full min-h-[380px] shadow-xs">
                <ScanEye className="h-12 w-12 text-slate-400" />
                <h4 className="text-base font-semibold text-slate-800">No Leaf Image Uploaded Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Take a photo with your mobile camera or click one of the calibrated BRICS pathogen sample profiles on the left to see the AI diagnostic in action.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lower Row: Scouting History & BRICS Cross-Border Pathogen Surveillance Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          {/* Recent Field Scouting History (7 cols) */}
          <div className="lg:col-span-7 gov-card rounded-2xl p-5 border border-slate-200 bg-white space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="h-4 w-4 text-emerald-800" />
                Field Scouting & Diagnostic History ({farm.name})
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {history.length} {history.length === 1 ? "Record" : "Records"}
              </span>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No past leaf diagnostics recorded for this farm parcel yet. Run your first scan above.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {history.slice(0, 5).map((rec) => {
                  const isHealthy = rec.isHealthy;
                  const isHigh = rec.severity === "High" || rec.severity === "Critical";

                  return (
                    <div key={rec.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{rec.diseaseName}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                              isHealthy
                                ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                : isHigh
                                ? "bg-red-100 text-red-900 border border-red-300"
                                : "bg-amber-100 text-amber-900 border border-amber-300"
                            }`}
                          >
                            {rec.severity}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {new Date(rec.diagnosedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span>•</span>
                          <span>Match: {(rec.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Toggle */}
                        <select
                          value={rec.status}
                          onChange={(e) => handleStatusChange(rec.id, e.target.value as any)}
                          className={`rounded-md px-2 py-1 text-[11px] font-bold border bg-white ${
                            rec.status === "Resolved"
                              ? "text-emerald-900 border-emerald-300"
                              : rec.status === "Remedy Applied"
                              ? "text-blue-900 border-blue-300"
                              : "text-amber-900 border-amber-300"
                          }`}
                        >
                          <option value="Under Observation">Under Observation</option>
                          <option value="Remedy Applied">Remedy Applied</option>
                          <option value="Resolved">Resolved</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleViewHistoricalScan(rec)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-[11px] transition-colors"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteRecord(rec.id)}
                          title="Delete diagnostic record"
                          className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* BRICS Cross-Border Pathogen Surveillance Feed (5 cols) */}
          <div className="lg:col-span-5 gov-card rounded-2xl p-5 border border-slate-200 bg-white space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-800 animate-pulse" />
                BRICS Pathogen Surveillance Watch
              </h3>
              <span className="text-[10px] font-mono text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                Digital Public Good
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Coordinated cross-border epidemiological intelligence shared between BRICS member state agro-ministries.
            </p>

            <div className="space-y-3">
              {BRICS_SURVEILLANCE_ALERTS.map((alert) => {
                const isCritical = alert.riskLevel === "Critical";
                const isHigh = alert.riskLevel === "High";

                return (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400">
                          {alert.country}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{alert.countryName}</span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold border ${
                          isCritical || isHigh
                            ? "bg-red-100 text-red-900 border-red-300"
                            : "bg-amber-100 text-amber-900 border-amber-300"
                        }`}
                      >
                        {alert.riskLevel}
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 font-semibold">
                      {alert.pathogen} • <span className="text-slate-500">{alert.targetCrop}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {alert.advisoryNote}
                    </p>

                    <div className="text-[10px] text-slate-500 font-mono">
                      Zone: {alert.region}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
