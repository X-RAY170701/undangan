import { NextResponse } from "next/server";
import crypto from "crypto";
import { query, queryOne } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { invitationId, guestName, attendance, guestCount, message } = body;

  if (!invitationId || !guestName || !attendance) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }
  if (attendance !== "hadir" && attendance !== "tidak_hadir") {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const invitation = await queryOne(
    "select id from invitations where id = ? and status = 'published'",
    [invitationId]
  );
  if (!invitation) {
    return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
  }

  await query(
    `insert into rsvp_responses (id, invitation_id, guest_name, attendance, guest_count, message)
     values (?, ?, ?, ?, ?, ?)`,
    [
      crypto.randomUUID(),
      invitationId,
      String(guestName).slice(0, 200),
      attendance,
      Math.max(1, Number(guestCount) || 1),
      message ? String(message).slice(0, 1000) : null,
    ]
  );

  return NextResponse.json({ success: true });
}
