"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type NoteItem = {
  id: string;
  title: string;
  formattedDate: string;
  isPublic: boolean;
};

type ViewMode = "list" | "grid3" | "grid4";

export function NoteList({
  notes,
  title,
  createButton,
}: {
  notes: NoteItem[];
  title?: React.ReactNode;
  createButton?: React.ReactNode;
}) {
  const router = useRouter();
  const [view, setView] = useState<ViewMode>("list");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setLoadingId(id);
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setLoadingId(null);
    setConfirmId(null);
    router.refresh();
  }

  const noteToDelete = notes.find((n) => n.id === confirmId);

  return (
    <>
      {/* Unified header: title + view toggles + action */}
      <div className="flex items-center justify-between mb-4">
        {title ? <h1 className="font-serif text-xl font-semibold text-fg">{title}</h1> : <div />}
        <div className="flex items-center gap-2">
          <ViewSegmentedControl view={view} onChange={setView} />
          {createButton}
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <p className="text-muted text-sm">No notes yet.</p>
          <p className="text-muted text-xs mt-1">Create your first one above.</p>
        </div>
      ) : view === "list" ? (
        /* ── List view ─────────────────────────────────────────── */
        <ul className="flex flex-col gap-1.5 stagger">
          {notes.map((note) => (
            <li
              key={note.id}
              className="group flex items-stretch rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-accent/25 hover:shadow-sm transition-all overflow-hidden"
            >
              {/* Animated left accent bar */}
              <span className="w-[3px] shrink-0 bg-transparent group-hover:bg-accent transition-colors duration-200 rounded-r-full" />

              {/* Note icon */}
              <span className="shrink-0 self-center flex items-center justify-center w-8 pl-2.5 pr-1">
                <span className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/15 transition-colors">
                  <NoteDocIcon />
                </span>
              </span>

              <Link
                href={`/notes/${note.id}`}
                className="flex flex-1 items-center justify-between px-3 py-3 min-w-0 gap-4"
              >
                <div className="min-w-0 flex flex-col gap-1.5">
                  <span className="font-medium text-fg truncate text-sm leading-tight">
                    {note.title}
                  </span>
                  {/* Decorative content ghost lines */}
                  <div className="flex items-center gap-1.5">
                    <span className="h-[3px] rounded-full bg-border w-14" />
                    <span className="h-[3px] rounded-full bg-border w-8 opacity-60" />
                    <span className="h-[3px] rounded-full bg-border w-5 opacity-35" />
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  {note.isPublic ? <PublicBadge /> : null}
                  <span className="text-xs text-muted tabular-nums">{note.formattedDate}</span>
                  <ChevronRightIcon />
                </div>
              </Link>

              <button
                type="button"
                aria-label={`Delete "${note.title}"`}
                onClick={() => setConfirmId(note.id)}
                className="cursor-pointer shrink-0 self-center mr-2 p-1.5 rounded opacity-0 group-hover:opacity-100 text-muted hover:text-danger hover:bg-danger-surface transition-all"
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      ) : view === "grid3" ? (
        /* ── Grid 3 view ───────────────────────────────────────── */
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger">
          {notes.map((note) => (
            <li key={note.id} className="group relative">
              <Link
                href={`/notes/${note.id}`}
                className="flex flex-col rounded-xl border border-border bg-surface hover:bg-surface-hover hover:shadow-md hover:border-accent/20 transition-all h-full min-h-[130px] overflow-hidden"
              >
                {/* Top accent stripe */}
                <span className="h-[3px] w-full bg-accent/35 group-hover:bg-accent/60 transition-colors shrink-0" />

                <div className="flex flex-col flex-1 p-3 gap-2">
                  <span className="font-medium text-fg text-sm line-clamp-2 leading-snug pr-5">
                    {note.title}
                  </span>

                  {/* Ruled-line texture suggesting content */}
                  <div className="flex flex-col gap-[5px] flex-1 pt-0.5">
                    <span className="h-px bg-border/60 w-full" />
                    <span className="h-px bg-border/45 w-5/6" />
                    <span className="h-px bg-border/30 w-2/3" />
                  </div>

                  {/* Footer metadata */}
                  <div className="flex items-center justify-between pt-1 mt-auto">
                    {note.isPublic ? <PublicBadge /> : <span />}
                    <span className="text-[10px] text-muted tabular-nums">
                      {note.formattedDate}
                    </span>
                  </div>
                </div>
              </Link>
              <button
                type="button"
                aria-label={`Delete "${note.title}"`}
                onClick={() => setConfirmId(note.id)}
                className="cursor-pointer absolute top-3.5 right-2 p-1 rounded opacity-0 group-hover:opacity-100 text-muted hover:text-danger hover:bg-danger-surface transition-all"
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        /* ── Grid 4 view ───────────────────────────────────────── */
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 stagger">
          {notes.map((note) => (
            <li key={note.id} className="group relative">
              <Link
                href={`/notes/${note.id}`}
                className="flex rounded-xl border border-border bg-surface hover:bg-surface-hover hover:shadow-sm transition-all h-full min-h-[88px] overflow-hidden"
              >
                {/* Left accent stripe */}
                <span className="w-[3px] shrink-0 bg-accent/30 group-hover:bg-accent/70 transition-colors" />

                <div className="flex flex-col p-2.5 gap-1.5 min-w-0 flex-1 pr-6">
                  <span className="font-medium text-fg text-xs line-clamp-3 leading-snug">
                    {note.title}
                  </span>
                  <div className="flex flex-col gap-1 flex-1 pt-0.5">
                    <span className="h-px bg-border/50 w-full" />
                    <span className="h-px bg-border/30 w-3/4" />
                  </div>
                  <div className="flex flex-wrap items-center gap-1 mt-auto">
                    {note.isPublic ? (
                      <span className="text-[8px] px-1 py-0.5 bg-accent/10 border border-accent/20 rounded text-accent font-semibold uppercase tracking-wide">
                        Public
                      </span>
                    ) : null}
                    <span className="text-[9px] text-muted tabular-nums ml-auto">
                      {note.formattedDate}
                    </span>
                  </div>
                </div>
              </Link>
              <button
                type="button"
                aria-label={`Delete "${note.title}"`}
                onClick={() => setConfirmId(note.id)}
                className="cursor-pointer absolute top-2 right-1.5 p-1 rounded opacity-0 group-hover:opacity-100 text-muted hover:text-danger hover:bg-danger-surface transition-all"
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Confirmation modal */}
      {confirmId ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
        >
          <div
            className="absolute inset-0 bg-fg/20 backdrop-blur-sm"
            onClick={() => setConfirmId(null)}
          />
          <div className="relative z-10 w-full max-w-sm mx-4 bg-surface border border-border rounded-2xl shadow-xl p-6 animate-scale-in">
            <h2
              id="delete-confirm-title"
              className="font-serif text-base font-semibold text-fg mb-1"
            >
              Delete note?
            </h2>
            <p className="text-sm text-muted mb-5 truncate">
              &ldquo;{noteToDelete?.title}&rdquo; will be permanently deleted.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="cursor-pointer px-4 py-2 rounded-md text-sm text-fg hover:bg-bg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loadingId === confirmId}
                onClick={() => handleDelete(confirmId)}
                className="cursor-pointer px-4 py-2 rounded-md text-sm bg-danger text-white hover:bg-danger-hover disabled:opacity-50 transition-colors"
              >
                {loadingId === confirmId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const VIEW_OPTIONS: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  { mode: "list", label: "List", icon: <ListViewIcon /> },
  { mode: "grid3", label: "3×", icon: <Grid3ViewIcon /> },
  { mode: "grid4", label: "4×", icon: <Grid4ViewIcon /> },
];

function ViewSegmentedControl({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const activeIndex = VIEW_OPTIONS.findIndex((o) => o.mode === view);

  return (
    <div
      role="group"
      aria-label="View mode"
      className="relative flex items-stretch rounded-xl border border-border bg-surface p-1"
    >
      {/* Sliding indicator — uses % so it's fully responsive */}
      <span
        aria-hidden="true"
        className="absolute inset-y-1 rounded-lg bg-accent shadow-sm pointer-events-none transition-transform duration-200 ease-out"
        style={{
          width: "calc(100% / 3 - 0.5px)",
          transform: `translateX(calc(${activeIndex} * (100% + 0.5px)))`,
        }}
      />
      {VIEW_OPTIONS.map((opt) => (
        <button
          key={opt.mode}
          type="button"
          aria-label={opt.label}
          aria-pressed={view === opt.mode}
          onClick={() => onChange(opt.mode)}
          className={`cursor-pointer relative z-10 flex flex-1 flex-col items-center justify-center gap-[3px] px-3 py-1.5 rounded-lg transition-colors duration-150 ${
            view === opt.mode ? "text-accent-fg" : "text-muted hover:text-fg"
          }`}
        >
          {/* Fixed-height icon slot, SVG forced block to eliminate inline descender gap */}
          <span className="flex items-center justify-center" style={{ height: 14 }}>
            {opt.icon}
          </span>
          <span className="hidden sm:block text-[9px] font-semibold tracking-wider uppercase leading-none">
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function PublicBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-accent/10 border border-accent/20 rounded text-accent text-[10px] font-semibold tracking-wide uppercase">
      <span aria-hidden="true" className="w-1 h-1 rounded-full bg-accent/70 inline-block" />
      Public
    </span>
  );
}

function NoteDocIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M2 1.5A.5.5 0 0 1 2.5 1h6l2.5 2.5V11.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-10Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M8.5 1v2.5H11" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M4 6h5M4 8h3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="text-muted/40 group-hover:text-muted/70 group-hover:translate-x-0.5 transition-all duration-150"
    >
      <path
        d="M4.5 2.5L8 6l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function ListViewIcon() {
  return (
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      aria-hidden="true"
      className="block"
    >
      {/* Row 1: full-width line */}
      <rect x="0" y="0.5" width="16" height="2" rx="1" fill="currentColor" />
      {/* Row 2: short leading dot + line */}
      <rect x="0" y="5.5" width="2" height="2" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="3.5" y="5.5" width="12.5" height="2" rx="1" fill="currentColor" />
      {/* Row 3: short leading dot + shorter line */}
      <rect x="0" y="10.5" width="2" height="2" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="3.5" y="10.5" width="9" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

function Grid3ViewIcon() {
  // 3 columns × 2 rows of card-like rectangles
  const colW = 4;
  const colH = 5;
  const gapX = 1.5;
  const gapY = 2;
  const totalW = 3 * colW + 2 * gapX; // 16.5 → use viewBox 17
  return (
    <svg
      width="17"
      height="12"
      viewBox="0 0 17 12"
      fill="none"
      aria-hidden="true"
      className="block"
    >
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => (
          <rect
            key={`${c}-${r}`}
            x={c * (colW + gapX)}
            y={r * (colH + gapY)}
            width={colW}
            height={colH}
            rx="1"
            fill="currentColor"
            opacity={r === 0 ? 1 : 0.6}
          />
        )),
      )}
    </svg>
  );
}

function Grid4ViewIcon() {
  // 4 columns × 2 rows, tighter
  const colW = 3;
  const colH = 4;
  const gapX = 1.3;
  const gapY = 2;
  return (
    <svg
      width="17"
      height="10"
      viewBox="0 0 17 10"
      fill="none"
      aria-hidden="true"
      className="block"
    >
      {[0, 1, 2, 3].map((c) =>
        [0, 1].map((r) => (
          <rect
            key={`${c}-${r}`}
            x={c * (colW + gapX)}
            y={r * (colH + gapY)}
            width={colW}
            height={colH}
            rx="0.75"
            fill="currentColor"
            opacity={r === 0 ? 1 : 0.55}
          />
        )),
      )}
    </svg>
  );
}
