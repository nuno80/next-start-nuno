// src/app/api/admin/users/update-role/route.ts
import db from "@/db";
import accounts from "@/db/schema/accounts";
import { requireAuth, ROLES } from "@/utils/require-auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await requireAuth(ROLES.ADMIN);

    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Missing userId or role" },
        { status: 400 }
      );
    }

    const userAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, userId),
      });

    if(!userAccount){
        return NextResponse.json(
            { error: "User Account not found" },
            { status: 404 }
          );
    }
      await db.update(accounts).set({role}).where(eq(accounts.userId, userId));

    return NextResponse.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}