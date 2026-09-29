"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DEMO_DISEASE_DIAGNOSIS, DEMO_FARM } from "@/lib/mock-data";
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
} from "lucide-react";

export default function DiseaseDiagnosisPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<typeof DEMO_DISEASE_DIAGNOSIS | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSimulateDiagnosis = () => {
    setAnalyzing(true);
    setImagePreview("simulated-leaf");
    setTimeout(() => {
      setAnalyzing(false);
      setDiagnosis(DEMO_DISEASE_DIAGNOSIS);
    }, 1500);
  };

  const handleReset = () => {
    setDiagnosis(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              Module 7
            </span>
            <span className="text-xs text-slate-400">Computer Vision Pathology</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ScanEye className="h-6 w-6 text-emerald-400" />
            Computer Vision Crop Disease Diagnosis
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Upload leaf or crop imagery for automated deep-learning pathology detection, severity classification, and prescriptive treatment protocols.
          </p>
        </div>

        {/* Upload Dropzone / Trigger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="h-4 w-4 text-emerald-400" />
                Upload Field Sample Image
              </h3>

              <div
                onClick={handleSimulateDiagnosis}
                className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-8 text-center transition-all bg-slate-900/40 hover:bg-slate-900/80 group"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-slate-200">
                  Drop leaf image here, or click to browse
                </h4>
                <p className="mt-1 text-xs text-slate-400">
                  Supported formats: JPG, PNG, WEBP (Max 10MB)
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Load Sample: Wheat Leaf Rust
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Tip: Capture close-up, well-lit photos of individual affected leaves displaying pustules, lesions, or chlorosis for highest diagnostic confidence.
                </span>
              </div>
            </div>
          </div>

          {/* Diagnosis Results Stage */}
          <div className="lg:col-span-7">
            {analyzing ? (
              <div className="glass-panel rounded-2xl p-12 border border-slate-800 text-center space-y-4 flex flex-col items-center justify-center h-full min-h-[380px]">
                <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
                <h4 className="text-base font-bold text-white">Running Vision Model Inference...</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Segmenting leaf surface, analyzing chromatic lesions, and querying BRICS crop pathology dataset.
                </p>
              </div>
            ) : diagnosis ? (
              <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-amber-500/30 bg-gradient-to-b from-slate-900/90 to-amber-950/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                      Diagnostic Output
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5 flex items-center gap-2">
                      {diagnosis.diseaseName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                      {(diagnosis.confidence * 100).toFixed(0)}% Confidence
                    </span>
                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                      {diagnosis.severity} Severity
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400">Clinical Symptomology:</h4>
                  <p className="mt-1 text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    {diagnosis.symptoms}
                  </p>
                </div>

                {/* Treatment Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> Recommended Remediation Protocol
                  </h4>
                  <div className="space-y-2">
                    {diagnosis.treatments.map((t, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-emerald-500/20 bg-emerald-950/15 p-3 text-xs text-slate-200 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preventive Cultural Practices */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-400" /> Preventive Cultural Controls
                  </h4>
                  <div className="space-y-2">
                    {diagnosis.preventiveMeasures.map((p, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300 flex items-start gap-2.5"
                      >
                        <span className="text-slate-500 font-bold">•</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleReset}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Diagnose Another Sample →
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-12 border border-slate-800 text-center space-y-3 flex flex-col items-center justify-center h-full min-h-[380px]">
                <ScanEye className="h-10 w-10 text-slate-600" />
                <h4 className="text-sm font-semibold text-slate-300">No Image Uploaded Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Click the upload dropzone to run inference with the leaf pathology vision model.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
