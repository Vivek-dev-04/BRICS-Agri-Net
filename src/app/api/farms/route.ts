import { NextResponse } from "next/server";
import { DEMO_FARM } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    farms: [DEMO_FARM],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Farm registered successfully",
      farm: {
        id: `farm-in-${Date.now().toString().slice(-3)}`,
        ...body,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid farm registration payload" },
      { status: 400 }
    );
  }
}
