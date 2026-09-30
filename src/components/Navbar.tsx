"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, LayoutDashboard, Globe2, User, LogOut, ArrowRight, Database, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFarm } from "@/context/FarmContext";

export function Navbar() {
  const pathname = usePathname();
  const { user, farm, isAuthenticated, logout } = useFarm();

  const isPublicPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  const countryFlags: Record<string, string> = {
    IN: "🇮🇳",
    BR: "🇧🇷",
    RU: "🇷🇺",
    CN: "🇨🇳",
    ZA: "🇿🇦",
  };

  const navLinks = [
    { name: "My Farms", href: "/farms", icon: Sprout },
    { name: "Crop Planner", href: "/crop-planner", icon: Compass },
    { name: "BRICS Network", href: "/brics-network", icon: Globe2 },
    { name: "Database (DB)", href: "/db", icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-slate-200">
      {/* Top Official Government Utility Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-400">BRICS Digital Agriculture</span>
            <span className="text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">
              Interoperable Digital Public Infrastructure for Climate-Resilient Farming
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/db"
              className="hover:text-emerald-300 transition-colors flex items-center gap-1 font-mono text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 text-emerald-400"
            >
              <Database className="h-3 w-3" />
              <span>Inspect DB</span>
            </Link>
            <div className="flex items-center gap-2 font-mono text-slate-400 text-[10px]">
              <span>🇮🇳 India</span>
              <span>🇧🇷 Brazil</span>
              <span>🇷🇺 Russia</span>
              <span>🇨🇳 China</span>
              <span>🇿🇦 South Africa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Official Header Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Portal Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-sm">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                BRICS Agri-Net
              </span>
              <span className="rounded bg-emerald-100 text-emerald-800 border border-emerald-300/60 px-1.5 py-0.5 text-[10px] font-bold">
                OFFICIAL
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Agricultural Advisory & Telemetry Portal
            </p>
          </div>
        </Link>

        {/* CONDITION 1: IF ON LANDING OR LOGIN PAGE -> ONLY SHOW SIGN IN / REGISTER BUTTON */}
        {isPublicPage ? (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <User className="h-4 w-4" />
              <span>Sign In / Register</span>
            </Link>
          </div>
        ) : (
          /* CONDITION 2: IF ON DASHBOARD / INTERNAL PAGES -> SHOW MINIMAL NAVIGATION & FARMER PILL */
          <>
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === "/farms" && pathname === "/dashboard");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3.5 py-2 text-xs font-semibold transition-colors",
                      isActive
                        ? "bg-emerald-800 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2.5">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/farms"
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all"
                    title="View Farm Details"
                  >
                    <span className="text-base leading-none">
                      {countryFlags[user.country] || "🌾"}
                    </span>
                    <div className="text-left hidden sm:block">
                      <span className="font-bold block text-[11px] leading-tight text-slate-900">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block leading-tight truncate max-w-[130px]">
                        {farm.name} • {farm.crop}
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/"
                    onClick={logout}
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                    title="Sign Out / Switch Farmer"
                  >
                    <LogOut className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Farmer Sign In</span>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
