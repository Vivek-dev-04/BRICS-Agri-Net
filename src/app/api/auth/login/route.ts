import { NextResponse } from "next/server";
import { z } from "zod";

const LoginSchema = z.object({
  mobile: z
    .string()
    .min(10, "Please enter a valid 10-digit mobile number.")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number starting with 6, 7, 8, or 9."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues?.[0]?.message || "Invalid input provided.";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const { mobile } = result.data;

    // Server-side authentication integration point.
    // In production, this verifies hashed password against PostgreSQL / Prisma.
    // For now, return a successful session payload for valid credentials.
    return NextResponse.json({
      success: true,
      message: "Authentication successful.",
      user: {
        id: `farmer-${mobile.slice(-4)}`,
        mobile: `+91 ${mobile}`,
        name: "Farmer",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "We couldn't sign you in. Please check your mobile number and password and try again.",
      },
      { status: 500 }
    );
  }
}
