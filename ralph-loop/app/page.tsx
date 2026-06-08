import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Write and share notes</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10 max-w-lg mx-auto">
        A minimal rich text editor. Create notes, format them, and share them
        publicly with a single link.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          href="/authenticate"
          className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl font-medium hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
        >
          Get started
        </Link>
        <Link
          href="/authenticate"
          className="px-6 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          Log in
        </Link>
      </div>
      <div className="mt-20 grid sm:grid-cols-3 gap-6 text-left">
        {[
          {
            title: "Rich text editing",
            desc: "Bold, italic, headings, code blocks, bullet lists — all in a clean editor.",
          },
          {
            title: "Instant saving",
            desc: "Auto-saves as you type. Never lose a word.",
          },
          {
            title: "Public sharing",
            desc: "Toggle public sharing to get a shareable link anyone can read.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="p-5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700"
          >
            <h2 className="font-semibold mb-1">{f.title}</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
