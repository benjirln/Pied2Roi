import { redirect } from "next/navigation";
import { getCurrentUser, type SessionUser } from "@/lib/auth/session";
import { canAccessBackOffice } from "@/lib/auth/roles";

/** Exige une session valide, sinon redirige vers la connexion. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}

/** Exige un rôle vendeur ou administrateur (accès back-office). */
export async function requireBackOffice(): Promise<SessionUser> {
  const user = await requireUser();
  if (!canAccessBackOffice(user.role)) {
    redirect("/account");
  }
  return user;
}
