"use client";
import { useState } from "react";

type Props = {
  noteId: string;
  initialIsPublic: boolean;
  initialSlug: string | null;
  origin: string;
};

export function ShareToggle({ noteId, initialIsPublic, initialSlug, origin }: Props) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [slug, setSlug] = useState(initialSlug);
  const [copied, setCopied] = useState(false);

  async function toggle() {
    const res = await fetch(`/api/notes/${noteId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !isPublic }),
    });
    const data = await res.json();
    setIsPublic(data.isPublic);
    setSlug(data.publicSlug);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(`${origin}/p/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={isPublic} onChange={toggle} className="sr-only" />
        <div
          className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
            isPublic ? "bg-accent" : "bg-border"
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-accent-fg shadow-sm transition-transform duration-200 ${
              isPublic ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </div>
        <span className="text-sm text-fg">Share</span>
      </label>

      {isPublic && slug ? (
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy public link"
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-surface text-xs text-muted hover:text-fg hover:bg-surface-hover transition-all duration-150 animate-fade-in"
        >
          {copied ? <CheckIcon /> : <LinkIcon />}
          <span className={copied ? "text-accent font-medium" : ""}>
            {copied ? "Copied!" : "Copy link"}
          </span>
        </button>
      ) : null}
    </div>
  );
}

function LinkIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
