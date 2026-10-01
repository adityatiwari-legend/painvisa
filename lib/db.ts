import bcrypt from "bcryptjs";
import {
  DEFAULT_CENTRES,
  DEFAULT_VISA_TYPES,
  DEFAULT_SERVICES,
  DEFAULT_FAQS,
  DEFAULT_HOLIDAYS,
  DEFAULT_USEFUL_LINKS,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_SETTINGS,
} from "./mock-data";

// Enums matching schema.prisma
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  VIEWER = "VIEWER",
}

export enum DocumentType {
  THUMB = "THUMB",
  PASSPORT = "PASSPORT",
  AADHAAR = "AADHAAR",
}

export enum ApplicationStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  DOCUMENTS_UNDER_REVIEW = "DOCUMENTS_UNDER_REVIEW",
  APPOINTMENT_PENDING = "APPOINTMENT_PENDING",
  APPOINTMENT_CONFIRMED = "APPOINTMENT_CONFIRMED",
  PROCESSING = "PROCESSING",
  ADDITIONAL_DOCUMENTS_REQUIRED = "ADDITIONAL_DOCUMENTS_REQUIRED",
  READY_FOR_COLLECTION = "READY_FOR_COLLECTION",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum AnnouncementSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  URGENT = "URGENT",
}

