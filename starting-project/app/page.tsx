import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your notes, anywhere.
        </h1>
        <p className="max-w-sm text-lg text-zinc-500 dark:text-zinc-400">
          A simple, fast note-taking app with rich text and public sharing.
        </p>
        <div className="flex gap-3 mt-2">
          <Link
            href="/authenticate"
            className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Sign up
          </Link>
          <Link
            href="/authenticate"
            className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Log in
          </Link>
        </div>
      </main>
    </div>
  );
}
