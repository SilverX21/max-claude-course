import { betterAuth } from "better-auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: db,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}
