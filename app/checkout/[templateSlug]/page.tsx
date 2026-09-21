import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { CheckoutButton } from "@/components/checkout-button";
import { getCurrentUser } from "@/lib/auth";
import { queryOne } from "@/lib/db";
import type { Template } from "@/types/invitation";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ templateSlug: string }>;
}) {
  const { templateSlug } = await params;

  const [template, user] = await Promise.all([
    queryOne<Template>(
      "select * from templates where slug = ? and is_active = true",
      [templateSlug]
    ),
    getCurrentUser(),
  ]);

  if (!template) notFound();
  const typedTemplate = template;

  return (
    <div className="flex flex-1 flex-col bg-neutral-50">
      <Nav />
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-16">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h1 className="font-serif text-2xl text-neutral-900">
            {typedTemplate.name}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            {typedTemplate.description}
          </p>
          <Link
            href={`/preview/${typedTemplate.slug}`}
            target="_blank"
            className="mt-3 inline-block text-sm font-medium text-neutral-700 underline underline-offset-2 hover:text-neutral-900"
          >
            Lihat contoh tampilan undangan
          </Link>
          <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
            <span className="text-sm text-neutral-500">Total</span>
            <span className="text-lg font-semibold text-neutral-900">
              {formatPrice(typedTemplate.price)}
            </span>
          </div>
        </div>
        <CheckoutButton
          templateSlug={typedTemplate.slug}
          isLoggedIn={Boolean(user)}
        />
      </div>
    </div>
  );
}
