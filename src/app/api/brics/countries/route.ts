import { NextResponse } from "next/server";
import { DEMO_BRICS_COUNTRIES } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    countries: DEMO_BRICS_COUNTRIES,
  });
}
