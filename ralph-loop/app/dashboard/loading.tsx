export default function DashboardLoading() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-9 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    </main>
  );
}
