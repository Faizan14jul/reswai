import { NextResponse } from "next/server";
import { getOwnerEmail } from "@/lib/db";
import { setAdminSession, verifyAdminPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password || "";

  if (email !== getOwnerEmail().toLowerCase()) {
    return NextResponse.json({ error: "Only the owner account can access this panel." }, { status: 403 });
  }

  const isValid = await verifyAdminPassword(password);

  if (!isValid) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  await setAdminSession(email);

  return NextResponse.json({ success: true });
}
