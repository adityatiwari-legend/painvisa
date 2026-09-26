import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (admin.role === "VIEWER") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id } = await context.params;
    const body = await req.json();

    const standardFee = body.standardFee !== undefined ? parseFloat(body.standardFee) : undefined;
    const childFee = body.childFee !== undefined ? (body.childFee === null ? null : parseFloat(body.childFee)) : undefined;
    const blsServiceFee = body.blsServiceFee !== undefined ? parseFloat(body.blsServiceFee) : undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataToUpdate: any = {};
    if (standardFee !== undefined) dataToUpdate.standardFee = standardFee;
    if (childFee !== undefined) dataToUpdate.childFee = childFee;
    if (blsServiceFee !== undefined) dataToUpdate.blsServiceFee = blsServiceFee;

    const updated = await prisma.visaCategory.update({
      where: { id },
      data: dataToUpdate,
    });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "CONTENT_UPDATE",
      entityType: "VISA_TYPE",
      entityId: id,
      metadata: { feeUpdate: dataToUpdate, categoryName: updated.name },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (err) {
    console.error("Update fee error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
