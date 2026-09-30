/**
 * Open-Meteo Agrometeorological Weather Service
 * 
 * Interacts with Open-Meteo free API to fetch high-resolution, localized weather,
 * soil telemetry (0-7cm moisture & temp), evapotranspiration (ET0), and computes
 * agricultural risk signals (Water stress, Fungal germination, Spray window).
 */

export interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  humidity: number;
  precipitationMm: number;
  rainMm: number;
  weatherCode: number;
  weatherText: string;
  conditionIcon: "sun" | "cloud-sun" | "cloud" | "rain" | "thunder" | "fog" | "snow";
  windSpeedKmh: number;
  windDirectionDeg: number;
  uvIndex: number;
  soilMoisturePercent: number; // Volumetric soil water 0-7cm converted to %
  soilTempC: number;           // Soil temperature at 0-7cm
}

export interface WeatherForecastDay {
  date: string;
  day: string;
  tempMax: number;
  tempMin: number;
  rainProb: number;
  precipitationMm: number;
  et0Mm: number;               // FAO Penman-Monteith Evapotranspiration in mm
  uvIndexMax: number;
  weatherCode: number;
  weatherText: string;
  conditionIcon: "sun" | "cloud-sun" | "cloud" | "rain" | "thunder" | "fog" | "snow";
}

export interface AgroRiskAssessment {
  waterStress: {
    level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
    title: string;
    description: string;
    recommendation: string;
  };
  fungalRisk: {
    level: "LOW" | "MODERATE" | "HIGH";
    title: string;
    description: string;
  };
  sprayingWindow: {
    suitable: boolean;
    status: "SUITABLE" | "MARGINAL" | "UNFAVORABLE";
    reason: string;
  };
  thermalStress: {
    level: "NORMAL" | "HEAT_STRESS" | "FROST_RISK";
    title: string;
    description: string;
  };
}

export interface WeatherData {
  isLive: boolean;
  station: {
    latitude: number;
    longitude: number;
    elevation: number;
    timezone: string;
  };
  current: WeatherCurrent;
  forecast: WeatherForecastDay[];
  agroRisks: AgroRiskAssessment;
  fetchedAt: string;
}

// WMO Weather code dictionary for agricultural interpretation
export function decodeWmoCode(code: number): {
  text: string;
  icon: "sun" | "cloud-sun" | "cloud" | "rain" | "thunder" | "fog" | "snow";
} {
  switch (code) {
    case 0:
      return { text: "Clear Sky", icon: "sun" };
    case 1:
      return { text: "Mainly Clear", icon: "sun" };
    case 2:
      return { text: "Partly Cloudy", icon: "cloud-sun" };
    case 3:
      return { text: "Overcast", icon: "cloud" };
    case 45:
    case 48:
      return { text: "Foggy / Morning Dew", icon: "fog" };
    case 51:
    case 53:
    case 55:
      return { text: "Light Drizzle", icon: "rain" };
    case 61:
    case 63:
      return { text: "Moderate Rain", icon: "rain" };
    case 65:
      return { text: "Heavy Rain", icon: "rain" };
    case 71:
    case 73:
    case 75:
      return { text: "Snowfall", icon: "snow" };
    case 80:
    case 81:
    case 82:
      return { text: "Passing Showers", icon: "rain" };
    case 95:
    case 96:
    case 99:
      return { text: "Thunderstorm Warning", icon: "thunder" };
    default:
      return { text: "Fair Weather", icon: "cloud-sun" };
  }
}

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Calculates agricultural risks from meteorological observations
 */
