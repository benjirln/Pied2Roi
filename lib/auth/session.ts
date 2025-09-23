import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/boot/db";

const SESSION_COOKIE = "p2r_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 jours

export interface SessionUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: number;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Crée une session pour l'utilisateur et pose le cookie httpOnly.
 * À appeler depuis une server action ou un route handler.
 */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(48).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

  await db
    .insertInto("user_session")
    .values({
      id: hashToken(token),
      user_id: userId,
      created_at: now,
      expires_at: expiresAt,
    })
    .execute();

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Renvoie l'utilisateur connecté à partir du cookie de session, ou null.
 * Le mot de passe n'est jamais exposé.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const row = await db
    .selectFrom("user_session")
    .innerJoin("user", "user.id", "user_session.user_id")
    .where("user_session.id", "=", hashToken(token))
    .where("user_session.expires_at", ">", new Date())
    .where("user.active", "=", true)
    .select([
      "user.id as id",
      "user.email as email",
      "user.first_name as first_name",
      "user.last_name as last_name",
      "user.role as role",
    ])
    .executeTakeFirst();

  return row ?? null;
}

/** Détruit la session courante (logout). */
export async function destroySession(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await db
      .deleteFrom("user_session")
      .where("id", "=", hashToken(token))
      .execute();
  }
  cookies().delete(SESSION_COOKIE);
}
