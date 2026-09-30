import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findServerFarmerByMobile } from "@/lib/db/serverDb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mobile = (searchParams.get("mobile") || "").trim().replace(/\D/g, "");

  if (!mobile || mobile.length !== 10) {
    return NextResponse.json(
      { success: false, error: "Valid 10-digit mobile number required" },
      { status: 400 }
    );
  }

  // 1. Check server-side persistent farmers store
  const serverFarmer = findServerFarmerByMobile(mobile);
  if (serverFarmer) {
    return NextResponse.json({
      success: true,
      exists: true,
      name: serverFarmer.name,
      message: `An account is already registered with mobile number +91 ${mobile}.`,
    });
  }

  // 2. Check PostgreSQL / Prisma if available
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: `${mobile}@brics-agri.net`,
      },
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        exists: true,
        name: existingUser.name,
        message: `An account is already registered with mobile number +91 ${mobile}.`,
      });
    }
  } catch {
    // Ignore database connection errors
  }

  return NextResponse.json({
    success: true,
    exists: false,
  });
}
