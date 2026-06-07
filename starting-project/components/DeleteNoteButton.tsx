"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteNoteButton({ noteId }: { noteId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  return (
    <button
      onClick={handleDelete}
      onBlur={() => setConfirming(false)}
      className="cursor-pointer text-sm px-3 py-1.5 rounded border transition-colors text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
    >
      {confirming ? "Confirm?" : "Delete"}
    </button>
  );
}
