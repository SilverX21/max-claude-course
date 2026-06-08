import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getNoteById } from "@/lib/notes";
import NoteEditor from "@/components/NoteEditor";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  const session = await requireAuth();
  const note = await getNoteById(session.user.id, id);

  if (!note) {
    notFound();
  }

  return <NoteEditor note={note} />;
}
