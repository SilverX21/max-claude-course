import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { getNoteById } from "@/lib/notes";
import { NoteEditor } from "@/components/NoteEditor";
import { ShareToggle } from "@/components/ShareToggle";
import { DeleteNoteButton } from "@/components/DeleteNoteButton";
import Link from "next/link";

export default async function NoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, user, hdrs] = await Promise.all([params, getCurrentUser(), headers()]);
  if (!user) redirect("/authenticate");
  const note = await getNoteById(user.id, id);
  if (!note) notFound();

  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const origin = `${proto}://${host}`;

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <Link
          href="/dashboard"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          ← Notes
        </Link>
        <div className="flex items-center gap-4">
          <ShareToggle
            noteId={note.id}
            initialIsPublic={note.isPublic}
            initialSlug={note.publicSlug}
            origin={origin}
          />
          <DeleteNoteButton noteId={note.id} />
        </div>
      </div>
      <NoteEditor id={note.id} title={note.title} contentJson={note.contentJson} />
    </div>
  );
}
