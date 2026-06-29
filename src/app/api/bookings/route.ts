import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, topic, meetingType, slotStart, slotEnd } = body;

    if (!name || !email || !phone || !topic || !slotStart || !slotEnd) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      booking: { id: `booking-${Date.now()}`, name, email, slotStart, slotEnd, topic, meetingType, status: "requested", createdAt: new Date().toISOString() },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
