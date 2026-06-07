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
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-10 stagger">
        <StatCard label="Total notes" value={stats.total} />
        <StatCard label="Last 7 days" value={stats.last7Days} />
        <StatCard label="Deleted" value={`${stats.deletedPercent}%`} />
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-serif text-xl font-semibold text-fg">My Notes</h1>
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
    <div className="rounded-xl border border-border bg-surface px-4 py-4 hover:bg-surface-hover transition-colors border-l-2 border-l-accent">
      <p className="text-2xl font-semibold text-accent">{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}
