import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AdminLoginSchema } from "@/lib/validation";
import { createAdminSessionToken, setAdminSessionCookie, verifyPassword } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

// In-memory rate limiting map for login attempts: ip -> { count, resetTime }
const loginRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginRateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    loginRateLimitMap.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 mins window
    return true;
  }
  if (record.count >= 10) {
    return false; // too many attempts
  }
  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed login attempts. Please wait 15 minutes before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = AdminLoginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email and password." },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Please verify your email and password." },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Please verify your email and password." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await createAdminSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    });

    // Set secure cookie
    await setAdminSessionCookie(token);

    // Record audit log
    await recordAuditLog({
      adminId: user.id,
      adminEmail: user.email,
      action: "LOGIN",
      entityType: "USER",
      entityId: user.id,
      metadata: { role: user.role },
      ipAddress: clientIp,
    });

    return NextResponse.json({
      success: true,
      message: "Authentication successful.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: "Authentication service encountered an unexpected error." },
      { status: 500 }
    );
  }
}
