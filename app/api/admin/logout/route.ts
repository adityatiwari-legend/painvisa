import { NextRequest, NextResponse } from "next/server";
import { clearAdminSessionCookie, getCurrentAdmin } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (admin) {
      await recordAuditLog({
        adminId: admin.sub,
        adminEmail: admin.email,
        action: "LOGOUT",
        entityType: "USER",
        entityId: admin.sub,
        ipAddress: clientIp,
      });
    }

    await clearAdminSessionCookie();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ success: false, error: "Error during logout." }, { status: 500 });
  }
}
