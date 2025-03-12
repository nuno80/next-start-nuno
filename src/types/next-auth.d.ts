import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string; // Rendiamo role opzionale con ?
    } & DefaultSession["user"];
  }
  
  // Invece di estendere User, estendiamo solo Session
  // Questo evita l'errore con l'adapter
}

// Se necessario, per il database adapter:
declare module "@auth/drizzle-adapter" {
  interface AdapterUser {
    role?: string;
  }
}