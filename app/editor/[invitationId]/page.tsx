import { notFound, redirect } from "next/navigation";
import { Nav } from "@/components/nav";
import { InvitationEditor } from "@/components/editor/invitation-editor";
import { getCurrentUser } from "@/lib/auth";
import { queryOne } from "@/lib/db";
import type { Invitation } from "@/types/invitation";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ invitationId: string }>;
}) {
  const { invitationId } = await params;
  const user = await getCurrentUser();

  if (!user) redirect(`/login?next=/editor/${invitationId}`);

  const invitation = await queryOne<
    Invitation & { template_slug: string | null }
  >(
    `select invitations.*, templates.slug as template_slug
     from invitations
     join templates on templates.id = invitations.template_id
     where invitations.id = ? and invitations.user_id = ?`,
    [invitationId, user.id]
  );

  if (!invitation) notFound();

  const { template_slug, ...invitationFields } = invitation;

  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <InvitationEditor
        invitation={invitationFields}
        templateSlug={template_slug}
      />
    </div>
  );
}
