import { notFound } from "next/navigation";
import { query, queryOne } from "@/lib/db";
import { WeddingTemplate } from "@/components/templates/WeddingTemplate";
import type { Invitation, RsvpResponse } from "@/types/invitation";

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const invitation = await queryOne<
    Invitation & { template_slug: string | null }
  >(
    `select invitations.*, templates.slug as template_slug
     from invitations
     join templates on templates.id = invitations.template_id
     where invitations.slug = ? and invitations.status = 'published'`,
    [slug]
  );

  if (!invitation) notFound();

  const { template_slug, ...invitationFields } = invitation;

  const rsvpResponses = await query<RsvpResponse[]>(
    "select * from rsvp_responses where invitation_id = ? order by created_at desc",
    [invitation.id]
  );

  return (
    <WeddingTemplate
      invitation={invitationFields}
      templateSlug={template_slug}
      rsvpResponses={rsvpResponses}
    />
  );
}

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Situs ini bisa dibuka lewat IP/domain berbeda-beda (lihat next.config.ts
 * `allowedDevOrigins`), jadi og:url/og:image tidak dipaksa satu domain tetap —
 * kalau NEXT_PUBLIC_SITE_URL tidak diisi, keduanya cukup dilewati (Next.js
 * tetap boleh generate metadata tanpa url/image absolut). */
function absoluteUrl(path: string): string | undefined {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invitation = await queryOne<{ data: Invitation["data"] }>(
    "select data from invitations where slug = ? and status = 'published'",
    [slug]
  );

  if (!invitation) return { title: "Undangan Digital" };

  const data = invitation.data;
  const coupleName = [data.groomName, data.brideName].filter(Boolean).join(" & ") || "Kami";
  const title = `Undangan Pernikahan ${coupleName}`;

  const firstEvent = data.events?.[0];
  const description = firstEvent?.date
    ? `${coupleName} mengundang Anda ke acara pernikahan kami` +
      (firstEvent.venueName ? ` di ${firstEvent.venueName}` : "") +
      `, ${formatEventDate(firstEvent.date)}.`
    : `${coupleName} mengundang Anda ke acara pernikahan kami. Buka undangan untuk detail acara & konfirmasi kehadiran.`;

  const pageUrl = absoluteUrl(`/u/${slug}`);
  const imageUrl = data.coverPhotoUrl ? absoluteUrl(data.coverPhotoUrl) : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      siteName: "Undangan Digital",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 1600, alt: title }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
