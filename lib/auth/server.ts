import { createNeonAuth } from "@neon/auth/next/server";
export function getAuth() {
 const baseUrl=process.env.NEON_AUTH_BASE_URL, secret=process.env.NEON_AUTH_COOKIE_SECRET;
 if (!baseUrl || !secret || secret.length < 32) return null;
 return createNeonAuth({baseUrl,cookies:{secret}});
}
