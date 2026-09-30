import { NextResponse } from "next/server";
import { CadsRecordSchema, CadsRecord } from "@/lib/schemas/cads";

const MOCK_CADS_RECORDS: CadsRecord[] = [
  {
    country: "IN",
    region: "Rajasthan (Jaipur Grid)",
    crop: "wheat",
    soil: { nitrogen: 180, phosphorus: 18, potassium: 310, ph: 7.1, organicCarbon: 0.42 },
    weather: { temperature: 31, rainfall: 0.2, humidity: 41, windSpeed: 14 },
    vegetation: { ndvi: 0.61, stressLevel: "MODERATE" },
    timestamp: "2026-09-29T08:30:00Z",
  },
  {
    country: "IN",
    region: "Punjab (Ludhiana Grid)",
    crop: "wheat",
    soil: { nitrogen: 220, phosphorus: 26, potassium: 340, ph: 7.4, organicCarbon: 0.58 },
    weather: { temperature: 28, rainfall: 1.2, humidity: 55, windSpeed: 9 },
    vegetation: { ndvi: 0.72, stressLevel: "LOW" },
    timestamp: "2026-09-29T08:45:00Z",
  },
  {
    country: "BR",
    region: "Mato Grosso (Sorriso Grid)",
    crop: "soybean",
    soil: { nitrogen: 240, phosphorus: 22, potassium: 280, ph: 6.4, organicCarbon: 0.85 },
    weather: { temperature: 29, rainfall: 4.5, humidity: 68, windSpeed: 11 },
    vegetation: { ndvi: 0.74, stressLevel: "NONE" },
    timestamp: "2026-09-29T07:15:00Z",
  },
  {
    country: "BR",
    region: "Goias (Rio Verde Grid)",
    crop: "maize",
    soil: { nitrogen: 210, phosphorus: 20, potassium: 260, ph: 6.2, organicCarbon: 0.72 },
    weather: { temperature: 30, rainfall: 2.1, humidity: 62, windSpeed: 13 },
    vegetation: { ndvi: 0.68, stressLevel: "LOW" },
    timestamp: "2026-09-29T07:45:00Z",
  },
  {
    country: "RU",
    region: "Rostov Oblast (Don Basin Grid)",
    crop: "winter-wheat",
    soil: { nitrogen: 260, phosphorus: 28, potassium: 380, ph: 7.2, organicCarbon: 1.45 },
    weather: { temperature: 14, rainfall: 0.0, humidity: 48, windSpeed: 18 },
    vegetation: { ndvi: 0.66, stressLevel: "LOW" },
    timestamp: "2026-09-29T06:20:00Z",
  },
  {
    country: "RU",
    region: "Krasnodar Krai (Kuban Grid)",
    crop: "sunflower",
    soil: { nitrogen: 275, phosphorus: 30, potassium: 400, ph: 7.0, organicCarbon: 1.55 },
    weather: { temperature: 18, rainfall: 3.4, humidity: 59, windSpeed: 12 },
    vegetation: { ndvi: 0.78, stressLevel: "NONE" },
    timestamp: "2026-09-29T06:50:00Z",
  },
  {
    country: "CN",
    region: "Heilongjiang (Harbin Grid)",
    crop: "rice",
    soil: { nitrogen: 250, phosphorus: 24, potassium: 320, ph: 6.8, organicCarbon: 1.25 },
    weather: { temperature: 21, rainfall: 8.2, humidity: 88, windSpeed: 8 },
    vegetation: { ndvi: 0.79, stressLevel: "NONE" },
    timestamp: "2026-09-29T05:10:00Z",
  },
  {
    country: "CN",
    region: "Shandong (Dezhou Grid)",
    crop: "wheat",
    soil: { nitrogen: 230, phosphorus: 22, potassium: 310, ph: 7.5, organicCarbon: 0.62 },
    weather: { temperature: 24, rainfall: 0.0, humidity: 50, windSpeed: 10 },
    vegetation: { ndvi: 0.69, stressLevel: "LOW" },
    timestamp: "2026-09-29T05:35:00Z",
  },
  {
    country: "ZA",
    region: "Free State (Bloemfontein Grid)",
    crop: "maize",
    soil: { nitrogen: 170, phosphorus: 14, potassium: 240, ph: 6.1, organicCarbon: 0.35 },
    weather: { temperature: 26, rainfall: 0.0, humidity: 32, windSpeed: 21 },
    vegetation: { ndvi: 0.54, stressLevel: "MODERATE" },
    timestamp: "2026-09-29T09:10:00Z",
  },
  {
    country: "ZA",
    region: "Mpumalanga (Highveld Grid)",
    crop: "soybean",
    soil: { nitrogen: 195, phosphorus: 16, potassium: 255, ph: 5.9, organicCarbon: 0.48 },
    weather: { temperature: 23, rainfall: 1.8, humidity: 45, windSpeed: 14 },
    vegetation: { ndvi: 0.62, stressLevel: "LOW" },
    timestamp: "2026-09-29T09:40:00Z",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const crop = searchParams.get("crop");
  const minNdvi = searchParams.get("minNdvi");

  let filtered = [...MOCK_CADS_RECORDS];

  if (country && country !== "ALL") {
    filtered = filtered.filter((r) => r.country === country);
  }

  if (crop && crop !== "ALL") {
    filtered = filtered.filter((r) => r.crop.toLowerCase().includes(crop.toLowerCase()));
  }

  if (minNdvi) {
    const thresh = parseFloat(minNdvi);
    if (!isNaN(thresh)) {
      filtered = filtered.filter((r) => r.vegetation.ndvi >= thresh);
    }
  }

  return NextResponse.json({
    success: true,
    schema: "CADS-v1.0",
    specificationUrl: "https://schema.brics-agri.net/cads/v1.0/schema.json",
    compliance: "DPGA Standard 1.0 (Digital Public Good)",
    privacyLevel: "Strict Zero-PII Aggregated Spatial Grid",
    count: filtered.length,
    records: filtered,
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

    // Append to live session records
    const recordWithTime: CadsRecord = {
      ...validated.data,
      timestamp: validated.data.timestamp || new Date().toISOString(),
    };
    MOCK_CADS_RECORDS.unshift(recordWithTime);

    return NextResponse.json({
      success: true,
      message: "CADS agricultural observation ingested into BRICS network layer",
      record: recordWithTime,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
