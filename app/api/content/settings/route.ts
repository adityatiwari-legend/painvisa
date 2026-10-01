import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_SETTINGS } from "@/lib/mock-data";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    if (settings && settings.length > 0) {
      const settingsMap = settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json({
        success: true,
        settings: { ...DEFAULT_SETTINGS, ...settingsMap },
      });
    }
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  } catch (err) {
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}
