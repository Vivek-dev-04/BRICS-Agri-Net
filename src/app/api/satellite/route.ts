import { NextResponse } from "next/server";
import { DEMO_NDVI_SERIES, DEMO_HEALTH_SCORES } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    currentNdvi: DEMO_HEALTH_SCORES.ndviCurrent,
    series: DEMO_NDVI_SERIES,
  });
}
