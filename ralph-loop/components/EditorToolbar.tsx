"use client";

import type { Editor } from "@tiptap/react";

type Props = {
  editor: Editor;
};

type ToolbarButton = {
  label: string;
  action: () => void;
  isActive: boolean;
};

export default function EditorToolbar({ editor }: Props) {
  const buttons: ToolbarButton[] = [
    {
      label: "B",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      label: "I",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      label: "H1",
      action: () =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
    },
    {
      label: "H2",
      action: () =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
    },
    {
      label: "H3",
      action: () =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
    },
    {
      label: "¶",
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive("paragraph"),
    },
    {
      label: "• List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      label: "</>",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
    },
    {
      label: "[ ]",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive("codeBlock"),
    },
    {
      label: "—",
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-neutral-200 dark:border-neutral-700">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={btn.action}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            btn.isActive
              ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
