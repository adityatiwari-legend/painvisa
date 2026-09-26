import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const centres = await prisma.centre.findMany({
      where: { isActive: true },
      orderBy: [{ country: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ success: true, centres });
  } catch (err) {
    console.error("Fetch centres error:", err);
    return NextResponse.json({ success: false, centres: [] }, { status: 500 });
  }
}
