import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

// Staff sign in to /admin with ADMIN_PASSWORD. The session cookie holds an expiry time signed with a key
// derived from that password, so changing the password signs everyone out.
export const ADMIN_COOKIE = "dalab_admin";
const SESSION_HOURS = 12;

const password = () => process.env.ADMIN_PASSWORD ?? "";
export const adminConfigured = () => password().length >= 8;

const key = () => createHash("sha256").update(`dalab-admin:${password()}`).digest();
const sign = (value: string) => createHmac("sha256", key()).update(value).digest("base64url");

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string) {
  return adminConfigured() && safeEqual(input, password());
}

export function newSessionValue(now = Date.now()) {
  const exp = String(now + SESSION_HOURS * 3600_000);
  return { value: `${exp}.${sign(exp)}`, maxAge: SESSION_HOURS * 3600 };
}

function validSession(value: string | undefined, now = Date.now()) {
  if (!value || !adminConfigured()) return false;
  const [exp, sig] = value.split(".");
  return Boolean(exp && sig) && Number(exp) > now && safeEqual(sig, sign(exp));
}

/** True when the request carries a valid staff session. Reads cookies, so call it inside a Suspense boundary. */
export async function isAdmin() {
  await connection(); // the expiry check reads the clock, so this always runs per request
  return validSession((await cookies()).get(ADMIN_COOKIE)?.value);
}
