import { requireAuth } from "@/lib/auth";
import { getNotesByUser } from "@/lib/notes";
import NoteList from "@/components/NoteList";
import CreateNoteButton from "@/components/CreateNoteButton";

export default async function DashboardPage() {
  const session = await requireAuth();
  const notes = await getNotesByUser(session.user.id);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">My Notes</h1>
        <CreateNoteButton />
      </div>
      <NoteList notes={notes} />
    </main>
  );
}
