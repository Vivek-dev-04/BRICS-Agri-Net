"use client";

import React from "react";
import { Globe2 } from "lucide-react";
import { BricsLanguage } from "@/lib/i18n/languages";

export type SupportedLanguage = BricsLanguage;

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200/70 transition-colors px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-xs">
      <Globe2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
      <span className="font-medium text-slate-700 text-[11px] hidden sm:inline">
        Language:
      </span>
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
        aria-label="Select Language"
        className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer text-xs pr-1"
      >
        <option value="en">English</option>
        <option value="hi">हिंदी (Hindi)</option>
        <option value="pt">Português (Portuguese)</option>
        <option value="ru">Русский (Russian)</option>
        <option value="zh">中文 (Chinese)</option>
      </select>
    </div>
  );
}
