// src/app/api/admin/sessions/route.ts
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAuth, ROLES } from "@/utils/require-auth";
import db from "@/db";
import users from "@/db/schema/users";
import accounts from "@/db/schema/accounts";

export async function GET() {
  try {
    // Verifica che l'utente sia admin
    await requireAuth(ROLES.ADMIN);

    // Recupera tutte le sessioni attive
    const now = new Date();
    const activeSessions = await db.query.sessions.findMany({
      where: (sessions, { gt }) => gt(sessions.expires, now),
    });

    // Arricchisci i dati delle sessioni con informazioni sugli utenti
    const enhancedSessions = await Promise.all(
      activeSessions.map(async (session) => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, session.userId),
        });

        const userAccount = await db.query.accounts.findFirst({
          where: eq(accounts.userId, session.userId),
        });

        return {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires.toISOString(),
          userEmail: user?.email, // <-- Comma added here
          userName: user?.name,   // <-- Comma added here
          userRole: userAccount?.role || ROLES.USER,
        };
      })
    );

    return NextResponse.json(enhancedSessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}