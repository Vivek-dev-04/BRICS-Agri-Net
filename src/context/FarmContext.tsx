"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DemoFarm } from "@/lib/mock-data";
import { localDb, StoredSoilData } from "@/lib/db/localStorageDb";

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  mobile?: string;
  country: "IN" | "BR" | "RU" | "CN" | "ZA";
  region: string;
}

export interface RegisterPayload {
  name: string;
  email?: string;
  mobile?: string;
  password?: string;
  country: "IN" | "BR" | "RU" | "CN" | "ZA";
  region: string;
  farmName: string;
  latitude?: number;
  longitude?: number;
  areaAcres: number;
  crop: string;
  cropVariety?: string;
  sowingDate?: string;
  soilType: string;
  irrigationType?: string;
}

interface FarmContextType {
  user: UserProfile;
  farm: DemoFarm;
  farms: DemoFarm[];
  soil: StoredSoilData;
  isAuthenticated: boolean;
  login: (mobileOrEmail: string, password?: string) => { success: boolean; error?: string };
  register: (data: RegisterPayload) => { success: boolean; error?: string };
  addFarm: (farm: Omit<DemoFarm, "id">) => void;
  switchFarm: (farmId: string) => void;
  deleteFarm: (farmId: string) => void;
  logout: () => void;
  resetDatabase: () => void;
  clearDatabase: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: "farmer-001",
  name: "Ram Singh",
  email: "9876543210@brics-agri.net",
  mobile: "9876543210",
  country: "IN",
  region: "Jaipur Zone, Rajasthan",
};

