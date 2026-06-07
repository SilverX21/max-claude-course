import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-5">
        {/* Brand */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="font-serif font-semibold text-accent tracking-tight hover:text-accent-hover transition-colors text-lg"
        >
          Next Notes
        </Link>

        {/* Left nav */}
        {user ? (
          <Link
            href="/dashboard"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            My Notes
          </Link>
        ) : null}

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {user ? <LogoutButton /> : null}
        </div>
      </div>
    </header>
  );
}
