import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action")?.trim();
    const entityType = searchParams.get("entityType")?.trim();
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "50", 10)));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        admin: {
          select: { name: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json({ success: true, logs });
  } catch (err) {
    console.error("Fetch audit logs error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
