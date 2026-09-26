import { z } from "zod";

export const ApplicantStep1Schema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Full name can only contain letters and spaces"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 characters")
    .regex(/^[+]?[0-9\s-]+$/, "Invalid phone number format"),
  dateOfBirth: z.string().min(1, "Date of birth is required for tracking"),
  passportNumber: z
    .string()
    .min(6, "Passport number must be at least 6 characters")
    .max(12, "Passport number cannot exceed 12 characters")
    .toUpperCase(),
  nationality: z.string().default("Indian"),
  visaType: z.enum(["SCHENGEN", "NATIONAL"]).default("SCHENGEN"),
  visaCategory: z.string().min(1, "Please select a visa category"),
  centreName: z.string().min(1, "Please select a visa application centre"),
});

export const ApplicantSubmitSchema = ApplicantStep1Schema.extend({
  consent: z.literal(true, {
    message: "You must consent to the collection and processing of your personal information and documents.",
  }),
});

export const AdminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const ApplicationTrackSchema = z.object({
  referenceNumber: z.string().min(5, "Application Reference Number is required"),
  dateOfBirth: z.string().min(1, "Date of Birth is required for verification"),
});

export const StatusUpdateSchema = z.object({
  status: z.enum([
    "DRAFT",
    "SUBMITTED",
    "DOCUMENTS_UNDER_REVIEW",
    "APPOINTMENT_PENDING",
    "APPOINTMENT_CONFIRMED",
    "PROCESSING",
    "ADDITIONAL_DOCUMENTS_REQUIRED",
    "READY_FOR_COLLECTION",
    "COMPLETED",
    "CANCELLED",
  ]),
  note: z.string().max(500).optional(),
});

export const AnnouncementSchema = z.object({
  title: z.string().min(3).max(200),
  message: z.string().min(5).max(1000),
  severity: z.enum(["INFO", "WARNING", "URGENT"]).default("INFO"),
  isPublished: z.boolean().default(true),
});

export const CentreSchema = z.object({
  code: z.string().min(2).max(10),
  name: z.string().min(2).max(100),
  country: z.string().default("India"),
  address: z.string().min(5),
  submissionHours: z.string().min(3),
  passportCollectionHours: z.string().min(3),
  phone: z.string().min(5),
  email: z.string().email(),
  mapUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const AdditionalServiceSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  price: z.number().nonnegative(),
  currency: z.string().default("INR"),
  isOptional: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export const HolidaySchema = z.object({
  country: z.string().min(2),
  year: z.number().int().default(2026),
  date: z.string().min(1),
  name: z.string().min(2),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const FAQSchema = z.object({
  category: z.string().min(2),
  question: z.string().min(5),
  answer: z.string().min(10),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const SiteSettingSchema = z.object({
  value: z.string(),
  description: z.string().optional(),
});
