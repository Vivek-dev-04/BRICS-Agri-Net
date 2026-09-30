"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useFarm } from "@/context/FarmContext";
import { DiseaseDiagnosisResult } from "@/lib/services/diseaseService";
import {
  ScanEye,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Camera,
  Info,
  Volume2,
  VolumeX,
  Printer,
  Leaf,
  FlaskConical,
  ArrowLeft,
  X,
  Layers,
  Bot,
  Cpu,
} from "lucide-react";

export default function DiseaseDiagnosisPage() {
  const { farm, farms, switchFarm } = useFarm();
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiseaseDiagnosisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [language, setLanguage] = useState("English");
  const [viewMode, setViewMode] = useState<"farmer" | "technical">("farmer");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/disease")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHasGeminiKey(Boolean(data.hasGeminiKey));
        }
      })
      .catch((err) => console.warn("Failed to check vision engine status:", err));
  }, []);

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
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.diagnosis) {
        setDiagnosis(data.diagnosis);
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

    const langMap: Record<string, string> = {
      English: "en-US",
      Hindi: "hi-IN",
      Portuguese: "pt-BR",
      Russian: "ru-RU",
      Chinese: "zh-CN",
    };
    if (langMap[language]) {
      utterance.lang = langMap[language];
    }

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/dashboard" className="text-emerald-400 hover:underline">
              ← Farm Dashboard
            </Link>
            <span>/</span>
            <span>{farm.name}</span>
            <span>/</span>
            <span className="text-white font-semibold">AI Crop Disease Vision Diagnostic</span>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("farmer")}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === "farmer"
                  ? "bg-emerald-500 text-slate-950 font-extrabold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              👨‍🌾 Farmer View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("technical")}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === "technical"
                  ? "bg-emerald-500 text-slate-950 font-extrabold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🔬 Agronomist Data
            </button>
          </div>
        </div>

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                Module 7
              </span>
              <span className="text-xs text-slate-400">Multimodal AI Computer Vision Pathology</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <ScanEye className="h-7 w-7 text-emerald-400" />
              Leaf Disease Vision Diagnostic
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-400 max-w-2xl">
              {viewMode === "farmer"
                ? `Take a photo of any unhealthy leaves on ${farm.name}. Our AI instantly detects the disease and tells you the organic remedy and chemical dosage.`
                : "Multimodal Gemini 2.5 Flash Vision diagnostic pipeline cross-referencing chromatic lesions against BRICS crop pathology datasets."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
            >
              <option value="English">Language: English</option>
              <option value="Hindi">भाषा: हिन्दी (Hindi)</option>
              <option value="Portuguese">Idioma: Português</option>
              <option value="Russian">Язык: Русский</option>
              <option value="Chinese">语言: 中文 (Chinese)</option>
            </select>

            {diagnosis && (
              <>
                <button
                  onClick={toggleSpeech}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all border ${
                    isSpeaking
                      ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse"
                      : "bg-slate-900 text-emerald-300 border-emerald-500/40 hover:bg-slate-800"
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5" />
                      <span>Stop Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>🔊 Listen Aloud</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
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
            <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
              <Layers className="h-3.5 w-3.5 text-emerald-400" /> Active Farm Parcel:
            </span>
            {farms.map((f) => (
              <button
                key={f.id}
                onClick={() => switchFarm(f.id)}
                className={`px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                  f.id === farm.id
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                {f.name} ({f.crop})
              </button>
            ))}
          </div>
        )}

        {/* Engine Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
          <div className="flex items-center gap-2">
            {hasGeminiKey ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                <Bot className="h-3.5 w-3.5" /> Google Gemini 2.5 Flash Multimodal Vision Active
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-teal-300 font-bold bg-teal-500/10 px-2.5 py-0.5 rounded-md border border-teal-500/30">
                <Cpu className="h-3.5 w-3.5" /> Calibrated BRICS Plant Pathology Database Active
              </span>
            )}
            <span className="text-slate-400">
              Target Crop: <strong className="text-white">{farm.crop} ({farm.cropVariety})</strong>
            </span>
          </div>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
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
            <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="h-4 w-4 text-emerald-400" />
                Upload or Snap Leaf Photo
              </h3>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-6 text-center transition-all bg-slate-900/40 hover:bg-slate-900/80 group relative overflow-hidden"
              >
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Leaf Preview"
                      className="mx-auto max-h-48 rounded-lg object-contain border border-slate-700 shadow-md"
                    />
                    <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Photo Loaded • Tap to change
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <h4 className="mt-2 text-sm font-semibold text-slate-200">
                      Tap to Choose Photo from Device
                    </h4>
                    <p className="mt-1 text-xs text-slate-400">
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
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 text-xs font-bold transition-colors shadow-sm"
                >
                  <Camera className="h-4 w-4" />
                  <span>Take Photo with Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 py-2.5 text-xs font-semibold transition-colors"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Browse Gallery</span>
                </button>
              </div>

              {/* Quick Sample Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Or Test with Sample Leaf Profiles:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectSample("wheat-rust")}
                    className={`p-2.5 rounded-lg text-left text-xs border transition-all ${
                      selectedSample === "wheat-rust"
                        ? "bg-amber-500/20 border-amber-500/60 text-amber-200 font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="block font-semibold">🌾 Wheat Leaf Rust</span>
                    <span className="text-[10px] text-slate-400">Puccinia triticina</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSample("rice-blast")}
                    className={`p-2.5 rounded-lg text-left text-xs border transition-all ${
                      selectedSample === "rice-blast"
                        ? "bg-red-500/20 border-red-500/60 text-red-200 font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="block font-semibold">🌾 Rice Blast</span>
                    <span className="text-[10px] text-slate-400">Magnaporthe oryzae</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSample("cotton-curl")}
                    className={`p-2.5 rounded-lg text-left text-xs border transition-all ${
                      selectedSample === "cotton-curl"
                        ? "bg-amber-500/20 border-amber-500/60 text-amber-200 font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="block font-semibold">🌿 Cotton Leaf Curl</span>
                    <span className="text-[10px] text-slate-400">Begomovirus (Whitefly)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSample("healthy-leaf")}
                    className={`p-2.5 rounded-lg text-left text-xs border transition-all ${
                      selectedSample === "healthy-leaf"
                        ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="block font-semibold">🟢 Healthy Wheat Leaf</span>
                    <span className="text-[10px] text-slate-400">Zero Lesions</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Tip for farmers: Hold your phone 10-15 cm away in daylight so leaf spots and vein patterns are sharp and clear.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Diagnostic Output Stage */}
          <div className="lg:col-span-7">
            {analyzing ? (
              <div className="glass-panel rounded-2xl p-12 border border-emerald-500/30 text-center space-y-4 flex flex-col items-center justify-center h-full min-h-[380px]">
                <RefreshCw className="h-10 w-10 text-emerald-400 animate-spin" />
                <h4 className="text-lg font-bold text-white">Running Vision Model Inference...</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Segmenting leaf surface, analyzing chromatic pustules, and evaluating pathology against BRICS plant protection protocols.
                </p>
              </div>
            ) : diagnosis ? (
              <div
                className={`glass-panel rounded-2xl p-6 sm:p-7 border space-y-5 transition-all ${
                  diagnosis.isHealthy
                    ? "border-emerald-500/30 bg-gradient-to-b from-slate-900/90 to-emerald-950/20"
                    : diagnosis.severity === "Critical" || diagnosis.severity === "High"
                    ? "border-red-500/40 bg-gradient-to-b from-slate-900/90 to-red-950/15"
                    : "border-amber-500/40 bg-gradient-to-b from-slate-900/90 to-amber-950/15"
                }`}
              >
                {/* Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      {diagnosis.crop} Diagnostic Assessment
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 flex items-center gap-2">
                      {diagnosis.diseaseName}
                    </h3>
                    {diagnosis.scientificName && viewMode === "technical" && (
                      <p className="text-xs text-slate-400 italic">Scientific: {diagnosis.scientificName}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                      {(diagnosis.confidence * 100).toFixed(0)}% Match
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold border ${
                        diagnosis.isHealthy
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : diagnosis.severity === "High" || diagnosis.severity === "Critical"
                          ? "bg-red-500/20 text-red-300 border border-red-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {diagnosis.severity} Severity
                    </span>
                  </div>
                </div>

                {/* Visible Symptoms */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-300">🔍 Visible Symptoms on Leaf:</h4>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                    {diagnosis.symptoms}
                  </p>
                </div>

                {/* Treatment Grid: Organic vs Chemical */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Organic Remedy */}
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <Leaf className="h-4 w-4 text-emerald-400" />
                        🌿 Low-Cost Organic Remedy
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Eco-Friendly
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                      {diagnosis.organicRemedy}
                    </p>
                  </div>

                  {/* Chemical Remedy */}
                  <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <FlaskConical className="h-4 w-4 text-amber-400" />
                        🧪 Agronomic Field Chemical
                      </span>
                      <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Standard Dosage
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                      {diagnosis.chemicalRemedy}
                    </p>
                  </div>
                </div>

                {/* Recommended Remediation Protocol */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> Immediate Field Action Steps
                  </h4>
                  <div className="space-y-2">
                    {diagnosis.treatments.map((t, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-emerald-500/20 bg-emerald-950/15 p-3 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preventive Cultural Controls */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-400" /> Preventive Field Practices
                  </h4>
                  <div className="space-y-2">
                    {diagnosis.preventiveMeasures.map((p, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-xs text-slate-300 flex items-start gap-2.5"
                      >
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Engine: {diagnosis.engine}
                  </span>
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Scan Another Leaf Sample →
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-12 border border-slate-800 text-center space-y-3 flex flex-col items-center justify-center h-full min-h-[380px]">
                <ScanEye className="h-12 w-12 text-slate-600" />
                <h4 className="text-base font-semibold text-slate-200">No Leaf Image Uploaded Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Take a photo with your mobile camera or click one of the sample leaf profiles on the left to see the AI diagnostic in action.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
