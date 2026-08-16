export default function TeamLoading() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div className="h-8 w-32 animate-pulse rounded bg-surface" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-md bg-surface" />
        ))}
      </div>
    </main>
  )
}
