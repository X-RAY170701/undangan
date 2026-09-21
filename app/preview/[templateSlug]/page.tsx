import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WeddingTemplate } from "@/components/templates/WeddingTemplate";
import {
  sampleInvitationData,
  sampleRsvpResponses,
} from "@/components/templates/sample-data";
import { queryOne } from "@/lib/db";
import type { Template } from "@/types/invitation";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ templateSlug: string }>;
}) {
  const { templateSlug } = await params;

  const template = await queryOne<Template>(
    "select * from templates where slug = ? and is_active = true",
    [templateSlug]
  );

  if (!template) notFound();

  return (
    <div className="relative">
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-3 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-neutral-700 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <p className="hidden text-sm font-medium text-neutral-900 sm:block">
          Pratinjau: {template.name}
        </p>
        <Link
          href={`/checkout/${template.slug}`}
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-900/20 active:scale-95"
        >
          Pesan Template Ini
        </Link>
      </div>
      <div className="pt-14">
        <WeddingTemplate
          invitation={{ id: "preview", data: sampleInvitationData }}
          templateSlug={template.slug}
          rsvpResponses={sampleRsvpResponses}
          isPreview
        />
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ templateSlug: string }>;
}) {
  const { templateSlug } = await params;
  const template = await queryOne<Template>(
    "select name from templates where slug = ? and is_active = true",
    [templateSlug]
  );

  return { title: template ? `Pratinjau: ${template.name}` : "Pratinjau Template" };
}
