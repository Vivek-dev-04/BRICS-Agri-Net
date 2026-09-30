import fs from "fs";
import path from "path";

export interface ServerFarmerRecord {
  id: string;
  name: string;
  mobile: string;
  password?: string;
  country: string;
  region: string;
  farms: Array<{
    id: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    areaAcres: number;
    crop: string;
    soilType: string;
    createdAt: string;
  }>;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "server-farmers.json");

// Ensure data directory and file exist
function ensureDataFile(): ServerFarmerRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      // Seed with initial default demonstration farmer
      const initial: ServerFarmerRecord[] = [
        {
          id: "farmer-001",
          name: "Ram Singh",
          mobile: "9876543210",
          password: "password123",
          country: "IN",
          region: "Jaipur Zone, Rajasthan",
          farms: [
            {
              id: "farm-in-001",
              name: "Ram Singh Farm",
              location: "Jaipur Zone, Rajasthan, India",
              latitude: 26.9124,
              longitude: 75.7873,
              areaAcres: 4.5,
              crop: "Wheat",
              soilType: "Sandy Loam",
              createdAt: "2026-01-15T00:00:00.000Z",
            },
          ],
          createdAt: "2026-01-15T00:00:00.000Z",
        },
      ];
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }

    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.warn("serverDb: error reading file:", err);
    return [];
  }
}

export function getAllServerFarmers(): ServerFarmerRecord[] {
  return ensureDataFile();
}

export function findServerFarmerByMobile(mobile: string): ServerFarmerRecord | undefined {
  const clean = mobile.replace(/\D/g, "");
  const farmers = ensureDataFile();
  return farmers.find((f) => f.mobile.replace(/\D/g, "") === clean);
}

export function saveServerFarmer(record: ServerFarmerRecord): void {
  const farmers = ensureDataFile();
  const cleanMobile = record.mobile.replace(/\D/g, "");
  const existingIdx = farmers.findIndex((f) => f.mobile.replace(/\D/g, "") === cleanMobile);

  if (existingIdx >= 0) {
    farmers[existingIdx] = record;
  } else {
    farmers.push(record);
  }

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(farmers, null, 2), "utf-8");
  } catch (err) {
    console.error("serverDb: error writing file:", err);
  }
}

export function addFarmToServerFarmer(mobile: string, farm: ServerFarmerRecord["farms"][0]): boolean {
  const farmer = findServerFarmerByMobile(mobile);
  if (!farmer) return false;

  // Check duplicate farm name
  const isDuplicate = farmer.farms.some(
    (f) => f.name.trim().toLowerCase() === farm.name.trim().toLowerCase()
  );
  if (isDuplicate) return false;

  farmer.farms.unshift(farm);
  saveServerFarmer(farmer);
  return true;
}
