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
        <p className="text-zinc-500 text-sm">No notes yet. Create your first one!</p>
      ) : view === "list" ? (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="group flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors pr-2"
            >
              <Link
                href={`/notes/${note.id}`}
                className="flex flex-1 items-center justify-between p-3 min-w-0"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {note.title}
                </span>
                <span className="flex items-center gap-2 text-xs text-zinc-400 shrink-0 ml-2">
                  {note.isPublic ? (
                    <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-500">
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
                className="cursor-pointer shrink-0 p-1.5 rounded opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={`grid gap-3 ${view === "grid3" ? "grid-cols-3" : "grid-cols-4"}`}>
          {notes.map((note) => (
            <li key={note.id} className="group relative">
              <Link
                href={`/notes/${note.id}`}
                className="flex flex-col gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors h-full min-h-[90px]"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100 text-sm line-clamp-2 pr-5">
                  {note.title}
                </span>
                <span className="mt-auto flex items-center gap-1.5 flex-wrap">
                  {note.isPublic ? (
                    <span className="text-xs px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-500">
                      Public
                    </span>
                  ) : null}
                  <span className="text-xs text-zinc-400">{note.formattedDate}</span>
                </span>
              </Link>
              <button
                type="button"
                aria-label={`Delete "${note.title}"`}
                onClick={() => setConfirmId(note.id)}
                className="cursor-pointer absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
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
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setConfirmId(null)}
          />
          <div className="relative z-10 w-full max-w-sm mx-4 bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6">
            <h2
              id="delete-confirm-title"
              className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-1"
            >
              Delete note?
            </h2>
            <p className="text-sm text-zinc-500 mb-5 truncate">
              &ldquo;{noteToDelete?.title}&rdquo; will be permanently deleted.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="cursor-pointer px-4 py-2 rounded-md text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loadingId === confirmId}
                onClick={() => handleDelete(confirmId)}
                className="cursor-pointer px-4 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
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
          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
          : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800"
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
