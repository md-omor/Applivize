import { randomUUID } from "crypto";

type CookieToSet = {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    sameSite: "lax";
    secure: boolean;
    path: string;
    maxAge: number;
  };
};

const COOKIE_NAME = "applivize_uid";

function getCookieValue(cookieHeader: string, name: string): string | null {
  const parts = cookieHeader.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (!part) continue;
    const eqIdx = part.indexOf("=");
    if (eqIdx === -1) continue;
    const k = part.slice(0, eqIdx);
    if (k !== name) continue;
    const v = part.slice(eqIdx + 1);
    return decodeURIComponent(v);
  }
  return null;
}

export function getOrCreateAnonymousUserId(request: Request): {
  userId: string;
  cookieToSet: CookieToSet | null;
} {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const existing = getCookieValue(cookieHeader, COOKIE_NAME);
  if (existing) {
    return { userId: existing, cookieToSet: null };
  }

  const userId = `anon_${randomUUID()}`;

  return {
    userId,
    cookieToSet: {
      name: COOKIE_NAME,
      value: userId,
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      },
    },
  };
}
