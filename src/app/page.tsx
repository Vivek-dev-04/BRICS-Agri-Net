"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useFarm } from "@/context/FarmContext";
import {
  Sprout,
  ShieldCheck,
  CloudSun,
  Satellite,
  FlaskConical,
  Sparkles,
  Globe2,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { login } = useFarm();

  const handleDemoQuickLogin = () => {
    login("ram.singh@brics-agri.net");
    router.push("/farms");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {/* Official Hero Section */}
        <div className="text-center space-y-5 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-300 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Digital Public Good for Climate-Resilient Agriculture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Interoperable AI Platform for <br className="hidden sm:inline" />
            <span className="text-emerald-800">Sustainable & Resilient Agriculture</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            BRICS Agri-Net transforms farm observations, microclimate weather forecasts, and satellite vegetation indices into localized AI agro-advisories while facilitating standardized agricultural cooperation across BRICS nations.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              <span>Sign In / Register Farm</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={handleDemoQuickLogin}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-emerald-700" />
              <span>1-Click Evaluator Demo (Ram Singh)</span>
            </button>
          </div>
        </div>

        {/* Core Institutional Agricultural Capabilities */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Core Agricultural Intelligence Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Empowering small and marginal farmers with real-time, data-driven agricultural guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Farm Registry */}
            <div className="gov-card p-6 border border-slate-200 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <Sprout className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Land & Parcel Registry</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log parcel boundaries, crop varieties, sowing dates, and irrigation infrastructure to build a unified farm profile.
              </p>
            </div>

            {/* 2. Weather Warnings */}
            <div className="gov-card p-6 border border-slate-200 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                <CloudSun className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Agrometeorological Warnings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Localized 5-day predictive forecasts, rainfall probabilities, and early detection of water deficit and extreme weather risks.
              </p>
            </div>

            {/* 3. Satellite NDVI */}
            <div className="gov-card p-6 border border-slate-200 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <Satellite className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Satellite Canopy Monitoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sentinel-2 multispectral NDVI indices tracking crop vegetative health and identifying localized stress zones before visual wilting.
              </p>
            </div>

            {/* 4. Soil Health */}
            <div className="gov-card p-6 border border-slate-200 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                <FlaskConical className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Soil Health & Nutrients</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assess primary macronutrients (NPK), pH equilibrium, and soil organic carbon deficits with targeted supplementation plans.
              </p>
            </div>

            {/* 5. AI Agro-Advisory */}
            <div className="gov-card p-6 border border-slate-200 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Contextual AI Agro-Advisory</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-factor reasoning synthesizing soil tests, weather forecasts, and satellite NDVI into structured, actionable agronomic advice.
              </p>
            </div>

            {/* 6. BRICS Network */}
            <div className="gov-card p-6 border border-slate-200 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                <Globe2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">BRICS Data Interoperability</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anonymized Common Agricultural Data Schema (CADS) enabling multilateral collaboration across Brazil, Russia, India, China, and South Africa.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Public Protocol Banner */}
        <div className="gov-card p-6 border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-950">Farmer Data Privacy Guarantee</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Individual farmer identities and cadastral bounds are strictly decoupled from cross-border research datasets.
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm shrink-0"
          >
            Access Portal →
          </Link>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 BRICS Agricultural Cooperation Network. Official Digital Public Infrastructure.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-800 transition-colors font-medium">
              Farmer Login
            </Link>
            <Link href="/brics-network" className="hover:text-slate-800 transition-colors font-medium">
              BRICS Nodes
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
