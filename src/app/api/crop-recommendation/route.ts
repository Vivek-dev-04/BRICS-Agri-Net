import { NextResponse } from "next/server";
import { generateCropRecommendations, CropRecommendationParams } from "@/lib/services/cropRecommendationService";
import { fetchOpenMeteoWeather } from "@/lib/services/weatherService";
import { fetchSoilTelemetry } from "@/lib/services/soilService";
import { DEMO_FARM } from "@/lib/mock-data";

export async function GET() {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");

  return NextResponse.json({
    success: true,
    service: "AI Crop Planning & Suitability Engine",
    hasGeminiKey,
    activeEngine: hasGeminiKey ? "gemini-2.5-flash" : "agronomic-engine",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const farm = body.farm || DEMO_FARM;
    const season = body.season || "Upcoming Season";
    const priorityGoal = body.priorityGoal || "Balanced";
    const ndvi = typeof body.ndvi === "number" ? body.ndvi : 0.61;

    let weather = body.weather;
    if (!weather && farm.latitude && farm.longitude) {
      try {
        weather = await fetchOpenMeteoWeather(farm.latitude, farm.longitude);
      } catch (err) {
        console.warn("Could not fetch live weather in crop recommendation route:", err);
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
        console.warn("Could not fetch live soil in crop recommendation route:", err);
      }
    }

    const params: CropRecommendationParams = {
      farm,
      weather,
      soil,
      ndvi,
      season,
      priorityGoal,
    };

    const result = await generateCropRecommendations(params);

    return NextResponse.json({
      success: true,
      message: `Crop suitability plan synthesized via ${result.engine}`,
      plan: result,
    });
  } catch (error) {
    console.error("Crop recommendation failure:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate crop planning recommendations" },
      { status: 500 }
    );
  }
}
