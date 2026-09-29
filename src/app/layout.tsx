import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BRICS Agri-Net | Digital Agriculture & AI Farm Intelligence",
  description:
    "AI-powered digital agriculture platform delivering localized agro-advisories, weather forecasting, satellite NDVI health monitoring, crop disease diagnostics, and interoperable data exchange across BRICS nations.",
  keywords: [
    "Agriculture",
    "BRICS",
    "Agro-Advisory",
    "AI",
    "NDVI",
    "Crop Disease",
    "Soil Health",
    "Regenerative Agriculture",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
