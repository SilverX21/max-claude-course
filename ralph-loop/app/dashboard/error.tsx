"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 text-center">
      <p className="text-red-600 dark:text-red-400 mb-4">
        {error.message || "Something went wrong loading your notes."}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md"
      >
        Try again
      </button>
    </main>
  );
}
