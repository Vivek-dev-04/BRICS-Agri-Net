/**
 * Geospatial Soil & Region Telemetry Service
 * Automatically identifies soil classification and agro-climatic region
 * from farm latitude and longitude coordinates.
 */

export interface SoilInfo {
  soilType: string;
  soilNameEn: string;
  soilNameHi: string;
  descriptionEn: string;
  descriptionHi: string;
  drainage: string;
  organicMatter: string;
  bestSuitedCrops: string[];
}

export interface RegionInfo {
  region: string;
  state: string;
  district: string;
  agroZone: string;
}

/**
 * Determines soil type from coordinates using Indian and BRICS agro-pedological dataset
 */
export function inferSoilFromCoordinates(lat: number, lng: number): SoilInfo {
  // Western Arid Thar Desert (Jaisalmer, Barmer, Bikaner, Jodhpur, Nagaur)
  if (lat >= 24.0 && lat <= 30.5 && lng >= 69.0 && lng < 74.2) {
    return {
      soilType: "Arid Sandy",
      soilNameEn: "Arid Sandy Desert Soil (Thar Basin)",
      soilNameHi: "मरुस्थलीय रेतीली मिट्टी (थार क्षेत्र)",
      descriptionEn: "High permeability, very fast drainage, low moisture retention, highly responsive to drip irrigation.",
      descriptionHi: "कम नमी धारण क्षमता, त्वरित जल निकासी और खनिजों से भरपूर।",
      drainage: "Excessive / Fast",
      organicMatter: "Very Low (< 0.25%)",
      bestSuitedCrops: ["Mustard", "Bajra", "Pulses", "Guar", "Cumin"],
    };
  }

  // Central & Eastern Rajasthan Semi-Arid Belt (Jaipur, Ajmer, Sikar, Jhunjhunu, Tonk, Dausa, Alwar)
  if (lat >= 25.0 && lat <= 28.5 && lng >= 74.2 && lng <= 77.0) {
    return {
      soilType: "Sandy Loam",
      soilNameEn: "Semi-Arid Sandy Loam Soil (Jaipur Basin)",
      soilNameHi: "अर्ध-शुष्क बलुई दोमट मिट्टी (जयपुर-अजमेर क्षेत्र)",
      descriptionEn: "Permeable sandy loam texture with high potash reserves, moderate phosphorus, and low nitrogen/organic matter.",
      descriptionHi: "बलुई दोमट संरचना, पोटाश की अच्छी मात्रा, लेकिन नाइट्रोजन और जैविक कार्बन की कमी।",
      drainage: "Moderate to Fast",
      organicMatter: "Low to Moderate (0.35–0.45%)",
      bestSuitedCrops: ["Wheat", "Mustard", "Bajra", "Gram / Chickpea", "Guar"],
    };
  }

  // Northern Indo-Gangetic Alluvial Plains (Punjab, Haryana, UP, Bihar, WB basin: starts East of 77.0°E or North of 28.5°N)
  if ((lat >= 28.5 && lat <= 32.5 && lng >= 74.5 && lng <= 88.0) || (lat >= 24.5 && lat <= 28.5 && lng > 77.0 && lng <= 88.0)) {
    return {
      soilType: "Alluvial",
      soilNameEn: "Alluvial Soil (Indo-Gangetic Basin)",
      soilNameHi: "जलोढ़ मिट्टी (गंगा-सिंधु मैदानी भाग)",
      descriptionEn: "Highly fertile, rich in potash and humus. Deposited by Himalayan river systems.",
      descriptionHi: "अत्यधिक उपजाऊ, पोटाश और ह्यूमस से भरपूर। हिमालयी नदियों द्वारा निक्षेपित।",
      drainage: "Well Drained",
      organicMatter: "Medium to High",
      bestSuitedCrops: ["Wheat", "Rice", "Sugarcane", "Mustard", "Maize"],
    };
  }

  // Deccan Trap Black Regur Soils (Maharashtra, Madhya Pradesh, Gujarat, North Karnataka)
  if (lat >= 17.5 && lat <= 24.8 && lng >= 72.0 && lng <= 80.5) {
    return {
      soilType: "Black (Regur)",
      soilNameEn: "Black Regur Soil (Deccan Volcanic Trap)",
      soilNameHi: "काली / रेगुर मिट्टी (दक्कन लावा क्षेत्र)",
      descriptionEn: "Deep basaltic clay with extraordinary moisture retention. Ideal for cotton and pulses.",
      descriptionHi: "गहरी बेसाल्टिक मिट्टी, अद्भुत नमी धारण क्षमता। कपास और दालों के लिए सर्वोत्तम।",
      drainage: "Slow / Moisture Retentive",
      organicMatter: "High Clay Content",
      bestSuitedCrops: ["Cotton", "Soybean", "Wheat", "Gram / Pulses", "Sorghum"],
    };
  }

  // Southern Peninsular Red & Yellow Soils (Karnataka, Andhra Pradesh, Telangana, Tamil Nadu, Odisha)
  if (lat >= 11.5 && lat < 21.0 && lng >= 75.0 && lng <= 85.0) {
    return {
      soilType: "Red & Yellow",
      soilNameEn: "Red & Yellow Soil (Peninsular Shield)",
      soilNameHi: "लाल और पीली मिट्टी (प्रायद्वीपीय क्षेत्र)",
      descriptionEn: "Iron oxide-rich crystalline soil with friable structure and balanced aeration.",
      descriptionHi: "आयरन ऑक्साइड से समृद्ध, भुरभुरी संरचना और हवा का अच्छा प्रवाह।",
      drainage: "Moderate to Well Drained",
      organicMatter: "Medium",
      bestSuitedCrops: ["Groundnut", "Maize", "Ragi / Millets", "Pulses", "Oilseeds"],
    };
  }

  // Western Ghats & Coastal Laterite Soils
  if (lat >= 8.0 && lat <= 16.5 && (lng < 76.5 || lng > 83.5)) {
    return {
      soilType: "Laterite & Coastal Clay",
      soilNameEn: "Laterite Coastal Soil",
      soilNameHi: "लैटेराइट और तटीय चिकनी मिट्टी",
      descriptionEn: "Leached iron-aluminum rich soil found in heavy monsoon precipitation belts.",
      descriptionHi: "भारी वर्षा वाले क्षेत्रों में पाई जाने वाली लौह-एल्यूमीनियम युक्त मिट्टी।",
      drainage: "High Porosity",
      organicMatter: "Moderate",
      bestSuitedCrops: ["Rice / Paddy", "Coconut", "Spices", "Cashew", "Vegetables"],
    };
  }

  // Eastern Gangetic Delta & Brahmaputra (Assam, Bengal, Coastal Odisha)
  if (lng > 86.0 && lat >= 20.0 && lat <= 27.5) {
    return {
      soilType: "Deltaic Alluvial",
      soilNameEn: "Deltaic Alluvial & Heavy Clay",
      soilNameHi: "डेल्टाई जलोढ़ और चिकनी मिट्टी",
      descriptionEn: "Rich alluvial silts with high nutrient availability and water retention.",
      descriptionHi: "पोषक तत्वों से भरपूर उपजाऊ गाद और उच्च जल धारण क्षमता।",
      drainage: "Medium to Slow",
      organicMatter: "High",
      bestSuitedCrops: ["Rice / Paddy", "Jute", "Tea", "Mustard", "Vegetables"],
    };
  }

  // International BRICS Coordinates fallback:
  // Brazil (Cerrado / Southern Agriculture)
  if (lat < 0 && lng < -30) {
    return {
      soilType: "Oxisol (Ferralsol)",
      soilNameEn: "Tropical Oxisol Soil (Cerrado Basin)",
      soilNameHi: "ऑक्सीसोल मिट्टी (ब्राजील कृषि बेसिन)",
      descriptionEn: "Deep, well-drained tropical clay soil characteristic of the Brazilian agricultural savannah.",
      descriptionHi: "गहरी, अच्छी जल निकासी वाली उष्णकटिबंधीय मिट्टी।",
      drainage: "Well Drained",
      organicMatter: "Medium",
      bestSuitedCrops: ["Soybean", "Maize", "Coffee", "Sugarcane"],
    };
  }

  // Russia (Steppe / Chernozem Black Earth)
  if (lat > 45 && lng > 25) {
    return {
      soilType: "Chernozem (Black Earth)",
      soilNameEn: "Chernozem Black Earth Soil",
      soilNameHi: "चेर्नोज़ेम / ब्लैक अर्थ मिट्टी (रूस स्टेपी)",
      descriptionEn: "Extremely fertile black humus soil with world-renowned natural fertility.",
      descriptionHi: "अत्यधिक उपजाऊ प्राकृतिक काली मिट्टी, गेहूं के लिए विश्व प्रसिद्ध।",
      drainage: "Balanced",
      organicMatter: "Very High",
      bestSuitedCrops: ["Wheat", "Barley", "Sunflower", "Sugar Beet"],
    };
  }

  // General Balanced Agricultural Loam Fallback
  return {
    soilType: "Alluvial Loam",
    soilNameEn: "Fertile Agricultural Loam",
    soilNameHi: "उपजाऊ कृषि दोमट मिट्टी",
    descriptionEn: "Balanced sand, silt, and clay proportions supporting diverse multi-crop rotations.",
    descriptionHi: "रेत, गाद और मिट्टी का संतुलित अनुपात, बहु-फसली चक्र के लिए उपयुक्त।",
    drainage: "Well Drained",
    organicMatter: "Medium to High",
    bestSuitedCrops: ["Wheat", "Rice", "Maize", "Pulses", "Vegetables"],
  };
}

