/**
 * LocalStorage Database Engine for BRICS Agri-Net
 * Provides persistent client-side database storage for:
 * 1. Farmers / Users (Mobile, Name, Password)
 * 2. Farms (GPS Coordinates, Land Acreage, Primary Crop, Soil)
 * 3. Soil Telemetry (NPK, pH, Moisture, Organic Carbon, Soil Quality Score)
 * 4. Active Auth Session
 */

export interface StoredUser {
  id: string;
  name: string;
  mobile: string;
  password?: string;
  country: "IN" | "BR" | "RU" | "CN" | "ZA";
  region: string;
  createdAt: string;
}

export interface StoredFarm {
  id: string;
  userId: string;
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
  createdAt: string;
}

export interface StoredSoilData {
  farmId: string;
  soilType: string;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  ph: number;
  organicCarbon: number; // %
  moisture: number; // %
  soilScore: number; // 0 - 100
  status: string;
  updatedAt: string;
}

export interface StoredDiseaseRecord {
  id: string;
  farmId: string;
  crop: string;
  diseaseName: string;
  scientificName?: string;
  severity: "Low" | "Moderate" | "High" | "Critical";
  confidence: number;
  isHealthy: boolean;
  symptoms: string;
  organicRemedy: string;
  chemicalRemedy: string;
  engine: string;
  diagnosedAt: string;
  status: "Under Observation" | "Remedy Applied" | "Resolved";
  notes?: string;
}

export interface FarmerPostComment {
  id: string;
  author: string;
  country: "IN" | "BR" | "RU" | "CN" | "ZA";
  region: string;
  content: string;
  createdAt: string;
}

export interface StoredFarmerPost {
  id: string;
  authorName: string;
  country: "IN" | "BR" | "RU" | "CN" | "ZA";
  region: string;
  cropFocus: string;
  category: "Regenerative" | "Water Conservation" | "Pest & Disease" | "Soil Health" | "Equipment & IoT";
  title: string;
  content: string;
  cadRefId?: string;
  upvotes: number;
  userUpvoted?: boolean;
  comments: FarmerPostComment[];
  tags: string[];
  metrics?: {
    waterSavedPercent?: number;
    yieldChangePercent?: number;
    chemicalReductionPercent?: number;
    costSavedPerHa?: string;
  };
  createdAt: string;
}

// Initial Seed Data for Demo Farmer
const DEFAULT_USER: StoredUser = {
  id: "farmer-001",
  name: "Ram Singh",
  mobile: "9876543210",
  password: "password123",
  country: "IN",
  region: "Jaipur Zone, Rajasthan",
  createdAt: "2026-01-15T00:00:00.000Z",
};

const DEFAULT_FARM: StoredFarm = {
  id: "farm-in-001",
  userId: "farmer-001",
  name: "Ram Singh Farm",
  owner: "Ram Singh",
  location: "Jaipur Zone, Rajasthan, India",
  country: "IN",
  latitude: 26.9124,
  longitude: 75.7873,
  areaAcres: 4.5,
  crop: "Wheat",
  cropVariety: "Sharbati HD-2967",
  sowingDate: "2026-11-15",
  irrigationType: "Drip Irrigation",
  soilType: "Sandy Loam",
  createdAt: "2026-01-15T00:00:00.000Z",
};

const DEFAULT_DISEASE_RECORDS: StoredDiseaseRecord[] = [
  {
    id: "diag-in-001",
    farmId: "farm-in-001",
    crop: "Wheat",
    diseaseName: "Wheat Brown/Leaf Rust (Puccinia triticina)",
    scientificName: "Puccinia triticina",
    severity: "Moderate",
    confidence: 0.94,
    isHealthy: false,
    symptoms: "Scattered circular to oval orange-brown powdery pustules on upper leaf blades.",
    organicRemedy: "Foliar spray of 5% Neem Seed Kernel Extract (NSKE) or sour buttermilk (1L in 15L water).",
    chemicalRemedy: "Propiconazole 25% EC @ 1ml per liter of water during early morning calm conditions.",
    engine: "Google Gemini 2.5 Flash Vision",
    diagnosedAt: "2026-09-28T09:30:00.000Z",
    status: "Remedy Applied",
    notes: "Applied 5% NSKE on 2 acres border zone; pustule spread stopped.",
  },
];

