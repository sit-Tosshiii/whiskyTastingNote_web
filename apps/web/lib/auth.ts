import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import type { SessionPayload } from "@/lib/session";

export interface User {
  id: number;
  email: string;
  password_hash: string;
  display_name: string | null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const rows = await query<User>("select * from users where email = $1", [email]);
  return rows[0] ?? null;
}

export async function createUser(email: string, password: string, displayName?: string): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 10);
  const rows = await query<User>(
    "insert into users (email, password_hash, display_name) values ($1, $2, $3) returning *",
    [email, passwordHash, displayName ?? null]
  );
  return rows[0];
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const matches = await bcrypt.compare(password, user.password_hash);
  return matches ? user : null;
}

export function toSessionPayload(user: User): SessionPayload {
  return {
    userId: user.id,
    email: user.email
  };
}
