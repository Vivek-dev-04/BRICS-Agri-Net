"use client";

import { FarmProvider } from "@/context/FarmContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <FarmProvider>{children}</FarmProvider>;
}
