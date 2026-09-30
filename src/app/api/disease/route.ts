import { NextResponse } from "next/server";
import {
  diagnoseCropDisease,
  BRICS_PATHOLOGY_SAMPLES,
  BRICS_SURVEILLANCE_ALERTS,
} from "@/lib/services/diseaseService";

export async function GET() {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  return NextResponse.json({
    success: true,
    hasGeminiKey,
    engine: hasGeminiKey ? "Google Gemini 2.5 Flash Vision" : "BRICS Calibrated Pathology Model",
    samples: BRICS_PATHOLOGY_SAMPLES,
    surveillanceAlerts: BRICS_SURVEILLANCE_ALERTS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const diagnosis = await diagnoseCropDisease({
      image: body.image,
      sampleId: body.sampleId,
      crop: body.crop,
      variety: body.variety,
      language: body.language || "English",
    });

    return NextResponse.json({
      success: true,
      message: "Leaf pathology diagnostic completed",
      diagnosis,
    });
  } catch (error) {
    console.error("Disease route error:", error);
    return NextResponse.json(
      { success: false, error: "Diagnostic inference failed" },
      { status: 500 }
    );
  }
}
