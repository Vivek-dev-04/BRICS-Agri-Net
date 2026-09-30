import { NextResponse } from "next/server";
import { fetchSoilTelemetry } from "@/lib/services/soilService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get("lat");
    const lonParam = searchParams.get("lon");

    const lat = latParam ? parseFloat(latParam) : 26.9124;
    const lon = lonParam ? parseFloat(lonParam) : 75.7873;

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { success: false, error: "Invalid coordinate values provided" },
        { status: 400 }
      );
    }

    const telemetry = await fetchSoilTelemetry(lat, lon);

    return NextResponse.json({
      success: true,
      data: telemetry,
    });
  } catch (error) {
    console.error("Soil API route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate soil telemetry" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { lat = 26.9124, lon = 75.7873, customOverrides } = body;

    const baseTelemetry = await fetchSoilTelemetry(lat, lon);

    // Apply any laboratory overrides (from physical Soil Health Card tests)
    const updatedTelemetry = {
      ...baseTelemetry,
      ...customOverrides,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Soil health test records updated",
      data: updatedTelemetry,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update soil records" },
      { status: 500 }
    );
  }
}
