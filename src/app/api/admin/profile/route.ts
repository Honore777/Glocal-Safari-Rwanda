import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { comparePassword, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    
    if (!session?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: session.value },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    
    if (!session?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { email, currentPassword, newPassword } = await request.json();

    const admin = await prisma.admin.findUnique({
      where: { id: session.value },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const updateData: { email?: string; password?: string } = {};

    if (email && email !== admin.email) {
      const existingAdmin = await prisma.admin.findUnique({
        where: { email },
      });
      if (existingAdmin) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
      updateData.email = email;
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password required" }, { status: 400 });
      }
      
      const isValid = await comparePassword(currentPassword, admin.password);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      
      updateData.password = await hashPassword(newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: session.value },
      data: updateData,
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json(updatedAdmin);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
