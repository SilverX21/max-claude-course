# Benefits Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dark 2-column benefits section below the existing hero on the main page, highlighting 6 outcome-led reasons to use Claude Code.

**Architecture:** Single file change — append a `<section>` to `page.tsx` inside `<main>`. Uses negative horizontal margins (`-mx-16`) to break out of the parent's `px-16` padding and achieve full-width dark background, with `px-16` re-applied inside the section. No new files, no new dependencies.

**Tech Stack:** Next.js App Router, React, Tailwind CSS (already installed)

---

### Task 1: Add the benefits section to page.tsx

**Files:**
- Modify: `first-steps/app/page.tsx`

- [ ] **Step 1: Start the dev server and verify the current page**

```bash
cd first-steps && npm run dev
```

Open http://localhost:3000 in your browser. You should see: Next.js logo at top, heading + paragraph in the middle, two CTA buttons at the bottom. This is the baseline.

- [ ] **Step 2: Add the benefits section**

In `first-steps/app/page.tsx`, replace the closing `</main>` tag so the benefits section is inserted after the CTA buttons block. The full file should become:

```tsx
import Image from "next/image";

const benefits = [
  {
    icon: "⚡",
    title: "Ship faster",
    description:
      "Stop writing boilerplate. Claude Code generates, edits, and refactors end-to-end so you focus on what matters.",
  },
  {
    icon: "🧠",
    title: "Stay in flow",
    description:
      "Work entirely in the terminal. No tab switching, no context breaks — just you and your editor.",
  },
  {
    icon: "🔍",
    title: "Understand any codebase",
    description:
      "Ask Claude to explain code, trace logic, or map dependencies. Get up to speed on unfamiliar repos fast.",
  },
  {
    icon: "🛡️",
    title: "Fewer bugs",
    description:
      "Claude writes tests, spots edge cases, and catches issues before they reach production.",
  },
  {
    icon: "🤖",
    title: "Automate the tedious",
    description:
      "Git commits, PR descriptions, docs — offload the work that doesn't need your full attention.",
  },
  {
    icon: "🎯",
    title: "Stay in control",
    description:
      "Claude shows its reasoning and diffs before applying changes. Every edit is yours to accept or reject.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>

        <section className="-mx-16 w-[calc(100%+8rem)] bg-[#0a0a0a] px-16 py-16">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-600">
                Why Claude Code
              </p>
              <h2 className="mb-3 text-2xl font-semibold text-zinc-100">
                Built for how developers actually work
              </h2>
              <p className="text-sm text-zinc-500">
                Six reasons developers are switching their workflow to Claude Code.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex gap-3 rounded-xl border border-[#222] bg-[#111] p-4"
                >
                  <span className="mt-0.5 text-xl">{benefit.icon}</span>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-zinc-100">
                      {benefit.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-500">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verify in browser**

Check http://localhost:3000. You should see:
- The existing hero unchanged at the top
- A dark section below the CTA buttons containing:
  - "WHY CLAUDE CODE" eyebrow label
  - "Built for how developers actually work" heading
  - 6 cards in a 2-column grid (1-column on narrow viewports)
  - Dark cards with emoji icons, white titles, grey descriptions

Resize the browser window below 640px — the grid should collapse to 1 column.

- [ ] **Step 4: Commit**

```bash
cd first-steps && git add app/page.tsx
git commit -m "feat: add benefits section to main page"
```
