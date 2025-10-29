import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "whisky_session";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "change_me";
const SESSION_EXPIRES_DAYS = 7;

export interface SessionPayload {
  userId: number;
  email: string;
}

export function getSession(): SessionPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, SESSION_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export function setSession(payload: SessionPayload): void {
  const token = jwt.sign(payload, SESSION_SECRET, {
    expiresIn: SESSION_EXPIRES_DAYS * 24 * 60 * 60
  });
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_EXPIRES_DAYS * 24 * 60 * 60
  });
}

export function clearSession(): void {
  cookies().delete(COOKIE_NAME);
}