export function computeAgroRisks(
  temp: number,
  humidity: number,
  windSpeed: number,
  rainProb: number,
  soilMoisturePct: number,
  et0Max: number
): AgroRiskAssessment {
  // 1. Water Stress & Irrigation Trigger
  let waterLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" = "LOW";
  let waterTitle = "Optimal Soil Hydration";
  let waterDesc = "Root-zone volumetric moisture is adequate for normal transpiration.";
  let waterRec = "Maintain scheduled agronomic routines.";

  if (soilMoisturePct < 15 || (soilMoisturePct < 20 && et0Max > 5.0 && rainProb < 20)) {
    waterLevel = "CRITICAL";
    waterTitle = "Critical Root-Zone Water Stress";
    waterDesc = `Soil moisture is at ${soilMoisturePct.toFixed(1)}% with high evaporative demand (${et0Max.toFixed(1)} mm/day) and low rain probability (${rainProb}%).`;
    waterRec = "Immediate irrigation required within 24 hours to prevent permanent crop wilting point.";
  } else if (soilMoisturePct < 22 || et0Max > 4.5) {
    waterLevel = "MODERATE";
    waterTitle = "Moderate Evaporative Deficit";
    waterDesc = `Daytime evapotranspiration (${et0Max.toFixed(1)} mm/day) exceeds soil recharge.`;
    waterRec = "Plan a light irrigation cycle or prepare mulch to conserve root moisture.";
  }

  // 2. Fungal Germination Risk
  let fungalLevel: "LOW" | "MODERATE" | "HIGH" = "LOW";
  let fungalTitle = "Low Fungal Infection Risk";
  let fungalDesc = "Ambient humidity is below spore germination thresholds.";

  if (humidity >= 80 && temp >= 18 && temp <= 29) {
    fungalLevel = "HIGH";
    fungalTitle = "High Spore Germination Risk (Rust / Blight)";
    fungalDesc = `Prolonged relative humidity (${humidity}%) paired with warm temperatures (${temp.toFixed(1)}°C) creates ideal microclimate for foliar fungal pathogens.`;
  } else if (humidity >= 65) {
    fungalLevel = "MODERATE";
    fungalTitle = "Moderate Humidity / Spore Watch";
    fungalDesc = "Check lower canopy leaves for early powdery spots or moisture traps.";
  }

  // 3. Spraying Window
  let suitable = true;
  let status: "SUITABLE" | "MARGINAL" | "UNFAVORABLE" = "SUITABLE";
  let reason = "Optimal conditions: wind velocity is calm and precipitation is unlikely.";

  if (windSpeed > 18) {
    suitable = false;
    status = "UNFAVORABLE";
    reason = `Wind speed (${windSpeed} km/h) is too high — severe chemical droplet drift risk.`;
  } else if (rainProb > 45) {
    suitable = false;
    status = "UNFAVORABLE";
    reason = `Rain probability (${rainProb}%) is elevated — high risk of agrochemical foliar washoff.`;
  } else if (temp > 35) {
    suitable = false;
    status = "MARGINAL";
    reason = `High temperature (${temp.toFixed(1)}°C) may cause rapid droplet evaporation and phytotoxicity.`;
  }

  // 4. Thermal Stress
  let thermalLevel: "NORMAL" | "HEAT_STRESS" | "FROST_RISK" = "NORMAL";
  let thermalTitle = "Normal Vegetative Temperature";
  let thermalDesc = "Day and night temperatures are within normal physiological bounds.";

  if (temp >= 36) {
    thermalLevel = "HEAT_STRESS";
    thermalTitle = "Heat Stress Alert";
    thermalDesc = `High ambient temperature (${temp.toFixed(1)}°C) may suppress pollination and cause pollen sterility in flowering crops.`;
  } else if (temp <= 4) {
    thermalLevel = "FROST_RISK";
    thermalTitle = "Ground Frost Warning";
    thermalDesc = "Night temperatures approaching freezing. Apply light protective evening irrigation.";
  }

  return {
    waterStress: {
      level: waterLevel,
      title: waterTitle,
      description: waterDesc,
      recommendation: waterRec,
    },
    fungalRisk: {
      level: fungalLevel,
      title: fungalTitle,
      description: fungalDesc,
    },
    sprayingWindow: {
      suitable,
      status,
      reason,
    },
    thermalStress: {
      level: thermalLevel,
      title: thermalTitle,
      description: thermalDesc,
    },
  };
}

/**
 * Fallback weather data generator if offline or API is unreachable
 */
