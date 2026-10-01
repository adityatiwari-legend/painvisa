import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { Role, prisma } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "f9b4c09d31e9a263884b2c127402685df5b6192138fa0c0bb76e62f592a80695"
);

const SESSION_COOKIE_NAME = "spainvisa_admin_session";
const SESSION_DURATION_HOURS = 8;

export interface AdminSessionPayload {
  sub: string; // User ID
  email: string;
  name: string;
  role: Role;
  mustChangePassword: boolean;
}

/**
 * Creates signed session JWT
 */
export async function createAdminSessionToken(payload: AdminSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_HOURS}h`)
    .sign(JWT_SECRET);
}

/**
 * Verifies signed session JWT
 */
export async function verifyAdminSessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as Role,
      mustChangePassword: Boolean(payload.mustChangePassword),
    };
  } catch {
    return null;
  }
}

/**
 * Sets secure HTTP-only session cookie
 */
export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_HOURS * 3600,
  });
}

/**
 * Clears session cookie
 */
export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Gets currently authenticated admin from cookies
 */
export async function getCurrentAdmin(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    return await verifyAdminSessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Enforces admin authorization. Returns user or throws / returns null.
 */
export async function requireAdmin(allowedRoles?: Role[]): Promise<AdminSessionPayload> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("UNAUTHORIZED: Session expired or invalid.");
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(admin.role)) {
      throw new Error(`FORBIDDEN: Insufficient permissions for role ${admin.role}.`);
    }
  }

  return admin;
}

/**
 * Helper to verify password
 */
export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}

/**
 * Helper to hash password
 */
export async function hashPassword(plain: string): Promise<string> {
  return await bcrypt.hash(plain, 10);
}
