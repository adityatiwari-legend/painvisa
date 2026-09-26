import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalApplicants,
      todayApplicants,
      totalDocuments,
      statusGroups,
      visaTypeGroups,
      centreGroups,
      recentApplicants,
    ] = await Promise.all([
      prisma.applicant.count(),
      prisma.applicant.count({
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.applicantDocument.count(),
      prisma.applicant.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.applicant.groupBy({
        by: ["visaType"],
        _count: { id: true },
      }),
      prisma.applicant.groupBy({
        by: ["centreName"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
      prisma.applicant.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          referenceNumber: true,
          name: true,
          email: true,
          visaCategory: true,
          centreName: true,
          status: true,
          createdAt: true,
          _count: {
            select: { documents: true },
          },
        },
      }),
    ]);

    const statusCounts = statusGroups.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      stats: {
        totalApplicants,
        todayApplicants,
        totalDocuments,
        pendingReview: (statusCounts["SUBMITTED"] || 0) + (statusCounts["DOCUMENTS_UNDER_REVIEW"] || 0),
        processing: (statusCounts["PROCESSING"] || 0) + (statusCounts["APPOINTMENT_CONFIRMED"] || 0),
        completed: statusCounts["COMPLETED"] || 0,
        statusCounts,
        byVisaType: visaTypeGroups.map((v) => ({ type: v.visaType, count: v._count.id })),
        byCentre: centreGroups.map((c) => ({ centre: c.centreName, count: c._count.id })),
        recentApplicants,
      },
    });
  } catch (err) {
    console.error("Stats API error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
