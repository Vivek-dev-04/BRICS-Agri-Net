import { z } from "zod";

/**
 * Common Agricultural Data Schema (CADS)
 * Standardized data format for cross-country agricultural interoperability across BRICS nations.
 */
export const CadsSoilSchema = z.object({
  nitrogen: z.number().describe("Nitrogen rating or kg/ha"),
  phosphorus: z.number().describe("Phosphorus rating or kg/ha"),
  potassium: z.number().describe("Potassium rating or kg/ha"),
  ph: z.number().optional().describe("Soil pH level"),
  organicCarbon: z.number().optional().describe("Organic carbon percentage"),
});

export const CadsWeatherSchema = z.object({
  temperature: z.number().describe("Current or mean temperature in Celsius"),
  rainfall: z.number().describe("Precipitation in mm"),
  humidity: z.number().optional().describe("Relative humidity percentage"),
  windSpeed: z.number().optional().describe("Wind speed in km/h"),
});

export const CadsVegetationSchema = z.object({
  ndvi: z.number().min(-1).max(1).describe("Normalized Difference Vegetation Index"),
  stressLevel: z.enum(["LOW", "MODERATE", "SEVERE", "NONE"]).optional(),
});

export const CadsRecordSchema = z.object({
  country: z.enum(["IN", "BR", "RU", "CN", "ZA"]).describe("ISO 2-letter country code"),
  region: z.string().min(1).describe("State / Province / Region name"),
  crop: z.string().min(1).describe("Standardized crop name"),
  soil: CadsSoilSchema,
  weather: CadsWeatherSchema,
  vegetation: CadsVegetationSchema,
  timestamp: z.string().datetime().optional(),
});

export type CadsRecord = z.infer<typeof CadsRecordSchema>;
export type CadsSoil = z.infer<typeof CadsSoilSchema>;
export type CadsWeather = z.infer<typeof CadsWeatherSchema>;
export type CadsVegetation = z.infer<typeof CadsVegetationSchema>;
