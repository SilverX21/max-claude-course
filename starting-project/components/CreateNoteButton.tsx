"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function CreateNoteButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function openModal() {
    setError(null);
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function closeModal() {
    setOpen(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = inputRef.current?.value.trim();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || undefined }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `Server error (${res.status})`);
        return;
      }

      const note = await res.json();
      router.push(`/notes/${note.id}`);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="cursor-pointer px-4 py-2 rounded-md bg-accent text-accent-fg text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        New note
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-note-title"
          className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-fg/20 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Dialog panel */}
          <div className="relative z-10 w-full max-w-sm mx-4 bg-surface border border-border rounded-2xl shadow-xl p-6 animate-scale-in">
            <h2
              id="create-note-title"
              className="font-serif text-lg font-semibold text-fg mb-4"
            >
              New note
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              <label
                htmlFor="note-title"
                className="block text-sm font-medium text-fg mb-1.5"
              >
                Title
              </label>
              <input
                id="note-title"
                ref={inputRef}
                type="text"
                placeholder="Untitled note"
                maxLength={200}
                className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />

              {error ? (
                <p role="alert" className="mt-2 text-sm text-danger bg-danger-surface px-3 py-2 rounded-md">
                  {error}
                </p>
              ) : null}

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer px-4 py-2 rounded-md text-sm text-fg hover:bg-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer px-4 py-2 rounded-md bg-accent text-accent-fg text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
