import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { maskPassport } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const referenceNumber = searchParams.get("referenceNumber")?.trim().toUpperCase();
    const dobString = searchParams.get("dateOfBirth")?.trim();

    if (!referenceNumber || !dobString) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide both Application Reference Number and Date of Birth.",
        },
        { status: 400 }
      );
    }

    const applicant = await prisma.applicant.findUnique({
      where: { referenceNumber },
      include: {
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!applicant) {
      return NextResponse.json(
        {
          success: false,
          error: "No application found matching the provided reference number and details.",
        },
        { status: 404 }
      );
    }

    // Verify Date of Birth if on file
    if (applicant.dateOfBirth) {
      const inputDate = new Date(dobString);
      const appDate = new Date(applicant.dateOfBirth);

      const isMatch =
        inputDate.getUTCFullYear() === appDate.getUTCFullYear() &&
        inputDate.getUTCMonth() === appDate.getUTCMonth() &&
        inputDate.getUTCDate() === appDate.getUTCDate();

      if (!isMatch) {
        return NextResponse.json(
          {
            success: false,
            error: "The Date of Birth entered does not match the application record.",
          },
          { status: 400 }
        );
      }
    }

    // Fetch official tracking setting
    const officialTrackingSetting = await prisma.siteSetting.findUnique({
      where: { key: "bls_tracking_url" },
    });

    return NextResponse.json({
      success: true,
      application: {
        referenceNumber: applicant.referenceNumber,
        name: applicant.name,
        maskedPassport: maskPassport(applicant.passportNumber || ""),
        visaType: applicant.visaType,
        visaCategory: applicant.visaCategory,
        centreName: applicant.centreName,
        status: applicant.status,
        submittedAt: applicant.createdAt,
        updatedAt: applicant.updatedAt,
        history: applicant.statusHistory.map((h) => ({
          status: h.newStatus,
          note: h.note,
          changedAt: h.createdAt,
        })),
      },
      officialTrackingUrl: officialTrackingSetting?.value || null,
    });
  } catch (err) {
    console.error("Tracking API error:", err);
    return NextResponse.json(
      { success: false, error: "An error occurred while tracking the application." },
      { status: 500 }
    );
  }
}
