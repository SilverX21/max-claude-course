"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  title: string;
  contentJson: string;
};

export function PublicNoteViewer({ title, contentJson }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: JSON.parse(contentJson),
    editable: false,
  });

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">{title}</h1>
      <EditorContent
        editor={editor}
        className="text-zinc-800 dark:text-zinc-200 [&_.ProseMirror]:outline-none"
      />
    </div>
  );
}
