import { NextResponse } from "next/server";
import { DEMO_WEATHER } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: DEMO_WEATHER,
  });
}
