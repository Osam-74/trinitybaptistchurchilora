import { NextRequest, NextResponse } from "next/server";

const PROFANITY_LIST = ["damn", "hell", "crap", "stupid", "idiot", "moron", "fool", "useless"];

function hasProfanity(text: string): boolean {
  return PROFANITY_LIST.some((word) => text.toLowerCase().includes(word));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, displayName, text, deviceToken } = body;

    if (!postId || !displayName || !text || !deviceToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (displayName.length > 50 || text.length > 1000) {
      return NextResponse.json({ error: "Content too long" }, { status: 400 });
    }

    if (hasProfanity(text)) {
      return NextResponse.json({ error: "Comment contains inappropriate language" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Comment submitted",
      comment: { id: `comment-${Date.now()}`, postId, displayName, text, status: "visible", createdAt: new Date().toISOString(), deviceToken },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
