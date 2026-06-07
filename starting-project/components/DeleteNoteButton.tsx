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
      className={`cursor-pointer text-sm px-3 py-1.5 rounded-md border transition-colors ${
        confirming
          ? "text-white bg-danger border-danger hover:bg-danger-hover"
          : "text-danger border-border hover:bg-danger-surface"
      }`}
    >
      {confirming ? "Confirm?" : "Delete"}
    </button>
  );
}
