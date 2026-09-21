import { NextResponse } from "next/server";
import crypto from "crypto";
import { query, queryOne } from "@/lib/db";
import { verifyMidtransSignature } from "@/lib/midtrans";
import { emptyInvitationData } from "@/types/invitation";
import type { Order } from "@/types/invitation";

const SUCCESS_STATUSES = new Set(["capture", "settlement"]);
const FAILED_STATUSES = new Set(["deny", "cancel", "expire", "failure"]);

function generateSlug() {
  return crypto.randomBytes(4).toString("hex");
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    order_id: midtransOrderId,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status,
  } = body;

  if (
    !verifyMidtransSignature({
      order_id: midtransOrderId,
      status_code,
      gross_amount,
      signature_key,
    })
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const order = await queryOne<Order>(
    "select * from orders where midtrans_order_id = ?",
    [midtransOrderId]
  );

  if (!order) {
    return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
  }

  const isSuccess =
    SUCCESS_STATUSES.has(transaction_status) &&
    (fraud_status === undefined || fraud_status === "accept");
  const isFailed = FAILED_STATUSES.has(transaction_status);

  if (isSuccess && order.status !== "paid") {
    await query("update orders set status = 'paid' where id = ?", [order.id]);

    let slug = generateSlug();
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await queryOne("select id from invitations where slug = ?", [
        slug,
      ]);
      if (!existing) break;
      slug = generateSlug();
    }

    await query(
      `insert into invitations (id, order_id, user_id, template_id, slug, data, status)
       values (?, ?, ?, ?, ?, ?, 'draft')`,
      [
        crypto.randomUUID(),
        order.id,
        order.user_id,
        order.template_id,
        slug,
        JSON.stringify(emptyInvitationData),
      ]
    );
  } else if (isFailed && order.status !== "paid") {
    await query("update orders set status = 'failed' where id = ?", [order.id]);
  }

  return NextResponse.json({ success: true });
}
