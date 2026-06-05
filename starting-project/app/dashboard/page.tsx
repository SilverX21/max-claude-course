import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getNotesByUser } from "@/lib/notes";
import { NoteList } from "@/components/NoteList";
import { CreateNoteButton } from "@/components/CreateNoteButton";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/authenticate");
  const notes = await getNotesByUser(user.id);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Notes</h1>
        <CreateNoteButton />
      </div>
      <NoteList notes={notes} />
    </div>
  );
}
