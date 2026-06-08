import Link from "next/link";

type NoteListItem = {
  id: string;
  title: string;
  updatedAt: string;
  isPublic: boolean;
};

export default function NoteList({ notes }: { notes: NoteListItem[] }) {
  if (notes.length === 0) {
    return (
      <p className="text-neutral-500 dark:text-neutral-400 text-center py-12">
        No notes yet. Create your first note to get started.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <li key={note.id}>
          <Link
            href={`/notes/${note.id}`}
            className="block p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
          >
            <p className="font-medium truncate">{note.title}</p>
            <div className="flex items-center justify-between mt-2">
              <time
                dateTime={note.updatedAt}
                className="text-xs text-neutral-500 dark:text-neutral-400"
              >
                {new Date(note.updatedAt).toLocaleDateString()}
              </time>
              {note.isPublic && (
                <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                  Public
                </span>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
