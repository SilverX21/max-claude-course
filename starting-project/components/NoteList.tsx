"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type NoteItem = {
  id: string;
  title: string;
  formattedDate: string;
  isPublic: boolean;
};

type ViewMode = "list" | "grid3" | "grid4";

export function NoteList({ notes }: { notes: NoteItem[] }) {
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
      {/* View toggle */}
      <div className="flex items-center justify-end gap-1 mb-3">
        <ViewToggleButton active={view === "list"} label="List view" onClick={() => setView("list")}>
          <ListIcon />
        </ViewToggleButton>
        <ViewToggleButton active={view === "grid3"} label="3-column grid" onClick={() => setView("grid3")}>
          <GridIcon cols={3} />
        </ViewToggleButton>
        <ViewToggleButton active={view === "grid4"} label="4-column grid" onClick={() => setView("grid4")}>
          <GridIcon cols={4} />
        </ViewToggleButton>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <p className="text-muted text-sm">No notes yet.</p>
          <p className="text-muted text-xs mt-1">Create your first one above.</p>
        </div>
      ) : view === "list" ? (
        <ul className="space-y-1.5 stagger">
          {notes.map((note) => (
            <li
              key={note.id}
              className="group flex items-center gap-2 rounded-lg border border-border bg-surface hover:bg-surface-hover hover:border-l-accent hover:border-l-2 transition-all pr-2"
            >
              <Link
                href={`/notes/${note.id}`}
                className="flex flex-1 items-center justify-between p-3 min-w-0"
              >
                <span className="font-medium text-fg truncate text-sm">
                  {note.title}
                </span>
                <span className="flex items-center gap-2 text-xs text-muted shrink-0 ml-2">
                  {note.isPublic ? (
                    <span className="px-1.5 py-0.5 bg-accent/10 border border-accent/20 rounded text-accent text-[10px] font-medium">
                      Public
                    </span>
                  ) : null}
                  {note.formattedDate}
                </span>
              </Link>
              <button
                type="button"
                aria-label={`Delete "${note.title}"`}
                onClick={() => setConfirmId(note.id)}
                className="cursor-pointer shrink-0 p-1.5 rounded opacity-0 group-hover:opacity-100 text-muted hover:text-danger hover:bg-danger-surface transition-all"
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={`grid gap-2.5 stagger ${view === "grid3" ? "grid-cols-3" : "grid-cols-4"}`}>
          {notes.map((note) => (
            <li key={note.id} className="group relative">
              <Link
                href={`/notes/${note.id}`}
                className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-3 hover:bg-surface-hover transition-colors h-full min-h-[90px]"
              >
                <span className="font-medium text-fg text-sm line-clamp-2 pr-5">
                  {note.title}
                </span>
                <span className="mt-auto flex items-center gap-1.5 flex-wrap pt-1">
                  {note.isPublic ? (
                    <span className="text-[10px] px-1.5 py-0.5 bg-bg border border-border rounded text-muted">
                      Public
                    </span>
                  ) : null}
                  <span className="text-[11px] text-muted">{note.formattedDate}</span>
                </span>
              </Link>
              <button
                type="button"
                aria-label={`Delete "${note.title}"`}
                onClick={() => setConfirmId(note.id)}
                className="cursor-pointer absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 text-muted hover:text-danger hover:bg-danger-surface transition-all"
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

function ViewToggleButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`cursor-pointer p-1.5 rounded transition-colors ${
        active
          ? "bg-fg text-bg"
          : "text-muted hover:text-fg hover:bg-surface"
      }`}
    >
      {children}
    </button>
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

function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="13" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="1" y="6.75" width="13" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="1" y="10.5" width="13" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function GridIcon({ cols }: { cols: 3 | 4 }) {
  const size = cols === 3 ? 4 : 3;
  const gap = cols === 3 ? 1.5 : 1;
  const count = cols;
  const rows = 2;
  const total = 15;

  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: count }).map((_, c) => {
          const x = c * (size + gap);
          const y = r * (size + gap) + (total - rows * size - (rows - 1) * gap) / 2;
          return (
            <rect
              key={`${r}-${c}`}
              x={x}
              y={y}
              width={size}
              height={size}
              rx="0.75"
              fill="currentColor"
            />
          );
        })
      )}
    </svg>
  );
}
