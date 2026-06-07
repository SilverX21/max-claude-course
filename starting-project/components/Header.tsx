import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-6">
        {/* Brand */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight hover:opacity-75 transition-opacity"
        >
          Next Notes
        </Link>

        {/* Left nav */}
        {user ? (
          <Link
            href="/dashboard"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            My Notes
          </Link>
        ) : null}

        {/* Right: logout */}
        {user ? (
          <div className="ml-auto">
            <LogoutButton />
          </div>
        ) : null}
      </div>
    </header>
  );
}
