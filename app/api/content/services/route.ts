import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_SERVICES } from "@/lib/mock-data";

export async function GET() {
  try {
    const services = await prisma.additionalService.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
    if (services && services.length > 0) {
      return NextResponse.json({ success: true, services });
    }
    return NextResponse.json({ success: true, services: DEFAULT_SERVICES });
  } catch (err) {
    return NextResponse.json({ success: true, services: DEFAULT_SERVICES });
  }
}
