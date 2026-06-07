import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4">
      <main className="flex flex-col items-center gap-8 text-center max-w-lg animate-fade-up">
        {/* Decorative accent */}
        <div className="w-12 h-0.5 bg-accent rounded-full" />

        <div className="space-y-4">
          <h1 className="font-serif text-5xl font-semibold text-fg leading-tight tracking-tight">
            Your thoughts,
            <br />
            <span className="italic text-accent">beautifully kept.</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Rich text notes with public sharing.
            <br />
            Simple, fast, and yours.
          </p>
        </div>

        <div className="flex gap-3 mt-2">
          <Link
            href="/authenticate"
            className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-fg hover:bg-accent-hover transition-colors"
          >
            Get started
          </Link>
          <Link
            href="/authenticate"
            className="rounded-md border border-border px-6 py-2.5 text-sm font-medium text-fg hover:bg-surface transition-colors"
          >
            Log in
          </Link>
        </div>

        {/* Feature hints */}
        <div className="flex items-center gap-3 mt-4">
          <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium">
            Rich text editor
          </span>
          <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium">
            Public sharing
          </span>
          <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium">
            Instant save
          </span>
        </div>
      </main>
    </div>
  );
}
