"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { updateNoteAction, deleteNoteAction } from "@/lib/actions/notes";
import EditorToolbar from "@/components/EditorToolbar";
import ShareToggle from "@/components/ShareToggle";
import type { Note } from "@/lib/notes";
import Link from "next/link";

type Props = {
  note: Note;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function NoteEditor({ note }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content: JSON.parse(note.contentJson),
    onUpdate: ({ editor }) => {
      if (isFirstRender.current) return;
      scheduleAutoSave({ contentJson: JSON.stringify(editor.getJSON()) });
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    isFirstRender.current = false;
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  const save = useCallback(
    async (data: { title?: string; contentJson?: string }) => {
      setSaveStatus("saving");
      const result = await updateNoteAction(note.id, data);
      setSaveStatus("error" in result ? "error" : "saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    [note.id]
  );

  function scheduleAutoSave(data: { title?: string; contentJson?: string }) {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => save(data), 1500);
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    scheduleAutoSave({ title: value });
  }

  async function handleSave() {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    await save({
      title,
      contentJson: editor ? JSON.stringify(editor.getJSON()) : undefined,
    });
  }

  async function handleDelete() {
    setDeleting(true);
    await deleteNoteAction(note.id);
    router.push("/dashboard");
  }

  const statusLabel: Record<SaveStatus, string> = {
    idle: "",
    saving: "Saving…",
    saved: "Saved",
    error: "Save failed",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <Link
          href="/dashboard"
          className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          ← Dashboard
        </Link>
        <div className="flex items-center gap-3">
          {saveStatus !== "idle" && (
            <span
              className={`text-xs ${saveStatus === "error" ? "text-red-500" : "text-neutral-500"}`}
            >
              {statusLabel[saveStatus]}
            </span>
          )}
          <button
            onClick={handleSave}
            className="text-sm px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm px-3 py-1.5 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Note title"
        className="w-full text-2xl font-bold mb-4 bg-transparent border-none outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
      />

      <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden mb-6">
        {editor && <EditorToolbar editor={editor} />}
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none p-4 min-h-64 focus-within:outline-none"
        />
      </div>

      <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4">
        <h2 className="text-sm font-medium mb-3">Sharing</h2>
        <ShareToggle note={note} />
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="font-semibold mb-2">Delete note?</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
