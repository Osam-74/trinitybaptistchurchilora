import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "You have been unsubscribed from weekly reminders." });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
