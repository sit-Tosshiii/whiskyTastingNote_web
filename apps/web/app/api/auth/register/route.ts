import { NextResponse } from "next/server";
import { createUser, findUserByEmail, toSessionPayload } from "@/lib/auth";
import { setSession } from "@/lib/session";

export async function POST(request: Request) {
  const { email, password, displayName } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "メールアドレスとパスワードは必須です" }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "このメールアドレスは既に登録されています" }, { status: 409 });
  }

  const user = await createUser(email, password, displayName);
  setSession(toSessionPayload(user));
  return NextResponse.json({ ok: true });
}
