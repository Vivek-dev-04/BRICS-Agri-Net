import { NextRequest, NextResponse } from "next/server";

export interface GeocodingResultItem {
  displayName: string;
  name: string;
  latitude: number;
  longitude: number;
  district?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  postcode?: string;
}

// Agricultural regional fallbacks in case network is disconnected or throttled
const AGRI_FALLBACKS: Record<string, { lat: number; lon: number; state: string; country: string }> = {
  jaipur: { lat: 26.9124, lon: 75.7873, state: "Rajasthan", country: "India" },
  chomu: { lat: 27.1606, lon: 75.7217, state: "Rajasthan", country: "India" },
  sikar: { lat: 27.6094, lon: 75.1399, state: "Rajasthan", country: "India" },
  ludhiana: { lat: 30.901, lon: 75.8573, state: "Punjab", country: "India" },
  bhatinda: { lat: 30.211, lon: 74.9455, state: "Punjab", country: "India" },
  bathinda: { lat: 30.211, lon: 74.9455, state: "Punjab", country: "India" },
  karnal: { lat: 29.6857, lon: 76.9905, state: "Haryana", country: "India" },
  indore: { lat: 22.7196, lon: 75.8577, state: "Madhya Pradesh", country: "India" },
  nagpur: { lat: 21.1458, lon: 79.0882, state: "Maharashtra", country: "India" },
  pune: { lat: 18.5204, lon: 73.8567, state: "Maharashtra", country: "India" },
  nashik: { lat: 19.9975, lon: 73.7898, state: "Maharashtra", country: "India" },
  varanasi: { lat: 25.3176, lon: 82.9739, state: "Uttar Pradesh", country: "India" },
  lucknow: { lat: 26.8467, lon: 80.9462, state: "Uttar Pradesh", country: "India" },
  coimbatore: { lat: 11.0168, lon: 76.9558, state: "Tamil Nadu", country: "India" },
  hyderabad: { lat: 17.385, lon: 78.4867, state: "Telangana", country: "India" },
  "ribeirao preto": { lat: -21.1776, lon: -47.8101, state: "São Paulo", country: "Brazil" },
  "sao paulo": { lat: -23.5505, lon: -46.6333, state: "São Paulo", country: "Brazil" },
  krasnodar: { lat: 45.0393, lon: 38.9872, state: "Krasnodar Krai", country: "Russia" },
  harbin: { lat: 45.8038, lon: 126.535, state: "Heilongjiang", country: "China" },
  polokwane: { lat: -23.9045, lon: 29.4689, state: "Limpopo", country: "South Africa" },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";
  const countryHint = searchParams.get("country")?.trim().toUpperCase() || "IN";

  if (!query) {
    return NextResponse.json(
      { success: false, error: "Address query 'q' parameter is required" },
      { status: 400 }
    );
  }

  const results: GeocodingResultItem[] = [];

  // Check if query is a 6-digit Indian PIN code (e.g. 303702)
  const isPincode = /^[1-9][0-9]{5}$/.test(query);

  try {
    // 1. Try OpenStreetMap Nominatim with strict timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    let nominatimUrl = "";
    if (isPincode) {
      nominatimUrl = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(
        query
      )}&country=India&format=json&addressdetails=1&limit=5`;
    } else {
      nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=5`;
    }

    const osmRes = await fetch(nominatimUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "BRICS-Agri-Net-App/1.0 (contact@brics-agri.net)",
        "Accept-Language": "en",
      },
    });

    clearTimeout(timeoutId);

    if (osmRes.ok) {
      const data = await osmRes.json();
      if (Array.isArray(data) && data.length > 0) {
        for (const item of data) {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          if (!isNaN(lat) && !isNaN(lon)) {
            const addr = item.address || {};
            const state = addr.state || addr.province || addr.region || "";
            const district = addr.state_district || addr.county || addr.district || addr.city || "";
            const country = addr.country || "";
            const postcode = addr.postcode || (isPincode ? query : undefined);

            results.push({
              displayName: item.display_name,
              name: item.name || query,
              latitude: lat,
              longitude: lon,
              state,
              district,
              country,
              countryCode: (addr.country_code || "in").toUpperCase(),
              postcode,
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn("OSM Nominatim fetch error or timeout:", err);
  }

  // 2. If no results or Nominatim timed out, fallback to Open-Meteo Geocoding API
  if (results.length === 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const openMeteoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}&count=5&language=en&format=json`;

      const omRes = await fetch(openMeteoUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (omRes.ok) {
        const omData = await omRes.json();
        if (Array.isArray(omData.results) && omData.results.length > 0) {
          for (const item of omData.results) {
            results.push({
              displayName: `${item.name}, ${item.admin1 || ""}, ${item.country || ""}`.replace(/,\s*,/g, ",").trim(),
              name: item.name,
              latitude: item.latitude,
              longitude: item.longitude,
              state: item.admin1,
              district: item.admin2,
              country: item.country,
              countryCode: (item.country_code || countryHint).toUpperCase(),
              postcode: item.postcodes?.[0],
            });
          }
        }
      }
    } catch (omErr) {
      console.warn("Open-Meteo Geocoding fetch error:", omErr);
    }
  }

  // 3. Fallback to dictionary of known key agricultural centers
  if (results.length === 0) {
    const lowerQuery = query.toLowerCase();
    for (const [key, val] of Object.entries(AGRI_FALLBACKS)) {
      if (lowerQuery.includes(key)) {
        results.push({
          displayName: `${key.toUpperCase()}, ${val.state}, ${val.country}`,
          name: key.toUpperCase(),
          latitude: val.lat,
          longitude: val.lon,
          state: val.state,
          country: val.country,
          countryCode: "IN",
        });
        break;
      }
    }
  }

  return NextResponse.json({
    success: true,
    query,
    count: results.length,
    results,
  });
}
