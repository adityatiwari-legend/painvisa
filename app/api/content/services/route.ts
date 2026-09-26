import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const services = await prisma.additionalService.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
    return NextResponse.json({ success: true, services });
  } catch (err) {
    console.error("Fetch services error:", err);
    return NextResponse.json({ success: false, services: [] }, { status: 500 });
  }
}
