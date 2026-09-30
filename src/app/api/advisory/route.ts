import { NextResponse } from "next/server";
import { generateAgroAdvisory, GenerateAdvisoryParams } from "@/lib/services/advisoryService";
import { fetchOpenMeteoWeather } from "@/lib/services/weatherService";
import { fetchSoilTelemetry } from "@/lib/services/soilService";
import { DEMO_FARM } from "@/lib/mock-data";

export async function GET() {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");

  return NextResponse.json({
    success: true,
    service: "AI Agro-Advisory Engine",
    version: "v1.2",
    hasGeminiKey,
    activeEngine: hasGeminiKey ? "gemini-1.5-flash" : "agronomic-rule-engine",
    supportedLanguages: ["English", "Hindi", "Portuguese", "Russian", "Chinese"],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const farm = body.farm || DEMO_FARM;
    const language = body.language || "English";
    const ndvi = typeof body.ndvi === "number" ? body.ndvi : 0.61;

    let weather = body.weather;
    if (!weather && farm.latitude && farm.longitude) {
      try {
        weather = await fetchOpenMeteoWeather(farm.latitude, farm.longitude);
      } catch (err) {
        console.warn("Could not fetch live weather in advisory route:", err);
      }
    }

    let soil = body.soil;
    if (!soil && farm.latitude && farm.longitude) {
      try {
        const soilTelemetry = await fetchSoilTelemetry(farm.latitude, farm.longitude);
        soil = {
          farmId: farm.id,
          soilType: soilTelemetry.soilNameEn,
          nitrogen: soilTelemetry.nitrogen.value,
          phosphorus: soilTelemetry.phosphorus.value,
          potassium: soilTelemetry.potassium.value,
          ph: soilTelemetry.ph.value,
          organicCarbon: soilTelemetry.organicCarbon.value,
          moisture: soilTelemetry.moisturePercent,
          soilScore: soilTelemetry.soilScore,
          status: soilTelemetry.statusHeadline,
          updatedAt: soilTelemetry.updatedAt,
        };
      } catch (err) {
        console.warn("Could not fetch live soil in advisory route:", err);
      }
    }

    const params: GenerateAdvisoryParams = {
      farm,
      weather,
      soil,
      ndvi,
      language,
    };

    const advisory = await generateAgroAdvisory(params);

    return NextResponse.json({
      success: true,
      message: `AI Advisory synthesized via ${advisory.engine}`,
      advisory,
    });
  } catch (error) {
    console.error("Advisory synthesis failure:", error);
    return NextResponse.json(
      { success: false, error: "Failed to synthesize agro-advisory" },
      { status: 500 }
    );
  }
}
