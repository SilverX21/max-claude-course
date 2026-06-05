"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateNoteButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const note = await res.json();
    router.push(`/notes/${note.id}`);
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
    >
      {loading ? "Creating..." : "New note"}
    </button>
  );
}
