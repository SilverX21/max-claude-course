"use client";

import { useState } from "react";
import { toggleShareAction } from "@/lib/actions/notes";
import type { Note } from "@/lib/notes";

type Props = {
  note: Note;
};

export default function ShareToggle({ note }: Props) {
  const [isPublic, setIsPublic] = useState(note.isPublic);
  const [publicSlug, setPublicSlug] = useState(note.publicSlug);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl = publicSlug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${publicSlug}`
    : null;

  async function handleToggle() {
    setLoading(true);
    const result = await toggleShareAction(note.id, !isPublic);
    setLoading(false);
    if (!("error" in result) && result.note) {
      setIsPublic(result.note.isPublic);
      setPublicSlug(result.note.publicSlug);
    }
  }

  async function handleCopy() {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isPublic}
          onClick={handleToggle}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
            isPublic
              ? "bg-green-500"
              : "bg-neutral-300 dark:bg-neutral-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isPublic ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className="text-sm font-medium">
          {isPublic ? "Public" : "Private"}
        </span>
      </div>
      {isPublic && publicUrl && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={publicUrl}
            className="flex-1 text-xs px-2 py-1 border border-neutral-200 dark:border-neutral-700 rounded bg-neutral-50 dark:bg-neutral-800 truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs px-2 py-1 border border-neutral-200 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            {copied ? "Copied!" : "Copy URL"}
          </button>
        </div>
      )}
    </div>
  );
}