// Entity Types
export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicantRecord {
  id: string;
  referenceNumber: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date | null;
  passportNumber: string | null;
  nationality: string;
  visaType: string;
  visaCategory: string;
  centreName: string;
  status: ApplicationStatus;
  consentGiven: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicantDocumentRecord {
  id: string;
  applicantId: string;
  type: DocumentType;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  storagePath: string;
  createdAt: Date;
}

export interface ApplicationStatusHistoryRecord {
  id: string;
  applicantId: string;
  oldStatus: ApplicationStatus | null;
  newStatus: ApplicationStatus;
  changedBy: string;
  note: string | null;
  createdAt: Date;
}

export interface CentreRecord {
  id: string;
  code: string;
  name: string;
  country: string;
  address: string;
  submissionHours: string;
  passportCollectionHours: string;
  phone: string;
  email: string;
  mapUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisaTypeRecord {
  id: string;
  code: string;
  name: string;
  tagline: string | null;
  maxStay: string;
  overview: string;
  photoSpecifications: string;
  processingTime: string;
  jurisdictionInfo: string | null;
  formDownloadUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisaCategoryRecord {
  id: string;
  visaTypeId: string;
  name: string;
  slug: string;
  description: string;
  documentsRequired: string;
  standardFee: number;
  childFee: number | null;
  blsServiceFee: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdditionalServiceRecord {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isOptional: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HolidayRecord {
  id: string;
  country: string;
  year: number;
  date: Date;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQRecord {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsefulLinkRecord {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  message: string;
  severity: AnnouncementSeverity;
  isPublished: boolean;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettingRecord {
  key: string;
  value: string;
  description: string | null;
  updatedAt: Date;
}

export interface AuditLogRecord {
  id: string;
  adminId: string | null;
  adminEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: string | null;
  ipAddress: string | null;
  createdAt: Date;
}

// In-Memory Database Store Interface
interface MockDatabaseState {
  users: UserRecord[];
  applicants: ApplicantRecord[];
  applicantDocuments: ApplicantDocumentRecord[];
  statusHistories: ApplicationStatusHistoryRecord[];
  centres: CentreRecord[];
  visaTypes: VisaTypeRecord[];
  visaCategories: VisaCategoryRecord[];
  additionalServices: AdditionalServiceRecord[];
  holidays: HolidayRecord[];
  faqs: FAQRecord[];
  usefulLinks: UsefulLinkRecord[];
  announcements: AnnouncementRecord[];
  siteSettings: SiteSettingRecord[];
  auditLogs: AuditLogRecord[];
}

function initializeState(): MockDatabaseState {
  const now = new Date();

  // Admin user
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@spainvisa-portal.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminSpain2026!Secure";
  const adminName = process.env.ADMIN_NAME || "Super Administrator";
  const passwordHash = bcrypt.hashSync(adminPassword, 10);

  const users: UserRecord[] = [
    {
      id: "usr-admin-default",
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: Role.SUPER_ADMIN,
      mustChangePassword: false,
      createdAt: now,
      updatedAt: now,
    },
  ];

  // Centres
  const centres: CentreRecord[] = DEFAULT_CENTRES.map((c) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    country: c.country,
    address: c.address,
    submissionHours: c.submissionHours,
    passportCollectionHours: c.passportCollectionHours,
    phone: c.phone,
    email: c.email,
    mapUrl: c.mapUrl || null,
    isActive: c.isActive,
    createdAt: now,
    updatedAt: now,
  }));

  // Visa Types & Categories
  const visaTypes: VisaTypeRecord[] = [];
  const visaCategories: VisaCategoryRecord[] = [];

  for (const vt of DEFAULT_VISA_TYPES) {
    visaTypes.push({
      id: vt.id,
      code: vt.code,
      name: vt.name,
      tagline: vt.tagline,
      maxStay: vt.maxStay,
      overview: vt.overview,
      photoSpecifications: vt.photoSpecifications,
      processingTime: vt.processingTime,
      jurisdictionInfo: vt.jurisdictionInfo,
      formDownloadUrl: vt.formDownloadUrl,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    for (const cat of vt.categories) {
      visaCategories.push({
        id: cat.id,
        visaTypeId: vt.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        documentsRequired: cat.documentsRequired,
        standardFee: cat.standardFee,
        childFee: cat.childFee,
        blsServiceFee: cat.blsServiceFee,
        isActive: cat.isActive,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // Additional Services
  const additionalServices: AdditionalServiceRecord[] = DEFAULT_SERVICES.map((s, idx) => ({
    id: s.id || `srv-${idx + 1}`,
    title: s.title,
    description: s.description,
    price: s.price,
    currency: "INR",
    isOptional: true,
    isActive: s.isActive,
    createdAt: now,
    updatedAt: now,
  }));

  // FAQs
  const faqs: FAQRecord[] = DEFAULT_FAQS.map((f, idx) => ({
    id: f.id || `faq-${idx + 1}`,
    category: f.category,
    question: f.question,
    answer: f.answer,
    sortOrder: f.sortOrder,
    isActive: f.isActive,
    createdAt: now,
    updatedAt: now,
  }));

  // Holidays
  const holidays: HolidayRecord[] = DEFAULT_HOLIDAYS.map((h, idx) => ({
    id: h.id || `hol-${idx + 1}`,
    country: h.country,
    year: h.year,
    date: new Date(h.date),
    name: h.name,
    description: h.description,
    isActive: h.isActive,
    createdAt: now,
    updatedAt: now,
  }));

  // Useful Links
  const usefulLinks: UsefulLinkRecord[] = DEFAULT_USEFUL_LINKS.map((l, idx) => ({
    id: l.id || `lnk-${idx + 1}`,
    title: l.title,
    description: l.description,
    url: l.url,
    category: l.category,
    sortOrder: l.sortOrder,
    isActive: l.isActive,
    createdAt: now,
    updatedAt: now,
  }));

  // Announcements
  const announcements: AnnouncementRecord[] = DEFAULT_ANNOUNCEMENTS.map((a, idx) => ({
    id: a.id || `ann-${idx + 1}`,
    title: a.title,
    message: a.message,
    severity: a.severity as AnnouncementSeverity,
    isPublished: a.isPublished,
    startDate: null,
    endDate: null,
    createdAt: now,
    updatedAt: now,
  }));

  // Site Settings
  const siteSettings: SiteSettingRecord[] = Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({
    key,
    value,
    description: null,
    updatedAt: now,
  }));

  // Sample Applicants for realistic Demo / Dashboard experience
  const sampleApplicantsData = [
    {
      id: "app-1",
      ref: "BLS-2026-X8K9M2",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      dob: new Date("1992-05-14"),
      passport: "Z1234567",
      visaType: "SCHENGEN",
      visaCategory: "Tourist Visa",
      centre: "New Delhi",
      status: ApplicationStatus.SUBMITTED,
      daysAgo: 1,
    },
    {
      id: "app-2",
      ref: "BLS-2026-P3N7B5",
      name: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 98111 22334",
      dob: new Date("1988-11-20"),
      passport: "P8921456",
      visaType: "SCHENGEN",
      visaCategory: "Business Visa",
      centre: "Mumbai",
      status: ApplicationStatus.PROCESSING,
      daysAgo: 4,
    },
    {
      id: "app-3",
      ref: "BLS-2026-K4L2R9",
      name: "Amitabh Sen",
      email: "amitabh.sen@example.com",
      phone: "+91 99000 88776",
      dob: new Date("1995-03-08"),
      passport: "R3344556",
      visaType: "SCHENGEN",
      visaCategory: "Tourist Visa",
      centre: "Kolkata",
      status: ApplicationStatus.DOCUMENTS_UNDER_REVIEW,
      daysAgo: 2,
    },
    {
      id: "app-4",
      ref: "BLS-2026-W9V5C1",
      name: "Sunita Verma",
      email: "sunita.verma@example.com",
      phone: "+91 94444 55566",
      dob: new Date("1984-09-25"),
      passport: "M7788990",
      visaType: "SCHENGEN",
      visaCategory: "Tourist Visa",
      centre: "Bengaluru",
      status: ApplicationStatus.APPOINTMENT_CONFIRMED,
      daysAgo: 6,
    },
    {
      id: "app-5",
      ref: "BLS-2026-T2J8D6",
      name: "Vikram Malhotra",
      email: "vikram.m@example.com",
      phone: "+91 98222 33445",
      dob: new Date("1990-12-01"),
      passport: "S5566778",
      visaType: "NATIONAL",
      visaCategory: "Student Visa >90 days",
      centre: "New Delhi",
      status: ApplicationStatus.READY_FOR_COLLECTION,
      daysAgo: 10,
    },
    {
      id: "app-6",
      ref: "BLS-2026-M7Q3Y4",
      name: "Ananya Desai",
      email: "ananya.desai@example.com",
      phone: "+91 97654 32109",
      dob: new Date("1997-07-19"),
      passport: "K9900112",
      visaType: "SCHENGEN",
      visaCategory: "Relative of EEA/EU Citizens",
      centre: "Ahmedabad",
      status: ApplicationStatus.COMPLETED,
      daysAgo: 15,
    },
  ];

  const applicants: ApplicantRecord[] = [];
  const statusHistories: ApplicationStatusHistoryRecord[] = [];
  const applicantDocuments: ApplicantDocumentRecord[] = [];

  for (const s of sampleApplicantsData) {
    const createdAt = new Date(Date.now() - s.daysAgo * 86400000);
    applicants.push({
      id: s.id,
      referenceNumber: s.ref,
      name: s.name,
      email: s.email,
      phone: s.phone,
      dateOfBirth: s.dob,
      passportNumber: s.passport,
      nationality: "Indian",
      visaType: s.visaType,
      visaCategory: s.visaCategory,
      centreName: s.centre,
      status: s.status,
      consentGiven: true,
      notes: null,
      createdAt,
      updatedAt: createdAt,
    });

    statusHistories.push({
      id: `hist-${s.id}-1`,
      applicantId: s.id,
      oldStatus: null,
      newStatus: ApplicationStatus.SUBMITTED,
      changedBy: "APPLICANT_PORTAL",
      note: "Application submitted online with required biometric & identity documents.",
      createdAt,
    });

    if (s.status !== ApplicationStatus.SUBMITTED) {
      statusHistories.push({
        id: `hist-${s.id}-2`,
        applicantId: s.id,
        oldStatus: ApplicationStatus.SUBMITTED,
        newStatus: s.status,
        changedBy: "SYSTEM",
        note: `Application transitioned to ${s.status}.`,
        createdAt: new Date(createdAt.getTime() + 3600000),
      });
    }

    // Default 3 sample documents
    const docTypes: DocumentType[] = [DocumentType.THUMB, DocumentType.PASSPORT, DocumentType.AADHAAR];
    for (const dt of docTypes) {
      applicantDocuments.push({
        id: `doc-${s.id}-${dt.toLowerCase()}`,
        applicantId: s.id,
        type: dt,
        originalName: `${dt.toLowerCase()}_sample.jpg`,
        storedName: `${dt.toLowerCase()}_${s.id}.jpg`,
        mimeType: "image/jpeg",
        size: 150000,
        storagePath: `applicants/${s.id}/${dt.toLowerCase()}/${dt.toLowerCase()}_sample.jpg`,
        createdAt,
      });
    }
  }

  const auditLogs: AuditLogRecord[] = [
    {
      id: "log-init-1",
      adminId: "usr-admin-default",
      adminEmail: adminEmail,
      action: "LOGIN",
      entityType: "USER",
      entityId: "usr-admin-default",
      metadata: JSON.stringify({ role: Role.SUPER_ADMIN }),
      ipAddress: "127.0.0.1",
      createdAt: now,
    },
  ];

  return {
    users,
    applicants,
    applicantDocuments,
    statusHistories,
    centres,
    visaTypes,
    visaCategories,
    additionalServices,
    holidays,
    faqs,
    usefulLinks,
    announcements,
    siteSettings,
    auditLogs,
  };
}

// Global persistence across hot reloads in development & serverless runs
const globalForMock = globalThis as unknown as {
  __mockDb: MockDatabaseState | undefined;
};

if (!globalForMock.__mockDb) {
  globalForMock.__mockDb = initializeState();
}

const db = globalForMock.__mockDb;

// Utility comparison function for Prisma-like where clauses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function matchesWhere(item: any, where: any): boolean {
  if (!where || Object.keys(where).length === 0) return true;

  for (const [key, filter] of Object.entries(where)) {
    if (filter === undefined) continue;

    if (key === "OR" && Array.isArray(filter)) {
      const orMatched = filter.some((subWhere) => matchesWhere(item, subWhere));
      if (!orMatched) return false;
      continue;
    }
    if (key === "AND" && Array.isArray(filter)) {
      const andMatched = filter.every((subWhere) => matchesWhere(item, subWhere));
      if (!andMatched) return false;
      continue;
    }

    const val = item[key];

    if (typeof filter === "object" && filter !== null) {
      if ("contains" in filter) {
        const query = String((filter as { contains: string }).contains).toLowerCase();
        const target = String(val || "").toLowerCase();
        if (!target.includes(query)) return false;
        continue;
      }
      if ("gte" in filter) {
        const targetDate = new Date(val).getTime();
        const gteDate = new Date((filter as { gte: Date | string }).gte).getTime();
        if (targetDate < gteDate) return false;
        continue;
      }
      if ("lte" in filter) {
        const targetDate = new Date(val).getTime();
        const lteDate = new Date((filter as { lte: Date | string }).lte).getTime();
        if (targetDate > lteDate) return false;
        continue;
      }
      if ("in" in filter && Array.isArray((filter as { in: unknown[] }).in)) {
        if (!(filter as { in: unknown[] }).in.includes(val)) return false;
        continue;
      }
    }

    if (val instanceof Date && filter instanceof Date) {
      if (val.getTime() !== filter.getTime()) return false;
      continue;
    }

    if (val !== filter) {
      return false;
    }
  }

  return true;
}

// Utility sort function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortItems<T>(items: T[], orderBy: any): T[] {
  if (!orderBy) return items;
  const orderList = Array.isArray(orderBy) ? orderBy : [orderBy];

  return [...items].sort((a: any, b: any) => {
    for (const order of orderList) {
      for (const [key, direction] of Object.entries(order)) {
        const dir = direction === "desc" ? -1 : 1;
        const valA = a[key];
        const valB = b[key];
        if (valA === valB) continue;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        if (valA instanceof Date && valB instanceof Date) {
          return (valA.getTime() - valB.getTime()) * dir;
        }
        if (typeof valA === "string" && typeof valB === "string") {
          return valA.localeCompare(valB) * dir;
        }
        return (valA > valB ? 1 : -1) * dir;
      }
    }
    return 0;
  });
}

// Project selected fields
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function projectFields(item: any, select?: any): any {
  if (!select || !item) return item;
  const res: any = {};
  for (const [key, val] of Object.entries(select)) {
    if (val) {
      res[key] = item[key];
    }
  }
  return res;
}

// Helper to create a unique ID
function uid(prefix = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Drop-in Mock Prisma Client with zero database or SQL requirements
 */
export const prisma = {
  // USER
  user: {
    findUnique: async (args: { where: { email?: string; id?: string }; select?: any }) => {
      const u = db.users.find((user) => {
        if (args.where.email && user.email.toLowerCase() === args.where.email.toLowerCase()) return true;
        if (args.where.id && user.id === args.where.id) return true;
        return false;
      });
      return u ? projectFields(u, args.select) : null;
    },
    findFirst: async (args: { where?: any; select?: any }) => {
      const u = db.users.find((user) => matchesWhere(user, args.where));
      return u ? projectFields(u, args.select) : null;
    },
    findMany: async (args?: { where?: any; select?: any }) => {
      return db.users.filter((user) => matchesWhere(user, args?.where)).map((u) => projectFields(u, args?.select));
    },
    create: async (args: { data: any }) => {
      const now = new Date();
      const newUser: UserRecord = {
        id: args.data.id || uid("usr"),
        email: args.data.email,
        passwordHash: args.data.passwordHash,
        name: args.data.name,
        role: args.data.role || Role.ADMIN,
        mustChangePassword: Boolean(args.data.mustChangePassword),
        createdAt: now,
        updatedAt: now,
      };
      db.users.push(newUser);
      return newUser;
    },
    update: async (args: { where: { id?: string; email?: string }; data: any }) => {
      const idx = db.users.findIndex((u) => (args.where.id ? u.id === args.where.id : u.email === args.where.email));
      if (idx === -1) throw new Error("User not found");
      const updated = { ...db.users[idx], ...args.data, updatedAt: new Date() };
      db.users[idx] = updated;
      return updated;
    },
    upsert: async (args: { where: { email: string }; update: any; create: any }) => {
      const existing = db.users.find((u) => u.email.toLowerCase() === args.where.email.toLowerCase());
      if (existing) {
        return prisma.user.update({ where: { email: args.where.email }, data: args.update });
      }
      return prisma.user.create({ data: args.create });
    },
  },

  // APPLICANT
  applicant: {
    findUnique: async (args: { where: { id?: string; referenceNumber?: string }; include?: any; select?: any }) => {
      const app = db.applicants.find((a) => {
        if (args.where.id && a.id === args.where.id) return true;
        if (args.where.referenceNumber && a.referenceNumber.toUpperCase() === args.where.referenceNumber.toUpperCase()) return true;
        return false;
      });
      if (!app) return null;

      const result = { ...app } as any;

      if (args.include?.documents) {
        const docs = db.applicantDocuments.filter((d) => d.applicantId === app.id);
        result.documents = docs.map((d) => projectFields(d, args.include.documents?.select));
      }

      if (args.include?.statusHistory) {
        const hist = db.statusHistories.filter((h) => h.applicantId === app.id);
        result.statusHistory = sortItems(hist, args.include.statusHistory?.orderBy);
      }

      return projectFields(result, args.select);
    },
    findMany: async (args?: { where?: any; skip?: number; take?: number; orderBy?: any; select?: any }) => {
      let filtered = db.applicants.filter((a) => matchesWhere(a, args?.where));
      filtered = sortItems(filtered, args?.orderBy);

      if (args?.skip) filtered = filtered.slice(args.skip);
      if (args?.take) filtered = filtered.slice(0, args.take);

      return filtered.map((a) => {
        const res = { ...a } as any;
        if (args?.select?._count?.select?.documents) {
          res._count = { documents: db.applicantDocuments.filter((d) => d.applicantId === a.id).length };
        }
        return projectFields(res, args?.select);
      });
    },
    create: async (args: { data: any }) => {
      const now = new Date();
      const newApp: ApplicantRecord = {
        id: args.data.id || uid("app"),
        referenceNumber: args.data.referenceNumber,
        name: args.data.name,
        email: args.data.email,
        phone: args.data.phone,
        dateOfBirth: args.data.dateOfBirth ? new Date(args.data.dateOfBirth) : null,
        passportNumber: args.data.passportNumber || null,
        nationality: args.data.nationality || "Indian",
        visaType: args.data.visaType || "SCHENGEN",
        visaCategory: args.data.visaCategory || "Tourist Visa",
        centreName: args.data.centreName || "New Delhi",
        status: args.data.status || ApplicationStatus.SUBMITTED,
        consentGiven: Boolean(args.data.consentGiven),
        notes: args.data.notes || null,
        createdAt: now,
        updatedAt: now,
      };
      db.applicants.unshift(newApp);
      return newApp;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const idx = db.applicants.findIndex((a) => a.id === args.where.id);
      if (idx === -1) throw new Error("Applicant not found");
      const updated = { ...db.applicants[idx], ...args.data, updatedAt: new Date() };
      db.applicants[idx] = updated;
      return updated;
    },
    delete: async (args: { where: { id: string } }) => {
      const idx = db.applicants.findIndex((a) => a.id === args.where.id);
      if (idx === -1) throw new Error("Applicant not found");
      const removed = db.applicants.splice(idx, 1)[0];
      // Cascade delete documents & status histories
      db.applicantDocuments = db.applicantDocuments.filter((d) => d.applicantId !== args.where.id);
      db.statusHistories = db.statusHistories.filter((h) => h.applicantId !== args.where.id);
      return removed;
    },
    count: async (args?: { where?: any }) => {
      return db.applicants.filter((a) => matchesWhere(a, args?.where)).length;
    },
    groupBy: async (args: { by: string[]; _count?: { id: boolean }; orderBy?: any; take?: number }) => {
      const field = args.by[0];
      const counts: Record<string, number> = {};

      for (const a of db.applicants) {
        const val = (a as any)[field] || "UNKNOWN";
        counts[val] = (counts[val] || 0) + 1;
      }

      let result = Object.entries(counts).map(([val, count]) => ({
        [field]: val,
        _count: { id: count },
      }));

      if (args.orderBy?._count?.id === "desc") {
        result.sort((a, b) => b._count.id - a._count.id);
      }
      if (args.take) {
        result = result.slice(0, args.take);
      }

      return result;
    },
  },

  // APPLICANT DOCUMENT
  applicantDocument: {
    findUnique: async (args: { where: { id: string }; include?: any }) => {
      const doc = db.applicantDocuments.find((d) => d.id === args.where.id);
      if (!doc) return null;
      const res = { ...doc } as any;
      if (args.include?.applicant) {
        const applicant = db.applicants.find((a) => a.id === doc.applicantId);
        res.applicant = projectFields(applicant, args.include.applicant?.select);
      }
      return res;
    },
    findMany: async (args?: { where?: any; select?: any }) => {
      return db.applicantDocuments.filter((d) => matchesWhere(d, args?.where)).map((d) => projectFields(d, args?.select));
    },
    create: async (args: { data: any }) => {
      const doc: ApplicantDocumentRecord = {
        id: args.data.id || uid("doc"),
        applicantId: args.data.applicantId,
        type: args.data.type,
        originalName: args.data.originalName,
        storedName: args.data.storedName,
        mimeType: args.data.mimeType,
        size: args.data.size,
        storagePath: args.data.storagePath,
        createdAt: new Date(),
      };
      db.applicantDocuments.push(doc);
      return doc;
    },
    count: async (args?: { where?: any }) => {
      return db.applicantDocuments.filter((d) => matchesWhere(d, args?.where)).length;
    },
  },

  // APPLICATION STATUS HISTORY
  applicationStatusHistory: {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      let filtered = db.statusHistories.filter((h) => matchesWhere(h, args?.where));
      return sortItems(filtered, args?.orderBy);
    },
    create: async (args: { data: any }) => {
      const record: ApplicationStatusHistoryRecord = {
        id: args.data.id || uid("hist"),
        applicantId: args.data.applicantId,
        oldStatus: args.data.oldStatus || null,
        newStatus: args.data.newStatus,
        changedBy: args.data.changedBy || "SYSTEM",
        note: args.data.note || null,
        createdAt: new Date(),
      };
      db.statusHistories.push(record);
      return record;
    },
  },

  // CENTRE
  centre: {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      const filtered = db.centres.filter((c) => matchesWhere(c, args?.where));
      return sortItems(filtered, args?.orderBy);
    },
    findUnique: async (args: { where: { id?: string; code?: string } }) => {
      return db.centres.find((c) => (args.where.id ? c.id === args.where.id : c.code === args.where.code)) || null;
    },
    create: async (args: { data: any }) => {
      const now = new Date();
      const centre: CentreRecord = {
        id: args.data.id || uid("cntr"),
        code: args.data.code,
        name: args.data.name,
        country: args.data.country || "India",
        address: args.data.address,
        submissionHours: args.data.submissionHours,
        passportCollectionHours: args.data.passportCollectionHours,
        phone: args.data.phone,
        email: args.data.email,
        mapUrl: args.data.mapUrl || null,
        isActive: args.data.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };
      db.centres.push(centre);
      return centre;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const idx = db.centres.findIndex((c) => c.id === args.where.id);
      if (idx === -1) throw new Error("Centre not found");
      const updated = { ...db.centres[idx], ...args.data, updatedAt: new Date() };
      db.centres[idx] = updated;
      return updated;
    },
    delete: async (args: { where: { id: string } }) => {
      const idx = db.centres.findIndex((c) => c.id === args.where.id);
      if (idx === -1) throw new Error("Centre not found");
      return db.centres.splice(idx, 1)[0];
    },
    upsert: async (args: { where: { code: string }; update: any; create: any }) => {
      const existing = db.centres.find((c) => c.code === args.where.code);
      if (existing) {
        return prisma.centre.update({ where: { id: existing.id }, data: args.update });
      }
      return prisma.centre.create({ data: args.create });
    },
  },

  // VISA TYPE
  visaType: {
    findMany: async (args?: { where?: any; include?: any; orderBy?: any }) => {
      let filtered = db.visaTypes.filter((vt) => matchesWhere(vt, args?.where));
      filtered = sortItems(filtered, args?.orderBy);

      if (args?.include?.categories) {
        return filtered.map((vt) => {
          let cats = db.visaCategories.filter((c) => c.visaTypeId === vt.id);
          cats = cats.filter((c) => matchesWhere(c, args.include.categories?.where));
          cats = sortItems(cats, args.include.categories?.orderBy);
          return { ...vt, categories: cats };
        });
      }
      return filtered;
    },
    findUnique: async (args: { where: { code?: string; id?: string } }) => {
      return db.visaTypes.find((vt) => (args.where.id ? vt.id === args.where.id : vt.code === args.where.code)) || null;
    },
    upsert: async (args: { where: { code: string }; update: any; create: any }) => {
      const existing = db.visaTypes.find((vt) => vt.code === args.where.code);
      if (existing) {
        const idx = db.visaTypes.indexOf(existing);
        db.visaTypes[idx] = { ...existing, ...args.update, updatedAt: new Date() };
        return db.visaTypes[idx];
      }
      const now = new Date();
      const newVt: VisaTypeRecord = {
        id: args.create.id || uid("vt"),
        code: args.create.code,
        name: args.create.name,
        tagline: args.create.tagline || null,
        maxStay: args.create.maxStay || "",
        overview: args.create.overview || "",
        photoSpecifications: args.create.photoSpecifications || "",
        processingTime: args.create.processingTime || "",
        jurisdictionInfo: args.create.jurisdictionInfo || null,
        formDownloadUrl: args.create.formDownloadUrl || null,
        isActive: args.create.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };
      db.visaTypes.push(newVt);
      return newVt;
    },
  },

  // VISA CATEGORY
  visaCategory: {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      const filtered = db.visaCategories.filter((c) => matchesWhere(c, args?.where));
      return sortItems(filtered, args?.orderBy);
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const idx = db.visaCategories.findIndex((c) => c.id === args.where.id);
      if (idx === -1) throw new Error("Category not found");
      const updated = { ...db.visaCategories[idx], ...args.data, updatedAt: new Date() };
      db.visaCategories[idx] = updated;
      return updated;
    },
    upsert: async (args: { where: { id: string }; update: any; create: any }) => {
      const existing = db.visaCategories.find((c) => c.id === args.where.id);
      if (existing) {
        return prisma.visaCategory.update({ where: { id: existing.id }, data: args.update });
      }
      const now = new Date();
      const newCat: VisaCategoryRecord = {
        id: args.create.id || uid("cat"),
        visaTypeId: args.create.visaTypeId,
        name: args.create.name,
        slug: args.create.slug,
        description: args.create.description || "",
        documentsRequired: args.create.documentsRequired || "",
        standardFee: args.create.standardFee ?? 9599,
        childFee: args.create.childFee ?? 4799,
        blsServiceFee: args.create.blsServiceFee ?? 1802,
        isActive: args.create.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };
      db.visaCategories.push(newCat);
      return newCat;
    },
  },

  // ADDITIONAL SERVICE
  additionalService: {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      const filtered = db.additionalServices.filter((s) => matchesWhere(s, args?.where));
      return sortItems(filtered, args?.orderBy);
    },
    findFirst: async (args: { where?: any }) => {
      return db.additionalServices.find((s) => matchesWhere(s, args.where)) || null;
    },
    create: async (args: { data: any }) => {
      const now = new Date();
      const record: AdditionalServiceRecord = {
        id: args.data.id || uid("srv"),
        title: args.data.title,
        description: args.data.description,
        price: args.data.price,
        currency: args.data.currency || "INR",
        isOptional: args.data.isOptional ?? true,
        isActive: args.data.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };
      db.additionalServices.push(record);
      return record;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const idx = db.additionalServices.findIndex((s) => s.id === args.where.id);
      if (idx === -1) throw new Error("Service not found");
      const updated = { ...db.additionalServices[idx], ...args.data, updatedAt: new Date() };
      db.additionalServices[idx] = updated;
      return updated;
    },
    delete: async (args: { where: { id: string } }) => {
      const idx = db.additionalServices.findIndex((s) => s.id === args.where.id);
      if (idx === -1) throw new Error("Service not found");
      return db.additionalServices.splice(idx, 1)[0];
    },
  },

  // HOLIDAY
  holiday: {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      const filtered = db.holidays.filter((h) => matchesWhere(h, args?.where));
      return sortItems(filtered, args?.orderBy);
    },
    findFirst: async (args: { where?: any }) => {
      return db.holidays.find((h) => matchesWhere(h, args.where)) || null;
    },
    create: async (args: { data: any }) => {
      const now = new Date();
      const record: HolidayRecord = {
        id: args.data.id || uid("hol"),
        country: args.data.country,
        year: args.data.year,
        date: new Date(args.data.date),
        name: args.data.name,
        description: args.data.description || null,
        isActive: args.data.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };
      db.holidays.push(record);
      return record;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const idx = db.holidays.findIndex((h) => h.id === args.where.id);
      if (idx === -1) throw new Error("Holiday not found");
      const updated = {
        ...db.holidays[idx],
        ...args.data,
        date: args.data.date ? new Date(args.data.date) : db.holidays[idx].date,
        updatedAt: new Date(),
      };
      db.holidays[idx] = updated;
      return updated;
    },
    delete: async (args: { where: { id: string } }) => {
      const idx = db.holidays.findIndex((h) => h.id === args.where.id);
      if (idx === -1) throw new Error("Holiday not found");
      return db.holidays.splice(idx, 1)[0];
    },
  },

  // FAQ
  fAQ: {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      const filtered = db.faqs.filter((f) => matchesWhere(f, args?.where));
      return sortItems(filtered, args?.orderBy);
    },
    findFirst: async (args: { where?: any }) => {
      return db.faqs.find((f) => matchesWhere(f, args.where)) || null;
    },
    create: async (args: { data: any }) => {
      const now = new Date();
      const record: FAQRecord = {
        id: args.data.id || uid("faq"),
        category: args.data.category || "General",
        question: args.data.question,
        answer: args.data.answer,
        sortOrder: args.data.sortOrder ?? 0,
        isActive: args.data.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };
      db.faqs.push(record);
      return record;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const idx = db.faqs.findIndex((f) => f.id === args.where.id);
      if (idx === -1) throw new Error("FAQ not found");
      const updated = { ...db.faqs[idx], ...args.data, updatedAt: new Date() };
      db.faqs[idx] = updated;
      return updated;
    },
    delete: async (args: { where: { id: string } }) => {
      const idx = db.faqs.findIndex((f) => f.id === args.where.id);
      if (idx === -1) throw new Error("FAQ not found");
      return db.faqs.splice(idx, 1)[0];
    },
  },

  // USEFUL LINK
  usefulLink: {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      const filtered = db.usefulLinks.filter((l) => matchesWhere(l, args?.where));
      return sortItems(filtered, args?.orderBy);
    },
    findFirst: async (args: { where?: any }) => {
      return db.usefulLinks.find((l) => matchesWhere(l, args.where)) || null;
    },
    create: async (args: { data: any }) => {
      const now = new Date();
      const record: UsefulLinkRecord = {
        id: args.data.id || uid("lnk"),
        title: args.data.title,
        description: args.data.description,
        url: args.data.url,
        category: args.data.category || "Official",
        sortOrder: args.data.sortOrder ?? 0,
        isActive: args.data.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };
      db.usefulLinks.push(record);
      return record;
    },
  },

  // ANNOUNCEMENT
  announcement: {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      const filtered = db.announcements.filter((a) => matchesWhere(a, args?.where));
      return sortItems(filtered, args?.orderBy);
    },
    findFirst: async (args: { where?: any }) => {
      return db.announcements.find((a) => matchesWhere(a, args.where)) || null;
    },
    create: async (args: { data: any }) => {
      const now = new Date();
      const record: AnnouncementRecord = {
        id: args.data.id || uid("ann"),
        title: args.data.title,
        message: args.data.message,
        severity: args.data.severity || AnnouncementSeverity.INFO,
        isPublished: args.data.isPublished ?? true,
        startDate: args.data.startDate ? new Date(args.data.startDate) : null,
        endDate: args.data.endDate ? new Date(args.data.endDate) : null,
        createdAt: now,
        updatedAt: now,
      };
      db.announcements.push(record);
      return record;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const idx = db.announcements.findIndex((a) => a.id === args.where.id);
      if (idx === -1) throw new Error("Announcement not found");
      const updated = { ...db.announcements[idx], ...args.data, updatedAt: new Date() };
      db.announcements[idx] = updated;
      return updated;
    },
    delete: async (args: { where: { id: string } }) => {
      const idx = db.announcements.findIndex((a) => a.id === args.where.id);
      if (idx === -1) throw new Error("Announcement not found");
      return db.announcements.splice(idx, 1)[0];
    },
  },

  // SITE SETTING
  siteSetting: {
    findMany: async (args?: { orderBy?: any }) => {
      return sortItems(db.siteSettings, args?.orderBy);
    },
    findUnique: async (args: { where: { key: string } }) => {
      return db.siteSettings.find((s) => s.key === args.where.key) || null;
    },
    create: async (args: { data: any }) => {
      const now = new Date();
      const record: SiteSettingRecord = {
        key: args.data.key,
        value: args.data.value,
        description: args.data.description || null,
        updatedAt: now,
      };
      db.siteSettings.push(record);
      return record;
    },
    update: async (args: { where: { key: string }; data: any }) => {
      const idx = db.siteSettings.findIndex((s) => s.key === args.where.key);
      if (idx === -1) throw new Error("Setting not found");
      const updated = { ...db.siteSettings[idx], ...args.data, updatedAt: new Date() };
      db.siteSettings[idx] = updated;
      return updated;
    },
    upsert: async (args: { where: { key: string }; update: any; create: any }) => {
      const existing = db.siteSettings.find((s) => s.key === args.where.key);
      if (existing) {
        return prisma.siteSetting.update({ where: { key: existing.key }, data: args.update });
      }
      return prisma.siteSetting.create({ data: args.create });
    },
  },

  // AUDIT LOG
  auditLog: {
    create: async (args: { data: any }) => {
      const record: AuditLogRecord = {
        id: args.data.id || uid("log"),
        adminId: args.data.adminId || null,
        adminEmail: args.data.adminEmail || null,
        action: args.data.action,
        entityType: args.data.entityType,
        entityId: args.data.entityId || null,
        metadata: typeof args.data.metadata === "string" ? args.data.metadata : JSON.stringify(args.data.metadata || {}),
        ipAddress: args.data.ipAddress || null,
        createdAt: new Date(),
      };
      db.auditLogs.unshift(record);
      return record;
    },
    findMany: async (args?: { where?: any; orderBy?: any; take?: number; include?: any }) => {
      let filtered = db.auditLogs.filter((l) => matchesWhere(l, args?.where));
      filtered = sortItems(filtered, args?.orderBy);
      if (args?.take) filtered = filtered.slice(0, args.take);

      if (args?.include?.admin) {
        return filtered.map((l) => {
          const admin = db.users.find((u) => u.id === l.adminId);
          return {
            ...l,
            admin: admin ? projectFields(admin, args.include.admin?.select) : null,
          };
        });
      }
      return filtered;
    },
  },

  $disconnect: async () => {},
};
