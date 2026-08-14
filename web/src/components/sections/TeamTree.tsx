import { cn } from '@/lib/cn'
import type { TreeNode } from '@/lib/tree'
import type { TeamMember } from '@/types/employee'

type TeamTreeProps = {
  nodes: TreeNode<TeamMember>[]
  isRoot?: boolean
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

export function TeamTree({ nodes, isRoot = true }: TeamTreeProps) {
  return (
    <ul className={cn('flex flex-col gap-1 pl-6', !isRoot && 'border-l border-border')}>
      {nodes.map((node, index) => (
        <li
          key={node.id}
          className="opacity-0 animate-[fade-in_300ms_ease_forwards]"
          style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
        >
          <div className="relative flex items-center gap-3 rounded-md px-2 py-2 transition-colors duration-300 hover:bg-surface">
            {!isRoot && (
              <span
                aria-hidden="true"
                className="absolute -left-6 top-1/2 h-px w-6 -translate-y-1/2 bg-border"
              />
            )}
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface font-mono text-xs text-accent"
              style={{ opacity: 1 - node.depth * 0.08 }}
            >
              {initials(node.name)}
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm text-text">{node.name}</span>
              <span className="truncate font-mono text-xs uppercase tracking-wide text-text-muted">
                {node.positionName}
              </span>
            </div>
          </div>
          {node.children.length > 0 && <TeamTree nodes={node.children} isRoot={false} />}
        </li>
      ))}
    </ul>
  )
}
