import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { snap } from "@/lib/midtrans";
import type { Template } from "@/types/invitation";

export async function POST(request: Request) {
  const { templateSlug } = await request.json();
  if (!templateSlug) {
    return NextResponse.json({ error: "Template tidak valid" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const template = await queryOne<Template>(
    "select * from templates where slug = ? and is_active = true",
    [templateSlug]
  );

  if (!template) {
    return NextResponse.json({ error: "Template tidak ditemukan" }, { status: 404 });
  }

  const midtransOrderId = `INV-${template.slug}-${user.id.slice(0, 8)}-${Date.now()}`;
  const orderId = crypto.randomUUID();

  await query(
    `insert into orders (id, user_id, template_id, status, midtrans_order_id, amount)
     values (?, ?, ?, 'pending', ?, ?)`,
    [orderId, user.id, template.id, midtransOrderId, template.price]
  );
  const order = { id: orderId };

  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: midtransOrderId,
      gross_amount: template.price,
    },
    customer_details: {
      email: user.email,
    },
    item_details: [
      {
        id: template.id,
        name: `Undangan Digital - ${template.name}`,
        price: template.price,
        quantity: 1,
      },
    ],
  });

  return NextResponse.json({
    token: transaction.token,
    orderId: order.id,
  });
}
