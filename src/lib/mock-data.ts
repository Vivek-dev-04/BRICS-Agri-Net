export interface DemoFarm {
  id: string;
  name: string;
  owner: string;
  location: string;
  country: "IN" | "BR" | "RU" | "CN" | "ZA";
  latitude: number;
  longitude: number;
  areaAcres: number;
  crop: string;
  cropVariety: string;
  sowingDate: string;
  irrigationType: string;
  soilType: string;
}

export const DEMO_FARM: DemoFarm = {
  id: "farm-in-001",
  name: "Ram Singh Farm",
  owner: "Ram Singh",
  location: "Jaipur, Rajasthan, India",
  country: "IN",
  latitude: 26.9124,
  longitude: 75.7873,
  areaAcres: 2.5,
  crop: "Wheat",
  cropVariety: "Sharbati HD-2967",
  sowingDate: "2026-11-15",
  irrigationType: "Drip Irrigation",
  soilType: "Loamy Sand",
};

export const DEMO_HEALTH_SCORES = {
  overallHealth: 72,
  weatherRisk: "Moderate",
  weatherRiskScore: 65,
  soilHealth: 68,
  cropHealth: 74,
  diseaseRisk: "Low",
  diseaseRiskScore: 88,
  ndviCurrent: 0.61,
  activeAlerts: [
    {
      id: "alt-1",
      severity: "warning",
      title: "Water Stress Risk Detected",
      message: "Low rainfall probability (12%) over next 48 hours. Consider drip irrigation cycle.",
    },
    {
      id: "alt-2",
      severity: "info",
      title: "Leaf Rust Warning in Neighboring Block",
      message: "Elevated morning humidity (84%) increases fungal spore susceptibility for Sharbati wheat.",
    },
  ],
};

export const DEMO_WEATHER = {
  current: {
    temp: 31,
    feelsLike: 33,
    humidity: 41,
    rainfallMm: 0.2,
    windSpeedKmh: 14,
    condition: "Sunny / Part Cloud",
    uvIndex: 7,
  },
  forecast: [
    { day: "Mon", tempMax: 32, tempMin: 19, rainProb: 10, rainfall: 0 },
    { day: "Tue", tempMax: 33, tempMin: 20, rainProb: 12, rainfall: 0 },
    { day: "Wed", tempMax: 31, tempMin: 18, rainProb: 35, rainfall: 2.1 },
    { day: "Thu", tempMax: 29, tempMin: 18, rainProb: 60, rainfall: 8.4 },
    { day: "Fri", tempMax: 30, tempMin: 19, rainProb: 20, rainfall: 0.5 },
  ],
};

export const DEMO_NDVI_SERIES = [
  { date: "Oct 15", ndvi: 0.32, benchmark: 0.35, stage: "Emergence" },
  { date: "Nov 01", ndvi: 0.48, benchmark: 0.50, stage: "Tillering" },
  { date: "Nov 15", ndvi: 0.65, benchmark: 0.68, stage: "Jointing" },
  { date: "Dec 01", ndvi: 0.72, benchmark: 0.74, stage: "Booting" },
  { date: "Dec 15", ndvi: 0.68, benchmark: 0.76, stage: "Heading" },
  { date: "Current", ndvi: 0.61, benchmark: 0.75, stage: "Grain Filling (Stress)" },
];

export const DEMO_SOIL = {
  nitrogen: { value: 180, status: "LOW", unit: "kg/ha", optimal: "280-560" },
  phosphorus: { value: 18, status: "MEDIUM", unit: "kg/ha", optimal: "15-25" },
  potassium: { value: 310, status: "HIGH", unit: "kg/ha", optimal: "150-280" },
  ph: { value: 7.1, status: "OPTIMAL", unit: "pH", optimal: "6.5-7.5" },
  organicCarbon: { value: 0.42, status: "LOW", unit: "%", optimal: "> 0.75%" },
  moisture: { value: 18.5, status: "DEFICIT", unit: "%", optimal: "25-35%" },
};

