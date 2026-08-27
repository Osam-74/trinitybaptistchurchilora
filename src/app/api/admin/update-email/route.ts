import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { uid, newEmail } = await req.json();

    if (!uid || !newEmail) {
      return NextResponse.json({ error: "Missing uid or newEmail" }, { status: 400 });
    }

    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      return NextResponse.json(
        { error: "Server not configured. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to your Vercel environment variables." },
        { status: 500 }
      );
    }

    // Update the user's email in Firebase Auth
    await adminAuth.updateUser(uid, { email: newEmail.trim() });

    return NextResponse.json({ success: true, message: "Email updated successfully" });
  } catch (err) {
    const code = (err as { code?: string })?.code ?? "";
    const message = (err as { message?: string })?.message ?? "Unknown error";

    if (code === "auth/email-already-exists") {
      return NextResponse.json({ error: "That email is already in use by another account." }, { status: 409 });
    }
    if (code === "auth/invalid-email") {
      return NextResponse.json({ error: "That doesn't look like a valid email address." }, { status: 400 });
    }
    if (code === "auth/user-not-found") {
      return NextResponse.json({ error: "User not found in Firebase Auth." }, { status: 404 });
    }

    console.error("[Admin API] Update email error:", code, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
