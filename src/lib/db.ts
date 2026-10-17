import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Neon over HTTP: one query per request, no connection pool to manage, works on serverless hosts.
// When DATABASE_URL is missing (local dev before setup) callers fall back to the seed catalogue and a JSON file.
let client: NeonQueryFunction<false, false> | null | undefined;

export function db() {
  if (client === undefined) client = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  return client;
}