export const DEMO_ADVISORY = {
  id: "adv-2026-0929",
  generatedAt: "2026-09-29T08:30:00Z",
  crop: "Wheat (Sharbati HD-2967)",
  cropHealthStatus: "Moderate Stress Detected (NDVI 0.61 vs 0.75 Baseline)",
  irrigation: {
    urgency: "High",
    recommendation: "Apply 30-35mm drip irrigation within the next 24-48 hours. Rainfall probability is low (12%) and root zone moisture has depleted to 18.5%.",
  },
  soil: {
    urgency: "Medium",
    recommendation: "Nitrogen index is low (180 kg/ha). Apply split dose of urea (25 kg/acre) or organic compost tea prior to upcoming irrigation.",
  },
  diseaseRisk: {
    urgency: "Moderate",
    recommendation: "Monitor for Wheat Leaf Rust symptoms (orange-brown pustules on upper leaf surface). Prolonged morning dew and 28-32°C temps favor spore germination.",
  },
  regenerative: {
    urgency: "Proactive",
    recommendation: "Incorporate wheat straw residue retention (avoid stubble burning) and prepare green manure or chickpea legume intercropping for soil organic carbon restoration.",
  },
};

export const DEMO_DISEASE_DIAGNOSIS = {
  diseaseName: "Wheat Leaf Rust (Puccinia triticina)",
  confidence: 0.92,
  severity: "Moderate",
  symptoms: "Scattered circular to oval orange-brown pustules predominantly on leaf blades.",
  treatments: [
    "Apply bio-fungicide Bacillus subtilis or Trichoderma viride spray at 5g/L water early morning.",
    "If infection exceeds 5% field coverage, consider authorized triazole fungicide (e.g. Propiconazole 25% EC @ 1ml/L).",
  ],
  preventiveMeasures: [
    "Eradicate volunteer wheat plants around field borders.",
    "Adopt rust-resistant cultivars in subsequent sowing cycles.",
    "Ensure balanced potassium-to-nitrogen ratio to strengthen epidermal plant cell walls.",
  ],
};

export const DEMO_REGENERATIVE_PRACTICES = [
  {
    id: "reg-1",
    title: "Crop Residue Retention & Mulching",
    category: "Soil Health",
    description: "Retain 30% or more crop stubble post-harvest to preserve soil moisture and prevent thermal stress.",
    status: "Active",
    carbonImpact: "+0.35 t CO2e/acre/yr",
  },
  {
    id: "reg-2",
    title: "Chickpea (Legume) Crop Rotation",
    category: "Nutrient Cycling",
    description: "Rotate wheat with drought-tolerant Bengal gram to fix atmospheric nitrogen naturally.",
    status: "Planned",
    carbonImpact: "+0.22 t CO2e/acre/yr",
  },
  {
    id: "reg-3",
    title: "Conservation Tillage (Zero-Till)",
    category: "Erosion Control",
    description: "Minimize soil disturbance during sowing to build fungal mycorrhizal networks.",
    status: "Recommended",
    carbonImpact: "+0.40 t CO2e/acre/yr",
  },
  {
    id: "reg-4",
    title: "On-Farm Vermicomposting Unit",
    category: "Organic Matter",
    description: "Recycle cattle dung and crop residues to produce organic bio-fertilizer rich in micronutrients.",
    status: "Recommended",
    carbonImpact: "+0.18 t CO2e/acre/yr",
  },
];

export const DEMO_BRICS_COUNTRIES = [
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    majorCrop: "Wheat / Rice",
    climateRisk: "Medium",
    avgNdvi: 0.65,
    reportingFarms: 14200,
    topVulnerability: "Pre-monsoon heatwaves & groundwater depletion",
  },
  {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    majorCrop: "Soybean / Maize",
    climateRisk: "Medium",
    avgNdvi: 0.72,
    reportingFarms: 9800,
    topVulnerability: "Cerrado seasonal drought cycles",
  },
  {
    code: "RU",
    name: "Russia",
    flag: "🇷🇺",
    majorCrop: "Spring / Winter Wheat",
    climateRisk: "Low",
    avgNdvi: 0.68,
    reportingFarms: 7400,
    topVulnerability: "Early frost onset & soil permafrost dynamics",
  },
  {
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    majorCrop: "Paddy Rice / Corn",
    climateRisk: "High",
    avgNdvi: 0.70,
    reportingFarms: 21500,
    topVulnerability: "Yangtze basin unseasonal flash flooding",
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    majorCrop: "White Maize / Citrus",
    climateRisk: "High",
    avgNdvi: 0.54,
    reportingFarms: 4600,
    topVulnerability: "El Niño severe precipitation deficits",
  },
];
