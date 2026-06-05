"use client";
import Link from "next/link";

type NoteItem = {
  id: string;
  title: string;
  updatedAt: string;
  isPublic: boolean;
};

export function NoteList({ notes }: { notes: NoteItem[] }) {
  if (notes.length === 0) {
    return <p className="text-zinc-500 text-sm">No notes yet. Create your first one!</p>;
  }
  return (
    <ul className="space-y-2">
      {notes.map((note) => (
        <li key={note.id}>
          <Link
            href={`/notes/${note.id}`}
            className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
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
              {new Date(note.updatedAt).toLocaleDateString()}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
