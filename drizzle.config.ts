import { defineConfig } from "drizzle-kit";

// drizzle-kit runs standalone (outside Next.js), so load .env.local ourselves.
// process.loadEnvFile is a Node 20.12+/22 built-in — no dotenv dependency needed.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local (e.g. CI uses real env vars) — fall through to process.env.
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
