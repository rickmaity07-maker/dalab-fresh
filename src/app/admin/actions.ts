"use server";

import { refresh } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, checkPassword, isAdmin, newSessionValue } from "@/lib/admin-auth";
import { setOrderStage } from "@/lib/orders-store";
import { allow, clientIp } from "@/lib/rate-limit";
import type { TrackingStage } from "@/lib/types";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const input = String(form.get("password") ?? "").slice(0, 200);
  // 10 wrong guesses per connection per 15 minutes, then a lock-out even for the right password.
  const ip = clientIp(await headers());
  if (!(await allow("admin-login", ip, 10, 900))) {
    return { error: "Zu viele Versuche. Warte 15 Minuten und versuch es dann erneut." };
  }
  if (!checkPassword(input)) {
    // A short pause slows down password guessing.
    await new Promise((r) => setTimeout(r, 800));
    return { error: "Das Passwort stimmt nicht." };
  }
  const { value, maxAge } = newSessionValue();
  (await cookies()).set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin");
}

export async function updateStage(form: FormData) {
  // Server actions are public endpoints: check the session on every call, not just on the page.
  if (!(await isAdmin())) redirect("/admin");
  const id = String(form.get("id") ?? "");
  const stage = Number(form.get("stage"));
  if (!/^DF-\d{5}$/.test(id) || ![0, 1, 2, 3].includes(stage)) return;
  await setOrderStage(id, stage as TrackingStage);
  refresh();
}
