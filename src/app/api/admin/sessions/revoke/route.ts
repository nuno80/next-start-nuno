// src/app/api/admin/sessions/revoke/route.ts
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAuth, ROLES } from "@/utils/require-auth";
import db from "@/db";
import sessions from "@/db/schema/sessions";

export async function POST(request: Request) {
  try {
    await requireAuth(ROLES.ADMIN);

    const { sessionToken } = await request.json();

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 }
      );
    }

    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));

    return NextResponse.json({ message: "Session revoked successfully" });
  } catch (error) {
    console.error("Error revoking session:", error);
    return NextResponse.json(
      { error: "Failed to revoke session" },
      { status: 500 }
    );
  }
}