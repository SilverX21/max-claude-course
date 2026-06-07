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

  const publicUrl = slug ? `${origin}/p/${slug}` : null;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={toggle}
          className="sr-only"
        />
        <div
          className={`w-9 h-5 rounded-full transition-colors ${
            isPublic ? "bg-accent" : "bg-border"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-accent-fg m-0.5 transition-transform shadow-sm ${
              isPublic ? "translate-x-4" : ""
            }`}
          />
        </div>
        <span className="text-sm text-fg">Share</span>
      </label>
      {isPublic && publicUrl ? (
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:text-accent-hover hover:underline break-all max-w-[200px] truncate transition-colors"
        >
          {publicUrl}
        </a>
      ) : null}
    </div>
  );
}
