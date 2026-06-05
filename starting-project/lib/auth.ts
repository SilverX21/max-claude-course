import { betterAuth } from "better-auth";
import { cache } from "react";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: db,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
);

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}
