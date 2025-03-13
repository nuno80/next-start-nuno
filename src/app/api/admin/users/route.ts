// src/app/api/admin/users/route.ts
import db from "@/db";
import accounts from "@/db/schema/accounts";
import { requireAuth, ROLES } from "@/utils/require-auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Verifica che l'utente sia admin
    await requireAuth(ROLES.ADMIN);

    // Ottieni tutti gli utenti
    const usersData = await db.query.users.findMany();

    // Per ogni utente, recupera il ruolo dall'account
    const enhancedUsers = await Promise.all(
      usersData.map(async (user) => {
        const userAccount = await db.query.accounts.findFirst({
          where: eq(accounts.userId, user.id),
        });

        return {
          ...user,
          role: userAccount?.role || ROLES.USER,
        };
      })
    );

    return NextResponse.json(enhancedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}