/**
 * Determines agro-climatic region from coordinates
 */
export function inferRegionFromCoordinates(lat: number, lng: number): RegionInfo {
  // Approximate State & Agro-Climatic Zone Mapping
  if (lat >= 29.5 && lat <= 32.5 && lng >= 74.0 && lng <= 77.0) {
    return {
      state: "Punjab",
      district: "Ludhiana Zone",
      region: "Ludhiana Zone, Punjab",
      agroZone: "Trans-Gangetic Plains Region",
    };
  }

  if (lat >= 27.5 && lat < 30.5 && lng >= 76.0 && lng <= 78.5) {
    return {
      state: "Haryana",
      district: "Karnal / Rohtak Zone",
      region: "Karnal Zone, Haryana",
      agroZone: "Trans-Gangetic Plains Region",
    };
  }

  if (lat >= 25.0 && lat < 30.5 && lng >= 77.0 && lng <= 84.5) {
    return {
      state: "Uttar Pradesh",
      district: "Central Gangetic Plains",
      region: "Central Gangetic Plains, Uttar Pradesh",
      agroZone: "Upper & Middle Gangetic Plains",
    };
  }

  if (lat >= 24.0 && lat <= 30.0 && lng >= 69.5 && lng < 76.5) {
    return {
      state: "Rajasthan",
      district: "Jaipur / Marwar Zone",
      region: "Jaipur Zone, Rajasthan",
      agroZone: "Western Dry Region",
    };
  }

  if (lat >= 20.0 && lat <= 24.5 && lng >= 69.0 && lng <= 74.5) {
    return {
      state: "Gujarat",
      district: "Saurashtra / Anand Zone",
      region: "Anand Zone, Gujarat",
      agroZone: "Gujarat Plains and Hills",
    };
  }

  if (lat >= 21.0 && lat <= 26.5 && lng >= 74.0 && lng <= 82.5) {
    return {
      state: "Madhya Pradesh",
      district: "Malwa / Narmada Valley",
      region: "Malwa Zone, Madhya Pradesh",
      agroZone: "Central Plateau and Hills",
    };
  }

  if (lat >= 16.0 && lat <= 21.5 && lng >= 72.5 && lng <= 80.5) {
    return {
      state: "Maharashtra",
      district: "Vidarbha / Marathwada Zone",
      region: "Vidarbha Zone, Maharashtra",
      agroZone: "Western Plateau and Hills",
    };
  }

  if (lat >= 11.5 && lat <= 18.5 && lng >= 74.0 && lng <= 78.5) {
    return {
      state: "Karnataka",
      district: "Deccan Southern Zone",
      region: "Southern Zone, Karnataka",
      agroZone: "Southern Plateau and Hills",
    };
  }

  if (lat >= 13.0 && lat <= 19.5 && lng >= 77.0 && lng <= 84.5) {
    return {
      state: "Andhra Pradesh",
      district: "Coastal Andhra Zone",
      region: "Coastal Andhra Zone, Andhra Pradesh",
      agroZone: "East Coast Plains and Hills",
    };
  }

  if (lat >= 8.5 && lat <= 13.5 && lng >= 76.5 && lng <= 80.5) {
    return {
      state: "Tamil Nadu",
      district: "Cauvery Delta Zone",
      region: "Cauvery Delta, Tamil Nadu",
      agroZone: "Southern Plains and Coastal Zone",
    };
  }

  if (lat >= 8.5 && lat <= 12.8 && lng >= 74.8 && lng <= 77.5) {
    return {
      state: "Kerala",
      district: "Malabar / Travancore Zone",
      region: "Malabar Zone, Kerala",
      agroZone: "West Coast Plains and Ghats",
    };
  }

  if (lat >= 21.5 && lat <= 27.5 && lng >= 83.5 && lng <= 88.5) {
    return {
      state: "Bihar / West Bengal",
      district: "Lower Gangetic Delta",
      region: "Lower Gangetic Delta",
      agroZone: "Lower Gangetic Plains",
    };
  }

  // Default coordinate location description
  return {
    state: "India (National Grid)",
    district: `Agro-Grid [${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E]`,
    region: `Farm Grid ${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`,
    agroZone: "National Agro-Climatic Grid",
  };
}

/**
 * Attempts real-time reverse geocoding with fast timeout and reliable fallback
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lng: number
): Promise<RegionInfo> {
  const fallback = inferRegionFromCoordinates(lat, lng);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const state = data.principalSubdivision || fallback.state;
      const district = data.city || data.locality || fallback.district;
      const region = `${district}, ${state}`;

      return {
        state,
        district,
        region,
        agroZone: fallback.agroZone,
      };
    }
  } catch {
    // Graceful fallback to agro-pedological dataset
  }

  return fallback;
}
