import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session?.value) return false;

  const admin = await prisma.admin.findUnique({
    where: { id: session.value },
  });

  return !!admin;
}

export async function setAdminSession(adminId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

export async function verifyAdmin(email: string, password: string): Promise<{ success: boolean; adminId?: string }> {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return { success: false };
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return { success: false };
  }

  return { success: true, adminId: admin.id };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
