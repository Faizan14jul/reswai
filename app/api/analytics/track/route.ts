import { NextResponse } from "next/server";
import { addPageView } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { path?: string; visitorKey?: string };
    const path = body.path || "/";

    await addPageView(path, body.visitorKey);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to track page view." }, { status: 500 });
  }
}
