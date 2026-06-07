"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type NoteItem = {
  id: string;
  title: string;
  updatedAt: string;
  isPublic: boolean;
};

export function NoteList({ notes }: { notes: NoteItem[] }) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setLoadingId(id);
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setLoadingId(null);
    setConfirmId(null);
    router.refresh();
  }

  if (notes.length === 0) {
    return <p className="text-zinc-500 text-sm">No notes yet. Create your first one!</p>;
  }

  const noteToDelete = notes.find((n) => n.id === confirmId);

  return (
    <>
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
                {note.isPublic && (
                  <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-500">
                    Public
                  </span>
                )}
                {new Date(note.updatedAt).toLocaleDateString()}
              </span>
            </Link>

            <button
              type="button"
              aria-label={`Delete "${note.title}"`}
              onClick={() => setConfirmId(note.id)}
              className="shrink-0 p-1.5 rounded opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>

      {/* Confirmation modal */}
      {confirmId && (
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
                className="px-4 py-2 rounded-md text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loadingId === confirmId}
                onClick={() => handleDelete(confirmId)}
                className="px-4 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loadingId === confirmId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
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