export const DEFAULT_FARMER_POSTS: StoredFarmerPost[] = [
  {
    id: "post-br-001",
    authorName: "Mateo Silva",
    country: "BR",
    region: "Mato Grosso, Cerrado Biome",
    cropFocus: "Soybean & Brachiaria",
    category: "Regenerative",
    title: "Intercropping Brachiaria ruziziensis with late-season soy to rebuild Cerrado Oxisol",
    content: "After two consecutive seasons of dry spells in Mato Grosso, we broadcast Brachiaria seed immediately after soybean canopy closing. Root biomass penetrated 1.4m into compacted red oxisol. Soil organic carbon climbed from 0.8% to 1.35% in 18 months, reducing soil surface temperature by 4.2 C during peak noon heat. CADS soil telemetry shared openly with EMBRAPA network.",
    cadRefId: "CADS-BR-MT-2026-8812",
    upvotes: 42,
    userUpvoted: false,
    tags: ["DirectSeeding", "CoverCrops", "Cerrado", "EMBRAPA-CADS"],
    metrics: {
      chemicalReductionPercent: 25,
      yieldChangePercent: 12,
      costSavedPerHa: "$64/ha",
    },
    comments: [
      {
        id: "cm-001",
        author: "Ram Singh",
        country: "IN",
        region: "Rajasthan",
        content: "Mateo, what was your seeding rate per hectare for Brachiaria ruziziensis? We are testing similar deep-rooting grasses in semi-arid soils.",
        createdAt: "2026-09-29T14:20:00.000Z",
      },
      {
        id: "cm-002",
        author: "Mateo Silva",
        country: "BR",
        region: "Mato Grosso",
        content: "Ram, we calibrated at 7.5 kg/ha of coated seed with 80% cultural value, broadcast prior to leaf fall.",
        createdAt: "2026-09-29T16:05:00.000Z",
      },
    ],
    createdAt: "2026-09-29T10:15:00.000Z",
  },
  {
    id: "post-in-001",
    authorName: "Ram Singh",
    country: "IN",
    region: "Jaipur Zone, Rajasthan",
    cropFocus: "Mustard & Chickpea",
    category: "Water Conservation",
    title: "Solar deficit drip schedule with sub-surface mulch cut tube well pumping by 41%",
    content: "Implemented deficit irrigation cycle keyed to ICAR Penman-Monteith advisory. Combined laser land leveling with dry mustard residue mulch (3 tons/ha). Tube well run time dropped from 6 hours to 3.5 hours per irrigation cycle without any pod abortion. Electrical draw and aquifer stress significantly mitigated.",
    cadRefId: "CADS-IN-RJ-2026-1049",
    upvotes: 56,
    userUpvoted: false,
    tags: ["DeficitIrrigation", "LaserLeveling", "ICAR-Model", "Mustard"],
    metrics: {
      waterSavedPercent: 41,
      costSavedPerHa: "Rs 4,200/ha",
    },
    comments: [
      {
        id: "cm-003",
        author: "Thabo Ndlovu",
        country: "ZA",
        region: "Free State",
        content: "Sub-surface mulch is essential here too. How do you manage residue clogging during secondary furrow passes?",
        createdAt: "2026-09-29T18:40:00.000Z",
      },
    ],
    createdAt: "2026-09-29T08:30:00.000Z",
  },
  {
    id: "post-cn-001",
    authorName: "Wang Wei",
    country: "CN",
    region: "Heilongjiang Province",
    cropFocus: "Japonica Paddy Rice",
    category: "Pest & Disease",
    title: "Solar spore trap combined with CAAS canopy microclimate alert averted Rice Blast",
    content: "Following CAAS canopy microclimate warning, spore count exceeded 45 spores/m3 when relative humidity hovered above 92%. We triggered Trichoderma bio-fungicide 48 hours prior to leaf symptom manifestation. Blast lesion incidence held under 1.2% across 22 hectares without any synthetic azoxystrobin spray.",
    cadRefId: "CADS-CN-HLJ-2026-3390",
    upvotes: 38,
    userUpvoted: false,
    tags: ["Biocontrol", "RiceBlast", "CAAS-Telemetry", "Trichoderma"],
    metrics: {
      chemicalReductionPercent: 70,
      yieldChangePercent: 14,
    },
    comments: [],
    createdAt: "2026-09-28T16:45:00.000Z",
  },
  {
    id: "post-ru-001",
    authorName: "Dmitry Ivanov",
    country: "RU",
    region: "Rostov-on-Don, Southern Federal District",
    cropFocus: "Winter Wheat (Skipter)",
    category: "Soil Health",
    title: "Zero-till stubble retention buffering Chernozem against winter desiccating winds",
    content: "Maintaining 28cm standing stubble over winter trapped 180mm snow equivalent. Soil moisture at 40cm depth is 34% higher compared to conventionally disced adjacent fields. Ready to share soil sensor log in CADS v1.0 standard with BRICS winter crop workgroup.",
    cadRefId: "CADS-RU-ROS-2026-4011",
    upvotes: 31,
    userUpvoted: false,
    tags: ["ZeroTill", "Chernozem", "SnowTrapping", "WinterWheat"],
    metrics: {
      waterSavedPercent: 34,
      yieldChangePercent: 9,
      costSavedPerHa: "1,850 RUB/ha",
    },
    comments: [],
    createdAt: "2026-09-28T11:20:00.000Z",
  },
  {
    id: "post-za-001",
    authorName: "Thabo Ndlovu",
    country: "ZA",
    region: "Free State, Highveld",
    cropFocus: "White Maize & Cowpea",
    category: "Regenerative",
    title: "Strip-tillage with indigenous cowpea nitrogen fixing in sandy highveld soils",
    content: "Replaced blanket harrowing with in-row ripping and cowpea companion rows. Reduced synthetic urea requirement from 140 kg/ha to 85 kg/ha while maintaining 6.8 t/ha yield despite late December dry spell. Biological nodulation verified at 45 nodules/plant.",
    cadRefId: "CADS-ZA-FS-2026-6122",
    upvotes: 29,
    userUpvoted: false,
    tags: ["StripTill", "BiologicalN2", "ARC-Model", "Maize"],
    metrics: {
      chemicalReductionPercent: 39,
      costSavedPerHa: "R 1,450/ha",
    },
    comments: [],
    createdAt: "2026-09-27T15:10:00.000Z",
  },
];

