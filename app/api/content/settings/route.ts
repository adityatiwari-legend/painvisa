import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      success: true,
      settings: settingsMap,
    });
  } catch (err) {
    console.error("Fetch settings error:", err);
    return NextResponse.json({ success: false, settings: {} }, { status: 500 });
  }
}
