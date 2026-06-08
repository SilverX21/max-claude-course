import { notFound } from "next/navigation";
import { getNoteByPublicSlug } from "@/lib/notes";
import PublicNoteViewer from "@/components/PublicNoteViewer";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PublicNotePage({ params }: Props) {
  const { slug } = await params;
  const note = await getNoteByPublicSlug(slug);

  if (!note) {
    notFound();
  }

  return <PublicNoteViewer title={note.title} contentJson={note.contentJson} />;
}
