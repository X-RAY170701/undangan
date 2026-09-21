import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { query, queryOne } from "@/lib/db";

const SESSION_COOKIE = "session_token";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 hari

export interface AuthUser {
  id: string;
  email: string;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: string) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await query(
    "insert into sessions (token, user_id, expires_at) values (?, ?, ?)",
    [token, userId, expiresAt]
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = await queryOne<{ id: string; email: string }>(
    `select users.id as id, users.email as email
     from sessions
     join users on users.id = sessions.user_id
     where sessions.token = ? and sessions.expires_at > now()`,
    [token]
  );

  return row;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await query("delete from sessions where token = ?", [token]);
  }
  cookieStore.delete(SESSION_COOKIE);
}
