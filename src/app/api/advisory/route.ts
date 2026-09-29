import { NextResponse } from "next/server";
import { DEMO_ADVISORY } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    advisories: [DEMO_ADVISORY],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    return NextResponse.json({
      success: true,
      message: "AI Advisory synthesized successfully",
      advisory: {
        ...DEMO_ADVISORY,
        generatedAt: new Date().toISOString(),
        ...body,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to generate agro-advisory" },
      { status: 500 }
    );
  }
}
