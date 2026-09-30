import { NextResponse } from "next/server";
import { BRICS_SHARED_MODELS, runBricsModelSimulation } from "@/lib/services/bricsModelsService";

export async function GET() {
  return NextResponse.json({
    success: true,
    standard: "BRICS Open CADS Registry v1.0",
    digitalPublicGood: "Compliant with DPGA (Digital Public Goods Alliance)",
    license: "Open Public Research & Apache 2.0",
    totalModels: BRICS_SHARED_MODELS.length,
    participatingInstitutes: [
      { country: "BR", institute: "EMBRAPA", role: "Tropical Soil Carbon & Biomass Dynamics" },
      { country: "IN", institute: "ICAR", role: "Evapotranspiration & Deficit Irrigation Scheduling" },
      { country: "RU", institute: "RAS", role: "Winter Crop Hardening & Snowpack Telemetry" },
      { country: "CN", institute: "CAAS", role: "Canopy Microclimate & Spore Inoculum Prediction" },
      { country: "ZA", institute: "ARC", role: "Semi-Arid Water-Use Efficiency & Drought Adaptation" },
    ],
    models: BRICS_SHARED_MODELS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { modelId, inputs } = body;

    if (!modelId) {
      return NextResponse.json({ success: false, error: "modelId is required" }, { status: 400 });
    }

    const model = BRICS_SHARED_MODELS.find((m) => m.id === modelId);
    if (!model) {
      return NextResponse.json({ success: false, error: `Model '${modelId}' not found in registry` }, { status: 404 });
    }

    const outputs = runBricsModelSimulation(modelId, inputs || {});

    return NextResponse.json({
      success: true,
      modelId,
      modelName: model.name,
      institution: model.institution,
      country: model.country,
      version: model.version,
      timestamp: new Date().toISOString(),
      inputsProvided: inputs,
      simulationOutputs: outputs,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Simulation failed" }, { status: 500 });
  }
}
