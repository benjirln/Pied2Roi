"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { v7 } from "uuid";
import { db } from "@/boot/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { Role, canAccessBackOffice } from "@/lib/auth/roles";

export interface AuthState {
  error?: string;
}

const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "Le prénom est requis"),
    lastName: z.string().trim().min(1, "Le nom est requis"),
    email: z.string().trim().toLowerCase().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
    terms: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })
  .refine((data) => data.terms === "on", {
    message: "Vous devez accepter les conditions d'utilisation",
    path: ["terms"],
  });

function destinationForRole(role: number): string {
  return canAccessBackOffice(role) ? "/admin" : "/account";
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    terms: formData.get("terms"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const { firstName, lastName, email, password } = parsed.data;

  const existing = await db
    .selectFrom("user")
    .where("email", "=", email)
    .select("id")
    .executeTakeFirst();

  if (existing) {
    return { error: "Un compte existe déjà avec cet email" };
  }

  const now = new Date();
  const userId = v7();

  await db
    .insertInto("user")
    .values({
      id: userId,
      email,
      password_hash: await hashPassword(password),
      first_name: firstName,
      last_name: lastName,
      role: Role.CLIENT,
      verified: false,
      active: true,
      created_at: now,
      updated_at: now,
    })
    .execute();

  await createSession(userId);
  redirect("/account");
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const user = await db
    .selectFrom("user")
    .where("email", "=", parsed.data.email)
    .where("active", "=", true)
    .selectAll()
    .executeTakeFirst();

  // Message générique pour ne pas révéler si l'email existe.
  if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
    return { error: "Email ou mot de passe incorrect" };
  }

  await createSession(user.id);
  redirect(destinationForRole(user.role));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
