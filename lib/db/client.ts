import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/lib/env";
import * as schema from "./schema";

/**
 * Drizzle client backed by Neon's HTTP driver (serverless-friendly). Lazily
 * created so the app can boot without DATABASE_URL during early development;
 * accessing `db` without a configured URL throws a clear error.
 */
let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — configure Neon to use the database.");
  }
  if (!cached) {
    const sql = neon(env.DATABASE_URL);
    cached = drizzle(sql, { schema });
  }
  return cached;
}

export const isDbConfigured = !!env.DATABASE_URL;