export function getFallbackWeather(lat: number, lon: number): WeatherData {
  const now = new Date();
  const days = ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const forecast: WeatherForecastDay[] = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : DAYS_SHORT[d.getDay()];
    const dateFormatted = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    const code = i === 2 ? 61 : i === 4 ? 2 : 0;
    const decoded = decodeWmoCode(code);

    return {
      date: dateFormatted,
      day: dayName,
      tempMax: 31 + (i % 3) - 1,
      tempMin: 19 + (i % 2),
      rainProb: i === 2 ? 55 : i === 3 ? 25 : 10,
      precipitationMm: i === 2 ? 4.2 : 0,
      et0Mm: 4.8 - (i * 0.1),
      uvIndexMax: 7,
      weatherCode: code,
      weatherText: decoded.text,
      conditionIcon: decoded.icon,
    };
  });

  const current: WeatherCurrent = {
    temp: 30.5,
    feelsLike: 32.8,
    humidity: 46,
    precipitationMm: 0,
    rainMm: 0,
    weatherCode: 0,
    weatherText: "Clear Sky",
    conditionIcon: "sun",
    windSpeedKmh: 12.5,
    windDirectionDeg: 285,
    uvIndex: 7,
    soilMoisturePercent: 18.5,
    soilTempC: 28.4,
  };

  const agroRisks = computeAgroRisks(
    current.temp,
    current.humidity,
    current.windSpeedKmh,
    forecast[0]?.rainProb || 10,
    current.soilMoisturePercent,
    forecast[0]?.et0Mm || 4.8
  );

  return {
    isLive: false,
    station: {
      latitude: lat,
      longitude: lon,
      elevation: 430,
      timezone: "Asia/Kolkata",
    },
    current,
    forecast,
    agroRisks,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Fetch real-time weather & agrometeorological telemetry from Open-Meteo
 */
export async function fetchOpenMeteoWeather(lat: number, lon: number): Promise<WeatherData> {
  // Validate coordinates
  const latitude = typeof lat === "number" && !isNaN(lat) ? lat : 26.9124;
  const longitude = typeof lon === "number" && !isNaN(lon) ? lon : 75.7873;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration,uv_index_max&hourly=soil_temperature_0_to_7cm,soil_moisture_0_to_7cm&timezone=auto&forecast_days=7`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "User-Agent": "BRICS-Agri-Net-Weather/1.0",
      },
      next: { revalidate: 600 }, // Cache on server for 10 minutes
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`Open-Meteo HTTP error: ${res.status}, falling back to synthetic models`);
      return getFallbackWeather(latitude, longitude);
    }

    const data = await res.json();

    // Parse current observations
    const currentCode = data.current?.weather_code ?? 0;
    const decodedCurrent = decodeWmoCode(currentCode);

    // Grab latest hourly soil reading (index matches current hour in timezone)
    const currentHourIndex = Math.min(new Date().getHours(), 23);
    const rawSoilMoisture = data.hourly?.soil_moisture_0_to_7cm?.[currentHourIndex] ?? 0.185;
    // Open-Meteo volumetric soil water is in m³/m³ (e.g. 0.18 = 18%)
    const soilMoisturePercent = Math.round(rawSoilMoisture * 1000) / 10;
    const soilTempC = data.hourly?.soil_temperature_0_to_7cm?.[currentHourIndex] ?? (data.current?.temperature_2m || 28);

    // UV Index from daily max or fallback
    const uvIndex = data.daily?.uv_index_max?.[0] ?? 7;

    const current: WeatherCurrent = {
      temp: Math.round((data.current?.temperature_2m ?? 30) * 10) / 10,
      feelsLike: Math.round((data.current?.apparent_temperature ?? 32) * 10) / 10,
      humidity: data.current?.relative_humidity_2m ?? 45,
      precipitationMm: data.current?.precipitation ?? 0,
      rainMm: data.current?.rain ?? 0,
      weatherCode: currentCode,
      weatherText: decodedCurrent.text,
      conditionIcon: decodedCurrent.icon,
      windSpeedKmh: Math.round((data.current?.wind_speed_10m ?? 12) * 10) / 10,
      windDirectionDeg: data.current?.wind_direction_10m ?? 0,
      uvIndex: Math.round(uvIndex),
      soilMoisturePercent,
      soilTempC: Math.round(soilTempC * 10) / 10,
    };

    // Parse 7-day forecast
    const dailyTimes: string[] = data.daily?.time || [];
    const forecast: WeatherForecastDay[] = dailyTimes.map((timeStr: string, i: number) => {
      const dateObj = new Date(timeStr);
      const isToday = i === 0;
      const isTomorrow = i === 1;
      const dayName = isToday ? "Today" : isTomorrow ? "Tomorrow" : DAYS_SHORT[dateObj.getDay()];
      const dateFormatted = dateObj.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      const code = data.daily?.weather_code?.[i] ?? 0;
      const decoded = decodeWmoCode(code);

      return {
        date: dateFormatted,
        day: dayName,
        tempMax: Math.round(data.daily?.temperature_2m_max?.[i] ?? 32),
        tempMin: Math.round(data.daily?.temperature_2m_min?.[i] ?? 20),
        rainProb: Math.round(data.daily?.precipitation_probability_max?.[i] ?? 10),
        precipitationMm: Math.round((data.daily?.precipitation_sum?.[i] ?? 0) * 10) / 10,
        et0Mm: Math.round((data.daily?.et0_fao_evapotranspiration?.[i] ?? 4.5) * 10) / 10,
        uvIndexMax: Math.round(data.daily?.uv_index_max?.[i] ?? 7),
        weatherCode: code,
        weatherText: decoded.text,
        conditionIcon: decoded.icon,
      };
    });

    const agroRisks = computeAgroRisks(
      current.temp,
      current.humidity,
      current.windSpeedKmh,
      forecast[0]?.rainProb || 10,
      current.soilMoisturePercent,
      forecast[0]?.et0Mm || 4.5
    );

    return {
      isLive: true,
      station: {
        latitude: data.latitude,
        longitude: data.longitude,
        elevation: data.elevation || 0,
        timezone: data.timezone || "auto",
      },
      current,
      forecast,
      agroRisks,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Open-Meteo telemetry fetch failed, engaging high-fidelity fallback:", error);
    return getFallbackWeather(latitude, longitude);
  }
}
