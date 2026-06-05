# CLAUDE.md

We're building the app described in @SPEC.md. Read that file for general architectural tasks or to double-check the exact database structure, tech stack or application architecture.

Keep your replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensire that you're working with up-to-date information.
Use the DocsExplorer subagent for efficient documentation lookup.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start dev server
bun run build    # Production build
bun run lint     # Run ESLint
```

No test suite is configured yet. Use `bun run build` to catch TypeScript/compilation errors.

## Environment Setup

Copy `.env.example` to `.env.local` before running:

```
BETTER_AUTH_SECRET=<32+ char secret>
DB_PATH=data/app.db
```

## Project

A note-taking web app specified in `SPEC.MD`. Currently at scaffold stage — the spec describes the full target architecture. Key decisions from the spec:

- **Runtime:** Bun (use `bun` for all commands, not `npm`/`npx`)
- **DB:** SQLite via `Bun.sqlite` (raw SQL, no ORM). DB file at `data/app.db`, initialized via `scripts/init-db.ts`
- **Auth:** `better-auth` — session checked server-side before any note operation
- **Editor:** TipTap — content stored as `JSON.stringify(editor.getJSON())` in `content_json` column

## Architecture (target, per SPEC.MD)

```
app/
  (auth)/login, (auth)/register   # Auth pages
  dashboard/                      # Note list (server component, auth-gated)
  notes/[id]/                     # Note editor (client components for TipTap)
  p/[slug]/                       # Public read-only note view
  api/notes/                      # REST handlers: GET, POST, PUT, DELETE, share
  api/public-notes/[slug]/        # Unauthenticated read
lib/
  db.ts                           # Bun SQLite singleton + query/get/run helpers
  notes.ts                        # Note repository functions (all scoped to userId)
  auth.ts                         # better-auth server helpers (getCurrentUser/getSession)
components/
  NoteEditor.tsx                  # TipTap editor (client)
  NoteList.tsx                    # Note list with links
  ShareToggle.tsx                 # isPublic toggle + public URL display
  DeleteNoteButton.tsx            # Confirm + DELETE call
  PublicNoteViewer.tsx            # TipTap EditorContent editable=false
```

## Key conventions

- All note DB queries must include `WHERE user_id = ?` — never trust note IDs alone
- Public slugs are generated with `nanoid()` (16+ chars), set on first share and never regenerated; cleared (set to NULL) when sharing is disabled
- TipTap content round-trips as JSON: store `JSON.stringify(json)`, load `JSON.parse(contentJson)`
- Path alias `@/*` maps to project root (e.g. `@/lib/db`)
- Use `@/*` imports, not relative `../../` imports across module boundaries
