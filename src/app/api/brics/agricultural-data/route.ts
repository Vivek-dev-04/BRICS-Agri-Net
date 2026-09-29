import { NextResponse } from "next/server";
import { CadsRecordSchema } from "@/lib/schemas/cads";

const MOCK_CADS_RECORDS = [
  {
    country: "IN",
    region: "Rajasthan",
    crop: "wheat",
    soil: { nitrogen: 180, phosphorus: 18, potassium: 310, ph: 7.1, organicCarbon: 0.42 },
    weather: { temperature: 31, rainfall: 0.2, humidity: 41, windSpeed: 14 },
    vegetation: { ndvi: 0.61, stressLevel: "MODERATE" },
    timestamp: "2026-09-29T08:30:00Z",
  },
  {
    country: "BR",
    region: "Mato Grosso",
    crop: "soybean",
    soil: { nitrogen: 240, phosphorus: 22, potassium: 280, ph: 6.4, organicCarbon: 0.85 },
    weather: { temperature: 29, rainfall: 4.5, humidity: 68, windSpeed: 11 },
    vegetation: { ndvi: 0.74, stressLevel: "NONE" },
    timestamp: "2026-09-29T07:15:00Z",
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    schema: "CADS-v1.0",
    count: MOCK_CADS_RECORDS.length,
    records: MOCK_CADS_RECORDS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = CadsRecordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Payload failed CADS schema validation",
          details: validated.error.format(),
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "CADS agricultural observation ingested into BRICS layer",
      record: validated.data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
