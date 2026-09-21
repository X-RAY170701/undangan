import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/nav";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import type { Invitation } from "@/types/invitation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login?next=/dashboard");

  const invitations = await query<Invitation[]>(
    "select * from invitations where user_id = ? order by created_at desc",
    [user.id]
  );

  return (
    <div className="flex flex-1 flex-col bg-neutral-50">
      <Nav />
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="mb-8 font-serif text-2xl text-neutral-900">
          Undangan Saya
        </h1>
        <div className="flex flex-col gap-4">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5"
            >
              <div>
                <p className="font-medium text-neutral-900">
                  {invitation.data.groomName || invitation.data.brideName
                    ? `${invitation.data.groomName} & ${invitation.data.brideName}`
                    : "Undangan baru"}
                </p>
                <p className="text-sm text-neutral-500">
                  Status:{" "}
                  {invitation.status === "published" ? "Terbit" : "Draft"}
                  {" · "}
                  <span className="font-mono">/u/{invitation.slug}</span>
                </p>
              </div>
              <div className="flex gap-2">
                {invitation.status === "published" ? (
                  <Link
                    href={`/u/${invitation.slug}`}
                    target="_blank"
                    className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
                  >
                    Lihat
                  </Link>
                ) : null}
                <Link
                  href={`/editor/${invitation.id}`}
                  className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
          {!invitations.length ? (
            <p className="text-sm text-neutral-500">
              Belum ada undangan. Setelah pembayaran berhasil, undangan Anda
              akan muncul di sini.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
