"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { LanguageSelector, SupportedLanguage } from "./LanguageSelector";
import { validateIndianMobile, validatePassword, authenticateFarmer } from "@/lib/auth/authService";
import { useFarm } from "@/context/FarmContext";

const TRANSLATIONS = {
  en: {
    welcome: "Welcome back 👋",
    title: "Sign in to your farm",
    subtitle: "Access your farm insights, weather information and personalized agricultural guidance.",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "Enter your mobile number",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    signIn: "Sign In",
    signingIn: "Signing in...",
    noAccount: "Don't have an account?",
    registerFarmer: "Register as a Farmer",
    authError: "We couldn't sign you in. Please check your mobile number and password and try again.",
  },
  hi: {
    welcome: "वापसी पर स्वागत है 👋",
    title: "अपने खेत के खाते में साइन इन करें",
    subtitle: "अपने खेत की जानकारी, मौसम का पूर्वानुमान और व्यक्तिगत कृषि सलाह प्राप्त करें।",
    mobileLabel: "मोबाइल नंबर",
    mobilePlaceholder: "अपना मोबाइल नंबर दर्ज करें",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    rememberMe: "मुझे याद रखें",
    forgotPassword: "पासवर्ड भूल गए?",
    signIn: "साइन इन करें",
    signingIn: "साइन इन हो रहा है...",
    noAccount: "खाता नहीं है?",
    registerFarmer: "किसान के रूप में पंजीकरण करें",
    authError: "हम आपको साइन इन नहीं कर सके। कृपया अपना मोबाइल नंबर और पासवर्ड जांचें और पुनः प्रयास करें।",
  },
};

export function LoginForm() {
  const router = useRouter();
  const { login: loginInContext } = useFarm();

  // Form State
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation & Error States
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Language state
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const t = TRANSLATIONS[language];

  // Mobile number input formatting & cleansing
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(rawVal);
    if (mobileError) setMobileError(null);
    if (serverError) setServerError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(null);
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error states
    setMobileError(null);
    setPasswordError(null);
    setServerError(null);

    // Client-side validation
    const mobileValidation = validateIndianMobile(mobile);
    const passwordValidation = validatePassword(password);

    let hasError = false;

    if (!mobileValidation.isValid) {
      setMobileError(mobileValidation.error || "Please enter a valid mobile number.");
      hasError = true;
    }

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || "Please enter your password.");
      hasError = true;
    }

    if (hasError) return;

    // Proceed to sign in against LocalStorage Database
    setIsLoading(true);

    try {
      // 1. Authenticate against persistent LocalStorage database
      const localResult = loginInContext(mobile, password);

      if (localResult.success) {
        // Also fire background API call for parity
        authenticateFarmer({ mobile, password, rememberMe }).catch(() => {});
        router.push("/dashboard");
        return;
      }

      // If local authentication failed, show specific error
      setServerError(localResult.error || t.authError);
    } catch {
      setServerError(t.authError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
      {/* Top Header Row with Language Selector */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <span className="text-[11px] font-semibold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Farmer Access
        </span>
        <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
      </div>

      {/* Greeting & Header */}
      <div className="pt-5 pb-6 space-y-1.5 text-left">
        <span className="text-sm font-semibold text-slate-500 block">
          {t.welcome}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-0.5">
          {t.subtitle}
        </p>
      </div>

      {/* Global Server/Auth Error Notice */}
      {serverError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 animate-in fade-in"
        >
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span className="leading-relaxed font-medium">{serverError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Mobile Number Field */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="mobile-input"
            className="block text-xs font-bold text-slate-800 tracking-wide"
          >
            {t.mobileLabel} <span className="text-red-500">*</span>
          </label>

          <div className="flex rounded-xl border border-slate-300 bg-white focus-within:border-emerald-700 focus-within:ring-3 focus-within:ring-emerald-700/15 transition-all overflow-hidden shadow-xs">
            {/* Country code prefix */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-3 border-r border-slate-200 select-none text-slate-700">
              <span className="text-base leading-none" aria-hidden="true">🇮🇳</span>
              <span className="text-xs font-bold font-mono tracking-tight">+91</span>
            </div>

            {/* Mobile number text field */}
            <input
              id="mobile-input"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              required
              disabled={isLoading}
              maxLength={10}
              placeholder={t.mobilePlaceholder}
              value={mobile}
              onChange={handleMobileChange}
              aria-invalid={!!mobileError}
              aria-describedby={mobileError ? "mobile-error" : undefined}
              className="w-full px-3.5 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none bg-transparent"
            />
          </div>

          {mobileError && (
            <p
              id="mobile-error"
              className="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1 animate-in fade-in"
            >
              <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{mobileError}</span>
            </p>
          )}
        </div>

        {/* Password / PIN Field */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="password-input"
            className="block text-xs font-bold text-slate-800 tracking-wide"
          >
            {t.passwordLabel} <span className="text-red-500">*</span>
          </label>

          <div className="relative rounded-xl border border-slate-300 bg-white focus-within:border-emerald-700 focus-within:ring-3 focus-within:ring-emerald-700/15 transition-all overflow-hidden shadow-xs">
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isLoading}
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={handlePasswordChange}
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? "password-error" : undefined}
              className="w-full pl-3.5 pr-11 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none bg-transparent"
            />

            {/* Accessible Show / Hide Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-slate-600" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {passwordError && (
            <p
              id="password-error"
              className="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1 animate-in fade-in"
            >
              <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{passwordError}</span>
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label
            htmlFor="remember-me"
            className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium hover:text-slate-900"
          >
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-slate-300 text-emerald-800 focus:ring-emerald-700/20 cursor-pointer accent-emerald-800"
            />
            <span>{t.rememberMe}</span>
          </label>

          <Link
            href="/forgot-password"
            className="font-semibold text-emerald-800 hover:text-emerald-950 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700/20 rounded"
          >
            {t.forgotPassword}
          </Link>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold py-3.5 px-4 text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-3 focus:ring-emerald-700/30"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
              <span>{t.signingIn}</span>
            </>
          ) : (
            <>
              <span>{t.signIn}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      {/* Registration CTA */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600 font-medium">
          {t.noAccount}{" "}
          <Link
            href="/register"
            className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700/20 rounded ml-1"
          >
            {t.registerFarmer}
          </Link>
        </p>
      </div>
    </div>
  );
}
