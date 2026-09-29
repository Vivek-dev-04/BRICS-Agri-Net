"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  LayoutDashboard,
  CloudSun,
  Satellite,
  FlaskConical,
  Sparkles,
  ScanEye,
  Leaf,
  Globe2,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Overview", href: "/", icon: Sprout },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Farms", href: "/farms", icon: Sprout },
  { name: "Weather", href: "/weather", icon: CloudSun },
  { name: "Satellite NDVI", href: "/satellite", icon: Satellite },
  { name: "Soil Health", href: "/soil", icon: FlaskConical },
  { name: "AI Advisory", href: "/advisory", icon: Sparkles },
  { name: "Disease Vision", href: "/disease", icon: ScanEye },
  { name: "Regenerative", href: "/regenerative", icon: Leaf },
  { name: "BRICS Network", href: "/brics-network", icon: Globe2 },
  { name: "CADS API", href: "/interoperability", icon: Code2 },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-all">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">BRICS Agri-Net</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                MVP v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Interoperable AI Farm Intelligence</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {NAV_ITEMS.slice(1).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-300">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>5 BRICS Nodes Active</span>
          </div>
          <Link
            href="/brics-network"
            className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition-colors"
          >
            Launch Cooperation
          </Link>
        </div>
      </div>
    </header>
  );
}
