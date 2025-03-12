import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { eq } from "drizzle-orm";

import db from "@/db";
import { env } from "@/env/server";
import { accounts } from "@/db/schema";

// Definizione dei ruoli
export const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
};

const options: NextAuthOptions = {
  pages: {
    signIn: "/",
  },
  // Usa un'asserzione di tipo più specifica
  adapter: DrizzleAdapter(db) as ReturnType<typeof DrizzleAdapter>,
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      
      // Recupera il ruolo dall'account
      if (session.user.email === "nuno.80.al@gmail.com") {
        session.user.role = ROLES.ADMIN;
      } else {
        try {
          const userAccount = await db.query.accounts.findFirst({
            where: eq(accounts.userId, user.id),
          });
          
          session.user.role = userAccount?.role || ROLES.USER;
        } catch (error) {
          console.error("Error fetching user role:", error);
          session.user.role = ROLES.USER; // Default role
        }
      }
      
      return session;
    }
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export default options;