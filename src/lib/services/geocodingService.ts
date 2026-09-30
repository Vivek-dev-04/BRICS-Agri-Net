export interface GeocodingResult {
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

export async function geocodeAddress(
  query: string,
  countryHint: string = "IN"
): Promise<{ success: boolean; results: GeocodingResult[]; error?: string }> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { success: false, results: [], error: "Please enter an address or PIN code" };
  }

  try {
    const res = await fetch(
      `/api/geocode?q=${encodeURIComponent(trimmed)}&country=${encodeURIComponent(countryHint)}`
    );
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to resolve location`);
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.results)) {
      return { success: true, results: data.results };
    }
    return { success: true, results: [] };
  } catch (err: any) {
    console.warn("Geocoding service error:", err);
    return {
      success: false,
      results: [],
      error: err.message || "Failed to reach geocoding service",
    };
  }
}
