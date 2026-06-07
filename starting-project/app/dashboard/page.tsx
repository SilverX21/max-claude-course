import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getNotesByUser, getNoteStats } from "@/lib/notes";
import { NoteList } from "@/components/NoteList";
import { CreateNoteButton } from "@/components/CreateNoteButton";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/authenticate");

  const [notes, stats] = await Promise.all([
    getNotesByUser(user.id),
    getNoteStats(user.id),
  ]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatCard label="Total notes" value={stats.total} />
        <StatCard label="Created last 7 days" value={stats.last7Days} />
        <StatCard label="Deleted" value={`${stats.deletedPercent}%`} />
      </div>

      {/* Notes list */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">My Notes</h1>
        <CreateNoteButton />
      </div>
      <NoteList notes={notes.map(({ id, title, updatedAt, isPublic }) => ({
          id,
          title,
          isPublic,
          formattedDate: new Date(updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        }))} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-4">
      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{value}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
    </div>
  );
}
