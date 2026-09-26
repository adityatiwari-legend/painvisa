import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { CentreSchema } from "@/lib/validation";
import { recordAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const centres = await prisma.centre.findMany({
      orderBy: [{ country: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ success: true, centres });
  } catch (err) {
    console.error("Admin fetch centres error:", err);
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
    const parsed = CentreSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid centre data", details: parsed.error.flatten() }, { status: 400 });
    }

    const centre = await prisma.centre.create({
      data: parsed.data,
    });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "CONTENT_UPDATE",
      entityType: "CENTRE",
      entityId: centre.id,
      metadata: { code: centre.code, name: centre.name },
    });

    return NextResponse.json({ success: true, centre });
  } catch (err) {
    console.error("Create centre error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