const DEFAULT_FARM: DemoFarm = {
  id: "farm-in-001",
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
};

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export function FarmProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [farms, setFarms] = useState<DemoFarm[]>([]);
  const [farm, setFarm] = useState<DemoFarm>(DEFAULT_FARM);
  const [soil, setSoil] = useState<StoredSoilData>(localDb.getSoilByFarmId(DEFAULT_FARM.id));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Sync state from LocalStorage DB on mount
  const syncFromLocalDb = () => {
    try {
      const session = localDb.getActiveSession();
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: `${session.user.mobile}@brics-agri.net`,
        mobile: session.user.mobile,
        country: session.user.country,
        region: session.user.region,
      });

      // Strictly load ONLY farms belonging to the current authenticated user
      const userFarmsList = localDb.getFarmsByUserId(session.user.id, session.user.name);

      const userFarms = userFarmsList.map((f) => ({
        id: f.id,
        name: f.name,
        owner: f.owner,
        location: f.location,
        country: f.country,
        latitude: f.latitude,
        longitude: f.longitude,
        areaAcres: f.areaAcres,
        crop: f.crop,
        cropVariety: f.cropVariety,
        sowingDate: f.sowingDate,
        irrigationType: f.irrigationType,
        soilType: f.soilType,
      }));

      setFarms(userFarms);

      const fallbackFarm: DemoFarm = {
        ...DEFAULT_FARM,
        id: `farm-${session.user.country.toLowerCase()}-${session.user.id.slice(-4)}`,
        name: `${session.user.name}'s Farm`,
        owner: session.user.name,
        location: session.user.region,
      };
      const activeFarm =
        userFarms.find((f) => f.id === session.farm.id) ||
        userFarms[0] ||
        (session.user.id === DEFAULT_USER.id ? DEFAULT_FARM : fallbackFarm);
      setFarm(activeFarm);

      const farmSoil = localDb.getSoilByFarmId(activeFarm.id);
      setSoil(farmSoil);

      setIsAuthenticated(session.isAuthenticated);
    } catch (err) {
      console.warn("LocalStorage hydration error:", err);
    }
  };

  useEffect(() => {
    syncFromLocalDb();
  }, []);

  // Synchronize active farm soil with live Soil Telemetry API
  useEffect(() => {
    if (farm && farm.latitude && farm.longitude) {
      fetch(`/api/soil?lat=${farm.latitude}&lon=${farm.longitude}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            const liveSoil: StoredSoilData = {
              farmId: farm.id,
              soilType: data.data.soilNameEn || data.data.soilType,
              nitrogen: data.data.nitrogen.value,
              phosphorus: data.data.phosphorus.value,
              potassium: data.data.potassium.value,
              ph: data.data.ph.value,
              organicCarbon: data.data.organicCarbon.value,
              moisture: data.data.moisturePercent,
              soilScore: data.data.soilScore,
              status: data.data.statusHeadline,
              updatedAt: data.data.updatedAt,
            };
            setSoil(liveSoil);
            localDb.saveSoilData(liveSoil);
          }
        })
        .catch((err) => console.warn("Live soil API fetch error:", err));
    }
  }, [farm.id, farm.latitude, farm.longitude]);

  const login = (mobileOrEmail: string, password?: string) => {
    const res = localDb.login(mobileOrEmail, password);
    if (res.success) {
      syncFromLocalDb();
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const register = (data: RegisterPayload): { success: boolean; error?: string } => {
    const res = localDb.register({
      name: data.name,
      mobile: data.mobile || data.email?.split("@")[0] || "9876543210",
      password: data.password || "password123",
      country: data.country,
      region: data.region,
      farmName: data.farmName,
      latitude: data.latitude ?? 26.9124,
      longitude: data.longitude ?? 75.7873,
      areaAcres: data.areaAcres,
      crop: data.crop,
      cropVariety: data.cropVariety,
      sowingDate: data.sowingDate,
      soilType: data.soilType,
      irrigationType: data.irrigationType,
    });

    if (!res.success) {
      return { success: false, error: res.error };
    }

    syncFromLocalDb();
    return { success: true };
  };

  const addFarm = (newFarmData: Omit<DemoFarm, "id">) => {
    const session = localDb.getActiveSession();
    const currentUserId = user.id || session.user.id;
    const currentUserName = user.name || session.user.name;
    const farmId = `farm-${newFarmData.country.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    localDb.saveFarm({
      id: farmId,
      userId: currentUserId,
      name: newFarmData.name,
      owner: currentUserName || newFarmData.owner,
      location: newFarmData.location,
      country: newFarmData.country,
      latitude: newFarmData.latitude,
      longitude: newFarmData.longitude,
      areaAcres: newFarmData.areaAcres,
      crop: newFarmData.crop,
      cropVariety: newFarmData.cropVariety,
      sowingDate: newFarmData.sowingDate,
      irrigationType: newFarmData.irrigationType,
      soilType: newFarmData.soilType,
      createdAt: new Date().toISOString(),
    });

    localDb.setActiveFarm(farmId);
    syncFromLocalDb();
  };

  const switchFarm = (farmId: string) => {
    localDb.setActiveFarm(farmId);
    syncFromLocalDb();
  };

  const deleteFarm = (farmId: string) => {
    const allFarms = localDb.getFarms();
    const remaining = allFarms.filter((f) => f.id !== farmId);
    localStorage.setItem("brics_farms_db", JSON.stringify(remaining));

    const userRemaining = localDb.getFarmsByUserId(user.id, user.name).filter((f) => f.id !== farmId);
    if (farm.id === farmId && userRemaining.length > 0) {
      localDb.setActiveFarm(userRemaining[0].id);
    }
    syncFromLocalDb();
  };

  const logout = () => {
    localDb.logout();
    setIsAuthenticated(false);
  };

  const resetDatabase = () => {
    localDb.resetToDefaults();
    syncFromLocalDb();
  };

  const clearDatabase = () => {
    localDb.clearAll();
    syncFromLocalDb();
  };

  return (
    <FarmContext.Provider
      value={{
        user,
        farm,
        farms,
        soil,
        isAuthenticated,
        login,
        register,
        addFarm,
        switchFarm,
        deleteFarm,
        logout,
        resetDatabase,
        clearDatabase,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error("useFarm must be used within a FarmProvider");
  }
  return context;
}
