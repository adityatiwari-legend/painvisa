import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { storageProvider } from "@/lib/storage";
import { ApplicantStep1Schema } from "@/lib/validation";
import crypto from "crypto";

// Generate reference number in format BLS-2026-XXXXXX
function generateReferenceNumber(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // exclude easily confusable 0/O, 1/I
  let code = "";
  const randomBytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[randomBytes[i] % chars.length];
  }
  return `BLS-2026-${code}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract text fields
    const rawData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      dateOfBirth: formData.get("dateOfBirth")?.toString() || "",
      passportNumber: formData.get("passportNumber")?.toString() || "",
      nationality: formData.get("nationality")?.toString() || "Indian",
      visaType: formData.get("visaType")?.toString() || "SCHENGEN",
      visaCategory: formData.get("visaCategory")?.toString() || "Tourist Visa",
      centreName: formData.get("centreName")?.toString() || "New Delhi",
    };

    const consent = formData.get("consent") === "true";
    if (!consent) {
      return NextResponse.json(
        {
          success: false,
          error: "You must provide explicit consent for the collection and processing of your personal information.",
        },
        { status: 400 }
      );
    }

    // Validate fields with Zod
    const validationResult = ApplicantStep1Schema.safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // Extract files
    const thumbFile = formData.get("thumbPhoto") as File | null;
    const passportFile = formData.get("passportPhoto") as File | null;
    const aadhaarFile = formData.get("aadhaarPhoto") as File | null;

    if (!thumbFile || !passportFile || !aadhaarFile) {
      return NextResponse.json(
        {
          success: false,
          error: "All three identity documents (Thumb impression, Passport photograph, Aadhaar card photograph) are mandatory.",
        },
        { status: 400 }
      );
    }

    // Create unique reference number
    let referenceNumber = generateReferenceNumber();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await prisma.applicant.findUnique({ where: { referenceNumber } });
      if (!existing) {
        isUnique = true;
      } else {
        referenceNumber = generateReferenceNumber();
        attempts++;
      }
    }

    // Parse date of birth
    let parsedDob: Date | null = null;
    if (validData.dateOfBirth) {
      const d = new Date(validData.dateOfBirth);
      if (!isNaN(d.getTime())) parsedDob = d;
    }

    // Create applicant in DB
    const applicant = await prisma.applicant.create({
      data: {
        referenceNumber,
        name: validData.name.trim(),
        email: validData.email.trim().toLowerCase(),
        phone: validData.phone.trim(),
        dateOfBirth: parsedDob,
        passportNumber: validData.passportNumber.trim().toUpperCase(),
        nationality: validData.nationality,
        visaType: validData.visaType,
        visaCategory: validData.visaCategory,
        centreName: validData.centreName,
        status: "SUBMITTED",
        consentGiven: true,
      },
    });

    // Create status history log
    await prisma.applicationStatusHistory.create({
      data: {
        applicantId: applicant.id,
        oldStatus: null,
        newStatus: "SUBMITTED",
        changedBy: "APPLICANT_PORTAL",
        note: "Application submitted online with required biometric & identity documents.",
      },
    });

    // Process and save each file to secure local storage
    const filesToProcess = [
      { file: thumbFile, type: "THUMB" as const, label: "Thumb Impression" },
      { file: passportFile, type: "PASSPORT" as const, label: "Passport Photo" },
      { file: aadhaarFile, type: "AADHAAR" as const, label: "Aadhaar Card" },
    ];

    const savedDocuments = [];

    for (const item of filesToProcess) {
      const buffer = Buffer.from(await item.file.arrayBuffer());
      const originalName = item.file.name || `${item.type.toLowerCase()}.jpg`;
      const mimeType = item.file.type || "image/jpeg";

      try {
        const storageResult = await storageProvider.save({
          applicantId: applicant.id,
          type: item.type,
          buffer,
          mimeType,
          originalName,
        });

        const docRecord = await prisma.applicantDocument.create({
          data: {
            applicantId: applicant.id,
            type: item.type,
            originalName,
            storedName: storageResult.storedName,
            mimeType: storageResult.mimeType,
            size: storageResult.size,
            storagePath: storageResult.storagePath,
          },
        });

        savedDocuments.push({
          id: docRecord.id,
          type: docRecord.type,
          size: docRecord.size,
        });
      } catch (err: unknown) {
        const storageError = err as Error;
        console.error(`Error saving ${item.type} for applicant ${applicant.id}:`, storageError);
        // Rollback applicant if critical document saving fails
        await prisma.applicant.delete({ where: { id: applicant.id } }).catch(() => {});
        return NextResponse.json(
          {
            success: false,
            error: `Failed to securely process ${item.label}: ${storageError.message || "Invalid image"}`,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
      referenceNumber: applicant.referenceNumber,
      applicant: {
        id: applicant.id,
        referenceNumber: applicant.referenceNumber,
        name: applicant.name,
        email: applicant.email,
        phone: applicant.phone,
        visaCategory: applicant.visaCategory,
        centreName: applicant.centreName,
        status: applicant.status,
        createdAt: applicant.createdAt,
      },
      documentsCount: savedDocuments.length,
    });
  } catch (error: unknown) {
    console.error("Applicant registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An internal server error occurred while processing your application. Please try again.",
      },
      { status: 500 }
    );
  }
}
