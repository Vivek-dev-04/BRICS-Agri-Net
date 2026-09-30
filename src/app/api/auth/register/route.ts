import { NextResponse } from "next/server";
import { z } from "zod";
import { inferSoilFromCoordinates, inferRegionFromCoordinates } from "@/lib/auth/soilGeoService";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { findServerFarmerByMobile, saveServerFarmer } from "@/lib/db/serverDb";

const RegisterSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  mobile: z
    .string()
    .min(10, "Please enter a valid 10-digit mobile number.")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number starting with 6, 7, 8, or 9."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  country: z.enum(["IN", "BR", "RU", "CN", "ZA"]).default("IN"),
  state: z.string().optional(),
  district: z.string().optional(),
  village: z.string().optional(),
  farmName: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  areaAcres: z.number().positive("Land area must be greater than 0."),
  crop: z.string().min(2, "Please select or enter your primary crop."),
  soilType: z.string().optional(),
  irrigationType: z.string().default("Canal"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues?.[0]?.message || "Invalid registration data.";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const data = result.data;
    const cleanMobile = data.mobile.replace(/\D/g, "");

    // 1. Check server-side registered farmers first
    const existingServerFarmer = findServerFarmerByMobile(cleanMobile);
    if (existingServerFarmer) {
      return NextResponse.json(
        {
          success: false,
          error: `A farmer account is already registered with mobile number +91 ${cleanMobile} (${existingServerFarmer.name}). Please sign in to your existing account.`,
          code: "MOBILE_ALREADY_EXISTS",
        },
        { status: 409 }
      );
    }

    // 2. Check PostgreSQL / Prisma ONLY IF configured
    if (isDatabaseConfigured()) {
      try {
        const existingUser = await prisma.user.findFirst({
          where: { email: `${cleanMobile}@brics-agri.net` },
        });

        if (existingUser) {
          return NextResponse.json(
            {
              success: false,
              error: `A farmer account is already registered with mobile number +91 ${cleanMobile} (${existingUser.name || "Farmer"}). Please sign in to your existing account.`,
              code: "MOBILE_ALREADY_EXISTS",
            },
            { status: 409 }
          );
        }
      } catch {
        // Prisma offline, continue with serverDb persistence
      }
    }

    const farmId = `farm-${data.country.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const lat = data.latitude ?? 26.9124;
    const lng = data.longitude ?? 75.7873;

    // Automatically infer soil classification from GPS coordinates if not provided
    const inferredSoil = inferSoilFromCoordinates(lat, lng);
    const finalSoilType = data.soilType || inferredSoil.soilType;

    // Automatically infer region from GPS coordinates if not provided
    const inferredRegion = inferRegionFromCoordinates(lat, lng);
    const finalRegion = data.district && data.state
      ? `${data.district}, ${data.state}`
      : inferredRegion.region;

    const farmName = data.farmName || `${data.name}'s Farm`;

    // 3. Save to server-side persistent database
    saveServerFarmer({
      id: `farmer-${cleanMobile.slice(-4)}-${Date.now().toString().slice(-4)}`,
      name: data.name.trim(),
      mobile: cleanMobile,
      password: data.password,
      country: data.country,
      region: finalRegion,
      farms: [
        {
          id: farmId,
          name: farmName,
          location: finalRegion,
          latitude: lat,
          longitude: lng,
          areaAcres: data.areaAcres,
          crop: data.crop,
          soilType: finalSoilType,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    });

    // 4. Also persist to PostgreSQL / Prisma ONLY IF configured
    let persistentFarmId = farmId;
    if (isDatabaseConfigured()) {
      try {
        const dbUser = await prisma.user.create({
          data: {
            name: data.name.trim(),
            email: `${cleanMobile}@brics-agri.net`,
            country: data.country,
          },
        });

        const createdFarm = await prisma.farm.create({
          data: {
            userId: dbUser.id,
            name: farmName,
            location: finalRegion,
            latitude: lat,
            longitude: lng,
            area: data.areaAcres,
            soilType: finalSoilType,
            cropVariety: "High-Yield Hybrid",
            irrigationType: data.irrigationType,
            sowingDate: new Date(),
          },
        });

        persistentFarmId = createdFarm.id;

        await prisma.soilData.create({
          data: {
            farmId: createdFarm.id,
            nitrogen: finalSoilType.includes("Alluvial") ? 245 : 180,
            phosphorus: 24,
            potassium: 310,
            ph: 7.2,
            organicCarbon: 0.65,
            moisture: 30,
            soilScore: 84,
          },
        });
      } catch {
        // Continues gracefully if database is not yet configured or offline
      }
    }

    return NextResponse.json({
      success: true,
      message: "Farmer account and farm registered successfully.",
      farmer: {
        id: persistentFarmId,
        name: data.name,
        mobile: `+91 ${cleanMobile}`,
        country: data.country,
        region: finalRegion,
        farmName: farmName,
        latitude: lat,
        longitude: lng,
        areaAcres: data.areaAcres,
        crop: data.crop,
        soilType: finalSoilType,
        irrigationType: data.irrigationType,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to complete registration. Please check your network and try again.",
      },
      { status: 500 }
    );
  }
}