const STORAGE_KEYS = {
  USERS: "brics_users_db",
  FARMS: "brics_farms_db",
  SOIL: "brics_soil_db",
  DISEASE: "brics_disease_db",
  POSTS: "brics_farmer_posts_db",
  ACTIVE_USER_ID: "brics_active_user_id",
  ACTIVE_FARM_ID: "brics_active_farm_id",
  AUTH_STATUS: "brics_auth",
  IS_CLEARED: "brics_db_cleared",
};

/**
 * Calculates dynamic chemical and fertility profile from soil type and coordinates
 */
import { getPedologicalProfile } from "@/lib/services/soilService";

export function generateSoilMetrics(soilType: string, lat?: number, lon?: number): StoredSoilData {
  if (typeof lat === "number" && typeof lon === "number" && !isNaN(lat) && !isNaN(lon)) {
    const pedology = getPedologicalProfile(lat, lon);
    return {
      farmId: "",
      soilType: pedology.soilNameEn,
      nitrogen: pedology.n,
      phosphorus: pedology.p,
      potassium: pedology.k,
      ph: pedology.ph,
      organicCarbon: pedology.oc,
      moisture: 18,
      soilScore: pedology.score,
      status: pedology.statusHeadline,
      updatedAt: new Date().toISOString(),
    };
  }

  const normalized = soilType.toLowerCase();

  if (normalized.includes("sandy") || normalized.includes("arid") || normalized.includes("desert")) {
    return {
      farmId: "",
      soilType: "Semi-Arid Sandy Loam",
      nitrogen: 165,
      phosphorus: 16,
      potassium: 290,
      ph: 7.8,
      organicCarbon: 0.38,
      moisture: 18,
      soilScore: 64,
      status: "Nitrogen Deficit & Low Organic Matter (Semi-Arid Loam)",
      updatedAt: new Date().toISOString(),
    };
  }

  if (normalized.includes("alluvial")) {
    return {
      farmId: "",
      soilType: "Alluvial Soil",
      nitrogen: 235,
      phosphorus: 24,
      potassium: 310,
      ph: 7.2,
      organicCarbon: 0.65,
      moisture: 28,
      soilScore: 82,
      status: "High Natural Fertility (Optimal NPK Balance)",
      updatedAt: new Date().toISOString(),
    };
  }

  if (normalized.includes("black") || normalized.includes("regur")) {
    return {
      farmId: "",
      soilType: "Black (Regur) Soil",
      nitrogen: 205,
      phosphorus: 18,
      potassium: 340,
      ph: 8.0,
      organicCarbon: 0.55,
      moisture: 38,
      soilScore: 78,
      status: "Exceptional Moisture Retention (Deep Montmorillonite Clay)",
      updatedAt: new Date().toISOString(),
    };
  }

  if (normalized.includes("red")) {
    return {
      farmId: "",
      soilType: "Red & Yellow Soil",
      nitrogen: 180,
      phosphorus: 15,
      potassium: 220,
      ph: 6.4,
      organicCarbon: 0.48,
      moisture: 24,
      soilScore: 74,
      status: "Iron Oxide Rich (Good Aeration, Needs Organic Mulch)",
      updatedAt: new Date().toISOString(),
    };
  }

  // Default balanced agricultural loam
  return {
    farmId: "",
    soilType: "Agricultural Loam",
    nitrogen: 215,
    phosphorus: 22,
    potassium: 260,
    ph: 7.0,
    organicCarbon: 0.55,
    moisture: 28,
    soilScore: 78,
    status: "Balanced Medium Loam (Good Crop Adaptability)",
    updatedAt: new Date().toISOString(),
  };
}

