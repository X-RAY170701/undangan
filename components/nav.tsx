import Link from "next/link";
import { HeartHandshake, LayoutDashboard } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { getCurrentUser } from "@/lib/auth";

export async function Nav() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-2 font-serif text-lg font-semibold text-neutral-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-rose-300 text-neutral-900 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <HeartHandshake className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          Undangan Digital
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-neutral-700 transition-colors hover:text-neutral-900"
              >
                <LayoutDashboard className="h-4 w-4" />
                Undangan Saya
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-neutral-700 transition-colors hover:text-neutral-900"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-neutral-900 px-4 py-2 text-white transition-all duration-300 hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-900/20 active:scale-95"
              >
                Daftar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
