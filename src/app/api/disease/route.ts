import { NextResponse } from "next/server";
import { DEMO_DISEASE_DIAGNOSIS } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    return NextResponse.json({
      success: true,
      message: "Leaf pathology diagnostic completed",
      diagnosis: DEMO_DISEASE_DIAGNOSIS,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Diagnostic inference failed" },
      { status: 500 }
    );
  }
}
