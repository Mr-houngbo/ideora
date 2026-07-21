"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, deleteSession } from "@/lib/session";

const loginSchema = z.object({
  password: z.string().min(1, "Mot de passe requis"),
});

export type LoginState = { error?: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ password: formData.get("password") });

  if (!parsed.success) {
    return { error: "Mot de passe requis" };
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash) {
    throw new Error("ADMIN_PASSWORD_HASH is not set");
  }

  const isValid = await bcrypt.compare(parsed.data.password, passwordHash);
  if (!isValid) {
    return { error: "Mot de passe incorrect" };
  }

  await createSession();
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
