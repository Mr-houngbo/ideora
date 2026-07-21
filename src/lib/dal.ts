import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionCookie, verifySessionToken } from "@/lib/session";

export const verifySession = cache(async () => {
  const token = await getSessionCookie();
  const isValid = await verifySessionToken(token);

  if (!isValid) {
    redirect("/login");
  }

  return { isAuth: true };
});
