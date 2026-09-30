"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe2, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SUPPORTED_LANGUAGES_LIST, BricsLanguage } from "@/lib/i18n/languages";

interface LanguageSelectorProps {
  variant?: "compact" | "default";
  className?: string;
}

export function LanguageSelector({ variant = "compact", className = "" }: LanguageSelectorProps) {
  const { language, setLanguage, localeInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: BricsLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === "compact") {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 rounded bg-slate-800 hover:bg-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-200 border border-slate-700 transition-colors focus:outline-none"
          aria-expanded={isOpen}
          aria-label="Select BRICS Language"
        >
          <Globe2 className="h-3 w-3 text-emerald-400 shrink-0" />
          <span className="font-bold text-emerald-400">[{localeInfo.code.toUpperCase()}]</span>
          <span className="hidden sm:inline text-slate-300 font-sans font-medium">
            {localeInfo.nativeName}
          </span>
          <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-44 rounded-lg bg-white shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in-50 zoom-in-95 text-xs text-slate-800">
            <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              BRICS National Languages
            </div>
            {SUPPORTED_LANGUAGES_LIST.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors hover:bg-slate-50 ${
                    isSelected ? "bg-emerald-50 text-emerald-900 font-bold" : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {lang.code.toUpperCase()}
                    </span>
                    <div>
                      <span className="block font-medium leading-none">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-emerald-700" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Default larger selector
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 shadow-xs transition-colors"
      >
        <Globe2 className="h-4 w-4 text-emerald-800 shrink-0" />
        <span>{localeInfo.nativeName} ({localeInfo.name})</span>
        <ChevronDown className="h-3 w-3 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Select Platform Language
          </div>
          {SUPPORTED_LANGUAGES_LIST.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                  isSelected ? "bg-emerald-50 text-emerald-950 font-bold" : "text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {lang.code.toUpperCase()}
                  </span>
                  <div>
                    <span className="block font-semibold">{lang.nativeName}</span>
                    <span className="text-[10px] text-slate-500">{lang.countryName}</span>
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4 text-emerald-700" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
