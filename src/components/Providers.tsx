"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { FarmProvider } from "@/context/FarmContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <FarmProvider>{children}</FarmProvider>
    </LanguageProvider>
  );
}
