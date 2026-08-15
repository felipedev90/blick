type StatCardProps = {
  label: string
  value: string
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-surface p-4">
      <span className="font-mono text-xs uppercase tracking-wide text-text-muted">{label}</span>
      <span className="text-2xl font-semibold text-text">{value}</span>
    </div>
  )
}
