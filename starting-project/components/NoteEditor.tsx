"use client";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";

type Props = { id: string; title: string; contentJson: string };

export function NoteEditor({ id, title: initialTitle, contentJson }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const titleRef = useRef(initialTitle);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } })],
    content: JSON.parse(contentJson),
    onUpdate: ({ editor }) => {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        fetch(`/api/notes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: titleRef.current, contentJson: editor.getJSON() }),
        });
      }, 1000);
    },
  });

  const active = useEditorState({
    editor,
    selector: (ctx) => ({
      bold: ctx.editor?.isActive("bold") ?? false,
      italic: ctx.editor?.isActive("italic") ?? false,
      h1: ctx.editor?.isActive("heading", { level: 1 }) ?? false,
      h2: ctx.editor?.isActive("heading", { level: 2 }) ?? false,
      h3: ctx.editor?.isActive("heading", { level: 3 }) ?? false,
      paragraph: ctx.editor?.isActive("paragraph") ?? false,
      bulletList: ctx.editor?.isActive("bulletList") ?? false,
      code: ctx.editor?.isActive("code") ?? false,
      codeBlock: ctx.editor?.isActive("codeBlock") ?? false,
    }),
  });

  function handleTitleChange(value: string) {
    setTitle(value);
    titleRef.current = value;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value, contentJson: editor?.getJSON() }),
      });
    }, 500);
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-up">
      <input
        className="w-full font-serif text-3xl font-semibold bg-transparent border-none outline-none mb-6 text-fg placeholder:text-muted"
        value={title}
        placeholder="Untitled note"
        onChange={(e) => handleTitleChange(e.target.value)}
      />

      {editor ? (
        <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={active?.bold ?? false}
            label="Bold"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={active?.italic ?? false}
            label="Italic"
          >
            <em>I</em>
          </ToolbarButton>

          <div className="w-px bg-border mx-0.5 self-stretch" aria-hidden />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={active?.h1 ?? false}
            label="Heading 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={active?.h2 ?? false}
            label="Heading 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={active?.h3 ?? false}
            label="Heading 3"
          >
            H3
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={active?.paragraph ?? false}
            label="Paragraph"
          >
            ¶
          </ToolbarButton>

          <div className="w-px bg-border mx-0.5 self-stretch" aria-hidden />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={active?.bulletList ?? false}
            label="Bullet list"
          >
            • List
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={active?.code ?? false}
            label="Inline code"
          >
            {"`code`"}
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={active?.codeBlock ?? false}
            label="Code block"
          >
            {"```"}
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            active={false}
            label="Horizontal rule"
          >
            —
          </ToolbarButton>
        </div>
      ) : null}

      <EditorContent
        editor={editor}
        className={[
          "outline-none min-h-[200px] text-fg",
          "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]",
          "[&_.ProseMirror_h1]:font-serif [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-3 [&_.ProseMirror_h1]:mt-4",
          "[&_.ProseMirror_h2]:font-serif [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:mt-3",
          "[&_.ProseMirror_h3]:font-serif [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:mt-3",
          "[&_.ProseMirror_p]:mb-2",
          "[&_.ProseMirror_strong]:font-bold",
          "[&_.ProseMirror_em]:italic",
          "[&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-sm [&_.ProseMirror_code]:bg-surface [&_.ProseMirror_code]:border [&_.ProseMirror_code]:border-border [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded",
          "[&_.ProseMirror_pre]:bg-surface [&_.ProseMirror_pre]:border [&_.ProseMirror_pre]:border-border [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:mb-3 [&_.ProseMirror_pre]:overflow-x-auto",
          "[&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:border-0 [&_.ProseMirror_pre_code]:p-0 [&_.ProseMirror_pre_code]:font-mono [&_.ProseMirror_pre_code]:text-sm",
          "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:mb-2",
          "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:mb-2",
          "[&_.ProseMirror_li]:mb-0.5",
          "[&_.ProseMirror_hr]:border-border [&_.ProseMirror_hr]:my-4",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-['Start_writing…'] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0",
        ].join(" ")}
      />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`cursor-pointer px-2 py-1 rounded text-sm font-mono transition-colors ${
        active
          ? "bg-accent text-accent-fg"
          : "bg-surface text-fg hover:bg-surface-hover"
      }`}
    >
      {children}
    </button>
  );
}
