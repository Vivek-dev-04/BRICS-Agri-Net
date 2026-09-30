import { NextResponse } from "next/server";
import { BRICS_SHARED_MODELS } from "@/lib/services/bricsModelsService";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const model = BRICS_SHARED_MODELS.find(
    (m) => m.id === params.id || m.id.toLowerCase() === params.id.toLowerCase()
  );

  if (!model) {
    return NextResponse.json(
      { success: false, error: `Model '${params.id}' not found in registry` },
      { status: 404 }
    );
  }

  // Generate full machine-readable open specification package
  const specPackage = {
    $schema: "https://schema.brics-agri.net/cads/v1.0/model-spec.json",
    modelMetadata: {
      id: model.id,
      code: model.code,
      name: model.name,
      institution: model.institution,
      country: model.country,
      countryName: model.countryName,
      version: model.version,
      releaseDate: model.releaseDate,
      category: model.category,
      targetEcosystem: model.targetEcosystem,
      algorithm: model.algorithm,
      trainingDatasetSize: model.trainingDatasetSize,
      accuracyMetric: model.accuracyMetric,
      license: model.license,
      cadsCompatibility: model.cadsCompatibility,
      summary: model.summary,
    },
    interoperabilityBindings: {
      schemaStandard: "Common Agricultural Data Schema (CADS) v1.0",
      dpgaStatus: "Digital Public Good Candidate",
      openApiRef: "/api/brics/agricultural-data",
    },
    inputParameters: model.inputParameters,
    outputParameters: model.outputParameters,
    citation: {
      bibtex: `@article{brics_agri_${model.code.toLowerCase().replace(/[^a-z0-9]/g, "_")}, author={${model.institution}}, title={${model.name}}, year={2026}, note={BRICS Agri-Net Open Shared Data Model Registry}}`,
    },
    exportedAt: new Date().toISOString(),
  };

  return NextResponse.json(specPackage, {
    headers: {
      "Content-Disposition": `attachment; filename="${model.code.toLowerCase()}-spec.json"`,
      "Content-Type": "application/json",
    },
  });
}
