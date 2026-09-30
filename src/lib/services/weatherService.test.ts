import { decodeWmoCode, computeAgroRisks, getFallbackWeather } from "./weatherService";

// Type-safe test harness for Next.js build compatibility without extra runner dependencies
function describe(_name: string, fn: () => void) {
  fn();
}

function it(_name: string, fn: () => void) {
  fn();
}

function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toEqual(expected: unknown) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toContain(expected: string) {
      if (typeof actual !== "string" || !actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== "number" || actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
  };
}

describe("Open-Meteo Weather Service", () => {
  it("decodes WMO weather interpretation codes accurately", () => {
    expect(decodeWmoCode(0)).toEqual({ text: "Clear Sky", icon: "sun" });
    expect(decodeWmoCode(2)).toEqual({ text: "Partly Cloudy", icon: "cloud-sun" });
    expect(decodeWmoCode(61)).toEqual({ text: "Moderate Rain", icon: "rain" });
    expect(decodeWmoCode(95)).toEqual({ text: "Thunderstorm Warning", icon: "thunder" });
  });

  it("identifies critical root-zone water stress under high evaporative demand and low rainfall", () => {
    const risks = computeAgroRisks(32, 40, 10, 10, 14.5, 5.2);
    expect(risks.waterStress.level).toBe("CRITICAL");
    expect(risks.waterStress.recommendation).toContain("Immediate irrigation required");
  });

  it("flags high fungal spore germination risk under warm, high humidity conditions", () => {
    const risks = computeAgroRisks(24, 85, 8, 10, 25, 3.5);
    expect(risks.fungalRisk.level).toBe("HIGH");
    expect(risks.fungalRisk.title).toContain("High Spore Germination Risk");
  });

  it("evaluates agrochemical spraying feasibility correctly against wind and rainfall", () => {
    const windy = computeAgroRisks(25, 50, 22, 10, 25, 3.5);
    expect(windy.sprayingWindow.suitable).toBe(false);
    expect(windy.sprayingWindow.status).toBe("UNFAVORABLE");

    const optimal = computeAgroRisks(25, 50, 8, 10, 25, 3.5);
    expect(optimal.sprayingWindow.suitable).toBe(true);
    expect(optimal.sprayingWindow.status).toBe("SUITABLE");
  });

  it("provides complete 7-day fallback telemetry structure when offline", () => {
    const fallback = getFallbackWeather(26.9124, 75.7873);
    expect(fallback.isLive).toBe(false);
    expect(fallback.forecast.length).toBe(7);
    expect(fallback.current.soilMoisturePercent).toBeGreaterThan(0);
    expect(fallback.station.latitude).toBe(26.9124);
  });
});