class LocalStorageDatabase {
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  /**
   * Initializes database. If auto-wiped or cleared, leaves tables empty.
   */
  public init(): void {
    if (!this.isBrowser()) return;

    // Automatic migration to wipe all previous data per user request
    const WIPE_FLAG = "brics_auto_wiped_v3";
    if (localStorage.getItem(WIPE_FLAG) !== "true") {
      localStorage.setItem(WIPE_FLAG, "true");
      this.clearAll();
      return;
    }

    if (localStorage.getItem(STORAGE_KEYS.IS_CLEARED) === "true") {
      return;
    }

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.FARMS)) {
      localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SOIL)) {
      localStorage.setItem(STORAGE_KEYS.SOIL, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.DISEASE)) {
      localStorage.setItem(STORAGE_KEYS.DISEASE, JSON.stringify(DEFAULT_DISEASE_RECORDS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(DEFAULT_FARMER_POSTS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.AUTH_STATUS)) {
      localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, "false");
    }
  }

  // -------------------------------------------------------------
  // USERS REPOSITORY
  // -------------------------------------------------------------
  public getUsers(): StoredUser[] {
    if (!this.isBrowser()) return [];
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public findUserByMobile(mobile: string): StoredUser | undefined {
    const cleanMobile = mobile.replace(/\D/g, "");
    return this.getUsers().find((u) => u.mobile.replace(/\D/g, "") === cleanMobile);
  }

  public saveUser(user: StoredUser): void {
    if (!this.isBrowser()) return;
    const users = this.getUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id || u.mobile === user.mobile);
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // -------------------------------------------------------------
  // FARMS REPOSITORY
  // -------------------------------------------------------------
  public getFarms(): StoredFarm[] {
    if (!this.isBrowser()) return [];
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FARMS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getFarmById(farmId: string): StoredFarm | undefined {
    return this.getFarms().find((f) => f.id === farmId);
  }

  public getFarmsByUserId(userId?: string, userName?: string): StoredFarm[] {
    const all = this.getFarms();
    if (all.length === 0) return [];

    const cleanUserId = (userId || "").trim();
    const cleanUserName = (userName || "").toLowerCase().trim();

    // Direct match by userId or owner
    const userFarms = all.filter((f) => {
      if (cleanUserId && f.userId && f.userId.trim() === cleanUserId) return true;
      if (cleanUserName && f.owner) {
        const o = f.owner.toLowerCase().trim();
        if (o === cleanUserName) return true;
        // Never match default seed farmer (Ram Singh) unless user is Ram Singh
        if (cleanUserName !== DEFAULT_USER.name.toLowerCase() && o === DEFAULT_USER.name.toLowerCase()) {
          return false;
        }
        if (cleanUserName.includes(o) || o.includes(cleanUserName)) {
          return true;
        }
      }
      return false;
    });

    if (userFarms.length > 0) return userFarms;

    // If it's the demo seed farmer (farmer-001 / Ram Singh) and farm actually exists in database
    if (cleanUserId === DEFAULT_USER.id || cleanUserName === DEFAULT_USER.name.toLowerCase()) {
      const demoFarm = all.find((f) => f.id === DEFAULT_FARM.id);
      if (demoFarm) return [demoFarm];
    }

    return [];
  }

  public saveFarm(farm: StoredFarm): void {
    if (!this.isBrowser()) return;
    const farms = this.getFarms();
    const existingIndex = farms.findIndex((f) => f.id === farm.id);
    if (existingIndex >= 0) {
      farms[existingIndex] = { ...farms[existingIndex], ...farm };
    } else {
      farms.unshift(farm);
    }
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(farms));

    // Also update/generate matching soil telemetry in localStorage
    const soil = generateSoilMetrics(farm.soilType, farm.latitude, farm.longitude);
    soil.farmId = farm.id;
    this.saveSoilData(soil);
  }

  // -------------------------------------------------------------
  // SOIL REPOSITORY
  // -------------------------------------------------------------
  public getSoilRecords(): StoredSoilData[] {
    if (!this.isBrowser()) return [];
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SOIL);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getSoilByFarmId(farmId: string): StoredSoilData {
    const records = this.getSoilRecords();
    const match = records.find((s) => s.farmId === farmId);
    if (match) return match;

    // Fallback: look up farm soil type or generate with coordinates
    const farm = this.getFarmById(farmId);
    const generated = generateSoilMetrics(
      farm ? farm.soilType : "Semi-Arid Sandy Loam",
      farm?.latitude,
      farm?.longitude
    );
    generated.farmId = farmId;
    return generated;
  }

  public saveSoilData(soil: StoredSoilData): void {
    if (!this.isBrowser()) return;
    const records = this.getSoilRecords();
    const existingIndex = records.findIndex((s) => s.farmId === soil.farmId);
    if (existingIndex >= 0) {
      records[existingIndex] = { ...records[existingIndex], ...soil };
    } else {
      records.push(soil);
    }
    localStorage.setItem(STORAGE_KEYS.SOIL, JSON.stringify(records));
  }

  // -------------------------------------------------------------
  // DISEASE PATHOLOGY REPOSITORY
  // -------------------------------------------------------------
  public getDiseaseRecords(farmId?: string): StoredDiseaseRecord[] {
    if (!this.isBrowser()) return [];
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISEASE);
      const records: StoredDiseaseRecord[] = data ? JSON.parse(data) : [];
      if (farmId) {
        return records.filter((r) => r.farmId === farmId);
      }
      return records;
    } catch {
      return [];
    }
  }

  public saveDiseaseRecord(record: StoredDiseaseRecord): void {
    if (!this.isBrowser()) return;
    this.init();
    const records = this.getDiseaseRecords();
    const existingIndex = records.findIndex((r) => r.id === record.id);
    if (existingIndex >= 0) {
      records[existingIndex] = { ...records[existingIndex], ...record };
    } else {
      records.unshift(record);
    }
    localStorage.setItem(STORAGE_KEYS.DISEASE, JSON.stringify(records));
  }

  public updateDiseaseRecordStatus(id: string, status: StoredDiseaseRecord["status"]): void {
    if (!this.isBrowser()) return;
    const records = this.getDiseaseRecords();
    const match = records.find((r) => r.id === id);
    if (match) {
      match.status = status;
      localStorage.setItem(STORAGE_KEYS.DISEASE, JSON.stringify(records));
    }
  }

  public deleteDiseaseRecord(id: string): void {
    if (!this.isBrowser()) return;
    const records = this.getDiseaseRecords().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.DISEASE, JSON.stringify(records));
  }

  // -------------------------------------------------------------
  // BRICS FARMER COMMONS REPOSITORY
  // -------------------------------------------------------------
  public getFarmerPosts(filter?: { country?: string; category?: string; search?: string }): StoredFarmerPost[] {
    if (!this.isBrowser()) return DEFAULT_FARMER_POSTS;
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      let posts: StoredFarmerPost[] = data ? JSON.parse(data) : DEFAULT_FARMER_POSTS;
      if (!posts || posts.length === 0) {
        posts = DEFAULT_FARMER_POSTS;
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      }
      if (filter?.country && filter.country !== "ALL") {
        posts = posts.filter((p) => p.country === filter.country);
      }
      if (filter?.category && filter.category !== "ALL") {
        posts = posts.filter((p) => p.category === filter.category);
      }
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        posts = posts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            p.cropFocus.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return posts;
    } catch {
      return DEFAULT_FARMER_POSTS;
    }
  }

  public saveFarmerPost(
    post: Omit<StoredFarmerPost, "id" | "upvotes" | "comments" | "createdAt"> & { id?: string }
  ): StoredFarmerPost {
    const newPost: StoredFarmerPost = {
      id: post.id || `post-${Date.now().toString().slice(-6)}`,
      authorName: post.authorName,
      country: post.country,
      region: post.region,
      cropFocus: post.cropFocus,
      category: post.category,
      title: post.title,
      content: post.content,
      cadRefId: post.cadRefId,
      upvotes: 0,
      userUpvoted: false,
      comments: [],
      tags: post.tags || [],
      metrics: post.metrics,
      createdAt: new Date().toISOString(),
    };

    if (!this.isBrowser()) return newPost;
    this.init();
    const posts = this.getFarmerPosts();
    posts.unshift(newPost);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return newPost;
  }

  public togglePostUpvote(postId: string): StoredFarmerPost | null {
    if (!this.isBrowser()) return null;
    this.init();
    const posts = this.getFarmerPosts();
    const match = posts.find((p) => p.id === postId);
    if (!match) return null;

    if (match.userUpvoted) {
      match.upvotes = Math.max(0, match.upvotes - 1);
      match.userUpvoted = false;
    } else {
      match.upvotes += 1;
      match.userUpvoted = true;
    }
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return match;
  }

  public addPostComment(
    postId: string,
    comment: { author: string; country: "IN" | "BR" | "RU" | "CN" | "ZA"; region: string; content: string }
  ): StoredFarmerPost | null {
    if (!this.isBrowser()) return null;
    this.init();
    const posts = this.getFarmerPosts();
    const match = posts.find((p) => p.id === postId);
    if (!match) return null;

    const newComment: FarmerPostComment = {
      id: `cm-${Date.now().toString().slice(-5)}`,
      author: comment.author,
      country: comment.country,
      region: comment.region,
      content: comment.content,
      createdAt: new Date().toISOString(),
    };

    match.comments = match.comments || [];
    match.comments.push(newComment);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return match;
  }

  // -------------------------------------------------------------
  // AUTHENTICATION & ACTIVE SESSION
  // -------------------------------------------------------------
  public login(mobile: string, password?: string): { success: boolean; user?: StoredUser; error?: string } {
    if (!this.isBrowser()) return { success: false, error: "Browser environment required." };
    this.init();

    const cleanMobile = mobile.replace(/\D/g, "");
    const user = this.findUserByMobile(cleanMobile);

    if (!user) {
      return {
        success: false,
        error: "No farmer account found with this mobile number. Please register first.",
      };
    }

    if (password && user.password && user.password !== password) {
      return {
        success: false,
        error: "Incorrect password. Please verify your credentials and try again.",
      };
    }

    // Set active session in localStorage
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, user.id);
    localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, "true");

    // Match farm for this user strictly
    const userFarms = this.getFarmsByUserId(user.id, user.name);
    if (userFarms.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FARM_ID, userFarms[0].id);
    }

    return {
      success: true,
      user,
    };
  }

  public isMobileRegistered(mobile: string): { registered: boolean; name?: string } {
    const cleanMobile = mobile.replace(/\D/g, "");
    if (!cleanMobile) return { registered: false };
    const user = this.findUserByMobile(cleanMobile);
    if (user) {
      return { registered: true, name: user.name };
    }
    return { registered: false };
  }

  public register(payload: {
    name: string;
    mobile: string;
    password?: string;
    country: "IN" | "BR" | "RU" | "CN" | "ZA";
    region: string;
    farmName: string;
    latitude: number;
    longitude: number;
    areaAcres: number;
    crop: string;
    cropVariety?: string;
    sowingDate?: string;
    soilType: string;
    irrigationType?: string;
  }): { success: boolean; user?: StoredUser; farm?: StoredFarm; error?: string } {
    this.init();

    const cleanMobile = payload.mobile.replace(/\D/g, "");

    // STRICT CHECK: Reject if a farmer account with this mobile number already exists!
    const existingUser = this.findUserByMobile(cleanMobile);
    if (existingUser) {
      return {
        success: false,
        error: `A farmer account with mobile number +91 ${cleanMobile} (${existingUser.name}) is already registered. Please sign in instead.`,
      };
    }

    const userId = `farmer-${cleanMobile.slice(-4)}-${Date.now().toString().slice(-4)}`;
    const farmId = `farm-${payload.country.toLowerCase()}-${Date.now().toString().slice(-4)}`;

    const newUser: StoredUser = {
      id: userId,
      name: payload.name.trim(),
      mobile: cleanMobile,
      password: payload.password,
      country: payload.country,
      region: payload.region,
      createdAt: new Date().toISOString(),
    };

    const newFarm: StoredFarm = {
      id: farmId,
      userId: userId,
      name: payload.farmName || `${payload.name}'s Farm`,
      owner: payload.name.trim(),
      location: payload.region,
      country: payload.country,
      latitude: payload.latitude,
      longitude: payload.longitude,
      areaAcres: payload.areaAcres,
      crop: payload.crop,
      cropVariety: payload.cropVariety || "High-Yield Hybrid",
      sowingDate: payload.sowingDate || new Date().toISOString().split("T")[0],
      irrigationType: payload.irrigationType || "Canal",
      soilType: payload.soilType,
      createdAt: new Date().toISOString(),
    };

    // 1. Save user and farm to localStorage DB
    this.saveUser(newUser);
    this.saveFarm(newFarm);

    // 2. Set as active session
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, newUser.id);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FARM_ID, newFarm.id);
      localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, "true");
    }

    return { success: true, user: newUser, farm: newFarm };
  }

  public getActiveSession(): {
    user: StoredUser;
    farm: StoredFarm;
    soil: StoredSoilData;
    isAuthenticated: boolean;
  } {
    this.init();
    const users = this.getUsers();

    const activeUserId = this.isBrowser() ? localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID) : null;
    const activeFarmId = this.isBrowser() ? localStorage.getItem(STORAGE_KEYS.ACTIVE_FARM_ID) : null;
    const authStatus = this.isBrowser() ? localStorage.getItem(STORAGE_KEYS.AUTH_STATUS) === "true" : false;

    const user = (activeUserId ? users.find((u) => u.id === activeUserId) : null) || users[0] || DEFAULT_USER;
    const userFarms = this.getFarmsByUserId(user.id, user.name);
    const fallbackFarm: StoredFarm = {
      ...DEFAULT_FARM,
      id: `farm-${user.country.toLowerCase()}-${user.id.slice(-4)}`,
      userId: user.id,
      name: `${user.name}'s Farm`,
      owner: user.name,
      location: user.region,
    };
    const farm = userFarms.find((f) => f.id === activeFarmId) || userFarms[0] || (user.id === DEFAULT_USER.id ? DEFAULT_FARM : fallbackFarm);
    const soil = this.getSoilByFarmId(farm.id);

    return {
      user,
      farm,
      soil,
      isAuthenticated: authStatus,
    };
  }

  public setActiveFarm(farmId: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FARM_ID, farmId);
  }

  public logout(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, "false");
  }

  public clearAll(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SOIL, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DISEASE, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_FARM_ID);
    localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, "false");
    localStorage.setItem(STORAGE_KEYS.IS_CLEARED, "true");
  }

  public resetToDefaults(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEFAULT_USER]));
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify([DEFAULT_FARM]));
    const defaultSoil = generateSoilMetrics(DEFAULT_FARM.soilType);
    defaultSoil.farmId = DEFAULT_FARM.id;
    localStorage.setItem(STORAGE_KEYS.SOIL, JSON.stringify([defaultSoil]));
    localStorage.setItem(STORAGE_KEYS.DISEASE, JSON.stringify(DEFAULT_DISEASE_RECORDS));
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(DEFAULT_FARMER_POSTS));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, DEFAULT_USER.id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FARM_ID, DEFAULT_FARM.id);
    localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, "true");
    localStorage.removeItem(STORAGE_KEYS.IS_CLEARED);
  }
}

export const localDb = new LocalStorageDatabase();
