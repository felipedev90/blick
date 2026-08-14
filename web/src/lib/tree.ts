export type TreeNode<T> = T & { children: TreeNode<T>[] }

export function buildTree<T extends { id: number; parentId: number | null }>(
  items: T[],
): TreeNode<T>[] {
  const nodeById = new Map<number, TreeNode<T>>()

  for (const item of items) {
    nodeById.set(item.id, { ...item, children: [] })
  }

  const roots: TreeNode<T>[] = []

  for (const item of items) {
    const node = nodeById.get(item.id)!
    const parent = item.parentId !== null ? nodeById.get(item.parentId) : undefined

    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}
