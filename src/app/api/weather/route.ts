import { NextResponse } from "next/server";
import { fetchOpenMeteoWeather, getFallbackWeather } from "@/lib/services/weatherService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get("lat");
    const lonParam = searchParams.get("lon");

    // Default to Jaipur agricultural zone if not specified
    const lat = latParam ? parseFloat(latParam) : 26.9124;
    const lon = lonParam ? parseFloat(lonParam) : 75.7873;

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { success: false, error: "Invalid latitude or longitude coordinates provided" },
        { status: 400 }
      );
    }

    const weatherData = await fetchOpenMeteoWeather(lat, lon);

    return NextResponse.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    console.error("Weather API route error:", error);
    // Graceful fallback response
    return NextResponse.json({
      success: true,
      data: getFallbackWeather(26.9124, 75.7873),
      warning: "Telemetry served from fallback agro-climatic model",
    });
  }
}
