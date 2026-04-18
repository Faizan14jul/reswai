import { NextResponse } from "next/server";
import { addWaitlistSignup } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; role?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    await addWaitlistSignup(email, body.role);

    return NextResponse.json({
      success: true,
      message: "You're on the list. We'll email you before launch.",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE")) {
      return NextResponse.json(
        {
          success: true,
          message: "This email is already on the waitlist.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
