import { NextResponse } from "next/server";
import crypto from "crypto";
import { query, queryOne } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password || String(password).length < 6) {
    return NextResponse.json(
      { error: "Email dan password (minimal 6 karakter) wajib diisi." },
      { status: 400 }
    );
  }

  const existing = await queryOne("select id from users where email = ?", [
    email,
  ]);
  if (existing) {
    return NextResponse.json(
      { error: "Email sudah terdaftar." },
      { status: 400 }
    );
  }

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(String(password));

  await query(
    "insert into users (id, email, password_hash) values (?, ?, ?)",
    [id, email, passwordHash]
  );
  await createSession(id);

  return NextResponse.json({ user: { id, email } });
}
