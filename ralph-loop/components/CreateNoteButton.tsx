"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNoteAction } from "@/lib/actions/notes";

export default function CreateNoteButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    const result = await createNoteAction();
    setLoading(false);
    if ("note" in result) {
      router.push(`/notes/${result.note.id}`);
    }
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md font-medium hover:bg-neutral-700 dark:hover:bg-neutral-300 disabled:opacity-50 transition-colors"
    >
      {loading ? "Creating…" : "New note"}
    </button>
  );
}
