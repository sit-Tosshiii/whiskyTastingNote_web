import { NextResponse } from "next/server";
import { toSessionPayload, verifyUser } from "@/lib/auth";
import { setSession } from "@/lib/session";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "メールアドレスとパスワードは必須です" }, { status: 400 });
  }

  const user = await verifyUser(email, password);
  if (!user) {
    return NextResponse.json({ error: "認証に失敗しました" }, { status: 401 });
  }

  setSession(toSessionPayload(user));
  return NextResponse.json({ ok: true });
}
