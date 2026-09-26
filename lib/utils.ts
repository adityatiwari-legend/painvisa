import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApplicationStatus } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "INR"): string {
  if (amount === 0) return "Gratis (₹0)";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid Date";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid Date";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function maskAadhaar(aadhaar: string): string {
  const cleaned = aadhaar.replace(/\s+/g, "");
  if (cleaned.length < 4) return "XXXX-XXXX-XXXX";
  const last4 = cleaned.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

export function maskPassport(passport: string): string {
  if (!passport || passport.length < 4) return "XXXXXX";
  const start = passport.slice(0, 2);
  const end = passport.slice(-2);
  return `${start}****${end}`;
}

export interface StatusMeta {
  label: string;
  description: string;
  badgeClass: string;
  stepIndex: number;
}

export const STATUS_MAP: Record<ApplicationStatus, StatusMeta> = {
  DRAFT: {
    label: "Draft",
    description: "Application initialized and draft saved.",
    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-300",
    stepIndex: 0,
  },
  SUBMITTED: {
    label: "Application Submitted",
    description: "Application and identity documents successfully received in our system.",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    stepIndex: 1,
  },
  DOCUMENTS_UNDER_REVIEW: {
    label: "Documents Under Review",
    description: "Visa processing team is verifying submitted documentation and photograph specifications.",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300",
    stepIndex: 2,
  },
  APPOINTMENT_PENDING: {
    label: "Appointment Pending",
    description: "Application verified. Awaiting appointment schedule confirmation at the application centre.",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    stepIndex: 3,
  },
  APPOINTMENT_CONFIRMED: {
    label: "Appointment Confirmed",
    description: "Appointment confirmed. Please present yourself at the designated centre with original documents.",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    stepIndex: 4,
  },
  PROCESSING: {
    label: "Under Processing at Mission",
    description: "Application and passport forwarded to the Embassy/Consulate General of Spain for decision.",
    badgeClass: "bg-cyan-50 text-cyan-800 border-cyan-300",
    stepIndex: 5,
  },
  ADDITIONAL_DOCUMENTS_REQUIRED: {
    label: "Additional Documents Required",
    description: "The visa section has requested additional supporting documents or clarification.",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-300",
    stepIndex: 5,
  },
  READY_FOR_COLLECTION: {
    label: "Ready for Collection / Courier",
    description: "Processed passport received from Embassy. Available for collection or in transit via courier.",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
    stepIndex: 6,
  },
  COMPLETED: {
    label: "Application Completed",
    description: "Application process finalized and passport delivered to the applicant.",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-400",
    stepIndex: 7,
  },
  CANCELLED: {
    label: "Application Cancelled",
    description: "Application was withdrawn or cancelled by request.",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    stepIndex: -1,
  },
};
