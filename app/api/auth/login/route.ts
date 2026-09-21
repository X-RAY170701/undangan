import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await queryOne<{
    id: string;
    email: string;
    password_hash: string;
  }>("select id, email, password_hash from users where email = ?", [email]);

  if (!user || !(await verifyPassword(String(password ?? ""), user.password_hash))) {
    return NextResponse.json(
      { error: "Email atau password salah." },
      { status: 401 }
    );
  }

  await createSession(user.id);

  return NextResponse.json({ user: { id: user.id, email: user.email } });
}
