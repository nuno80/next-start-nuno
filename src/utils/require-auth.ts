// utils/require-auth.ts
import options from "@/config/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Definizione dei ruoli
export const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
};

export async function requireAuth(requiredRole?: string) {
  const session = await getServerSession(options);
  
  if (!session?.user) {
    redirect("/");
  }
  
  // Se non è richiesto un ruolo specifico, basta che l'utente sia autenticato
  if (!requiredRole) {
    return session;
  }
  
  const userRole = session.user.role || ROLES.USER;
  
  // Logica di autorizzazione gerarchica
  if (requiredRole === ROLES.ADMIN && userRole !== ROLES.ADMIN) {
    redirect("/unauthorized");
  }
  
  if (requiredRole === ROLES.MODERATOR && 
      ![ROLES.ADMIN, ROLES.MODERATOR].includes(userRole)) {
    redirect("/unauthorized");
  }
  
  return session;
}

// Manteniamo la funzione originale per retrocompatibilità
export default async function requireAuthLegacy() {
  return requireAuth();
}