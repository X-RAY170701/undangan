import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import type { Invitation } from "@/types/invitation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { data, status } = body as {
    data?: unknown;
    status?: "draft" | "published";
  };

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const setClauses: string[] = [];
  const setValues: unknown[] = [];
  if (data !== undefined) {
    setClauses.push("data = ?");
    setValues.push(JSON.stringify(data));
  }
  if (status === "draft" || status === "published") {
    setClauses.push("status = ?");
    setValues.push(status);
  }

  if (setClauses.length === 0) {
    return NextResponse.json({ error: "Tidak ada perubahan" }, { status: 400 });
  }

  const existing = await queryOne(
    "select id from invitations where id = ? and user_id = ?",
    [id, user.id]
  );
  if (!existing) {
    return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
  }

  await query(
    `update invitations set ${setClauses.join(", ")} where id = ? and user_id = ?`,
    [...setValues, id, user.id]
  );

  const updated = await queryOne<Invitation>(
    "select * from invitations where id = ?",
    [id]
  );

  return NextResponse.json({ invitation: updated });
}
