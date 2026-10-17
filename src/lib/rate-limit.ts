import "server-only";
import { createHash } from "node:crypto";
import { db } from "./db";

// Limits how often one visitor can do something (place orders, look up orders, try the staff password).
// Counted in Neon so every server instance sees the same numbers; in memory when there is no database.
// IP addresses are stored only as a salted hash and deleted after a day.

const memory = new Map<string, number[]>();

export function clientIp(req: Request | Headers) {
  const h = req instanceof Headers ? req : req.headers;
  // Vercel sets x-real-ip and overwrites x-forwarded-for, so neither can be faked by the visitor.
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

const hash = (s: string) =>
  createHash("sha256").update(`${process.env.REVALIDATE_SECRET ?? "dalab"}:${s}`).digest("base64url").slice(0, 22);

/** Records one attempt and returns false when `key` has already used `max` attempts in the last `windowSec` seconds. */
export async function allow(action: string, who: string, max: number, windowSec: number): Promise<boolean> {
  const key = `${action}:${hash(who)}`;
  const sql = db();
  if (sql) {
    try {
      const [row] = (await sql`
        with cleanup as (delete from rate_hits where at < now() - interval '1 day'),
             hit as (insert into rate_hits (key) values (${key}))
        select count(*)::int as n from rate_hits where key = ${key} and at > now() - make_interval(secs => ${windowSec})`) as { n: number }[];
      // The count is taken before this hit is inserted, so `n` is the number of earlier attempts.
      return row.n < max;
    } catch (err) {
      // Never block customers because the limiter itself failed.
      console.error("[rate-limit] check failed:", err);
      return true;
    }
  }
  const now = Date.now();
  const recent = (memory.get(key) ?? []).filter((t) => t > now - windowSec * 1000);
  recent.push(now);
  memory.set(key, recent);
  return recent.length <= max;
}
