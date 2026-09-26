import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { ApplicationStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() as ApplicationStatus | undefined;
    const centre = searchParams.get("centre")?.trim() || "";
    const visaType = searchParams.get("visaType")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { referenceNumber: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { passportNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && Object.values(ApplicationStatus).includes(status)) {
      where.status = status;
    }

    if (centre && centre !== "ALL") {
      where.centreName = centre;
    }

    if (visaType && visaType !== "ALL") {
      where.visaType = visaType;
    }

    const [total, applicants] = await Promise.all([
      prisma.applicant.count({ where }),
      prisma.applicant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          referenceNumber: true,
          name: true,
          email: true,
          phone: true,
          passportNumber: true,
          dateOfBirth: true,
          visaType: true,
          visaCategory: true,
          centreName: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { documents: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      applicants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Fetch applicants error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch applicants" }, { status: 500 });
  }
}
