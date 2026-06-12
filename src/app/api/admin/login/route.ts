import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 });
    }

    const result = await verifyAdmin(email, password);

    if (result.success && result.adminId) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_session", result.adminId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
