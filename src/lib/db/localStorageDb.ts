/**
 * LocalStorage Database Engine for BRICS Agri-Net
 * Provides persistent client-side database storage for:
 * 1. Farmers / Users (Mobile, Name, Password)
 * 2. Farms (GPS Coordinates, Land Acreage, Primary Crop, Soil)
 * 3. Soil Telemetry (NPK, pH, Moisture, Organic Carbon, Soil Quality Score)
 * 4. Active Auth Session
 */

import { inferSoilFromCoordinates } from "@/lib/auth/soilGeoService";

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

const STORAGE_KEYS = {
  USERS: "brics_users_db",
  FARMS: "brics_farms_db",
  SOIL: "brics_soil_db",
  ACTIVE_USER_ID: "brics_active_user_id",
  ACTIVE_FARM_ID: "brics_active_farm_id",
  AUTH_STATUS: "brics_auth",
};

/**
 * Calculates dynamic chemical and fertility profile from soil type and coordinates
 */
export function generateSoilMetrics(soilType: string): StoredSoilData {
  const normalized = soilType.toLowerCase();

  if (normalized.includes("alluvial")) {
    return {
      farmId: "",
      soilType: "Alluvial Soil",
      nitrogen: 245,
      phosphorus: 28,
      potassium: 310,
      ph: 7.2,
      organicCarbon: 0.68,
      moisture: 32,
      soilScore: 86,
      status: "High Natural Fertility (Optimal NPK Balance)",
      updatedAt: new Date().toISOString(),
    };
  }

  if (normalized.includes("black") || normalized.includes("regur")) {
    return {
      farmId: "",
      soilType: "Black (Regur) Soil",
      nitrogen: 210,
      phosphorus: 20,
      potassium: 340,
      ph: 7.9,
      organicCarbon: 0.58,
      moisture: 44,
      soilScore: 82,
      status: "Exceptional Moisture Retention (High Clay Potash)",
      updatedAt: new Date().toISOString(),
    };
  }

  if (normalized.includes("sandy")) {
    return {
      farmId: "",
      soilType: "Sandy Loam Soil",
      nitrogen: 165,
      phosphorus: 16,
      potassium: 195,
      ph: 8.1,
      organicCarbon: 0.35,
      moisture: 16,
      soilScore: 68,
      status: "Fast Draining (Moderate Nitrogen Deficit)",
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
   * Initializes database with seed records if empty
   */
  public init(): void {
    if (!this.isBrowser()) return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEFAULT_USER]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.FARMS)) {
      localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify([DEFAULT_FARM]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, DEFAULT_USER.id);
    }

    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_FARM_ID)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FARM_ID, DEFAULT_FARM.id);
    }

    if (!localStorage.getItem(STORAGE_KEYS.SOIL)) {
      const defaultSoil = generateSoilMetrics(DEFAULT_FARM.soilType);
      defaultSoil.farmId = DEFAULT_FARM.id;
      localStorage.setItem(STORAGE_KEYS.SOIL, JSON.stringify([defaultSoil]));
    }
  }

  // -------------------------------------------------------------
  // USERS REPOSITORY
  // -------------------------------------------------------------
  public getUsers(): StoredUser[] {
    if (!this.isBrowser()) return [DEFAULT_USER];
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [DEFAULT_USER];
    } catch {
      return [DEFAULT_USER];
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
    if (!this.isBrowser()) return [DEFAULT_FARM];
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FARMS);
      return data ? JSON.parse(data) : [DEFAULT_FARM];
    } catch {
      return [DEFAULT_FARM];
    }
  }

  public getFarmById(farmId: string): StoredFarm | undefined {
    return this.getFarms().find((f) => f.id === farmId);
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
    const soil = generateSoilMetrics(farm.soilType);
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

    // Fallback: look up farm soil type or generate
    const farm = this.getFarmById(farmId);
    const generated = generateSoilMetrics(farm ? farm.soilType : "Alluvial");
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

    // Match farm for this user or first available farm
    const userFarms = this.getFarms().filter((f) => f.userId === user.id);
    if (userFarms.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FARM_ID, userFarms[0].id);
    }

    return {
      success: true,
      user,
    };
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
  }): { user: StoredUser; farm: StoredFarm } {
    this.init();

    const userId = `farmer-${payload.mobile.slice(-4)}-${Date.now().toString().slice(-4)}`;
    const farmId = `farm-${payload.country.toLowerCase()}-${Date.now().toString().slice(-4)}`;

    const newUser: StoredUser = {
      id: userId,
      name: payload.name,
      mobile: payload.mobile.replace(/\D/g, ""),
      password: payload.password,
      country: payload.country,
      region: payload.region,
      createdAt: new Date().toISOString(),
    };

    const newFarm: StoredFarm = {
      id: farmId,
      userId: userId,
      name: payload.farmName || `${payload.name}'s Farm`,
      owner: payload.name,
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

    return { user: newUser, farm: newFarm };
  }

  public getActiveSession(): {
    user: StoredUser;
    farm: StoredFarm;
    soil: StoredSoilData;
    isAuthenticated: boolean;
  } {
    this.init();
    const users = this.getUsers();
    const farms = this.getFarms();

    const activeUserId = this.isBrowser() ? localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID) : null;
    const activeFarmId = this.isBrowser() ? localStorage.getItem(STORAGE_KEYS.ACTIVE_FARM_ID) : null;
    const authStatus = this.isBrowser() ? localStorage.getItem(STORAGE_KEYS.AUTH_STATUS) === "true" : true;

    const user = users.find((u) => u.id === activeUserId) || users[0] || DEFAULT_USER;
    const farm = farms.find((f) => f.id === activeFarmId) || farms.find((f) => f.userId === user.id) || farms[0] || DEFAULT_FARM;
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

  public resetToDefaults(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.FARMS);
    localStorage.removeItem(STORAGE_KEYS.SOIL);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_FARM_ID);
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATUS);
    this.init();
  }
}

export const localDb = new LocalStorageDatabase();
