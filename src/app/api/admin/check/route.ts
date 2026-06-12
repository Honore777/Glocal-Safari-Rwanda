import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  const authenticated = await isAdmin();
  if (authenticated) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
