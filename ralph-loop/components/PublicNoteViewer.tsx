"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  title: string;
  contentJson: string;
};

export default function PublicNoteViewer({ title, contentJson }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content: JSON.parse(contentJson),
    editable: false,
    immediatelyRender: false,
  });

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-none"
      />
    </article>
  );
}
