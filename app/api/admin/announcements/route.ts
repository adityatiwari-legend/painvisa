import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { AnnouncementSchema } from "@/lib/validation";
import { recordAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, announcements });
  } catch (err) {
    console.error("Fetch admin announcements error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (admin.role === "VIEWER") {
      return NextResponse.json({ success: false, error: "Forbidden for viewer" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = AnnouncementSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: parsed.data,
    });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "CONTENT_UPDATE",
      entityType: "ANNOUNCEMENT",
      entityId: announcement.id,
      metadata: { title: announcement.title },
    });

    return NextResponse.json({ success: true, announcement });
  } catch (err) {
    console.error("Create announcement error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
