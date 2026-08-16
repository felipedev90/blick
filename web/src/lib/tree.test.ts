import { describe, expect, it } from 'vitest'

import { buildTree } from './tree'

type Item = { id: number; parentId: number | null; depth: number }

describe('buildTree', () => {
  it('monta uma árvore simples de dois níveis', () => {
    const items: Item[] = [
      { id: 1, parentId: null, depth: 0 },
      { id: 2, parentId: 1, depth: 1 },
      { id: 3, parentId: 1, depth: 1 },
    ]

    const tree = buildTree(items)

    expect(tree).toHaveLength(1)
    expect(tree[0]?.id).toBe(1)
    expect(tree[0]?.children).toHaveLength(2)
    expect(tree[0]?.children.map((c) => c.id)).toEqual([2, 3])
  })

  it('monta corretamente mesmo com itens fora de ordem pré-order (bug original)', () => {
    const items: Item[] = [
      { id: 10, parentId: 1, depth: 1 },
      { id: 20, parentId: 2, depth: 1 },
      { id: 100, parentId: 10, depth: 2 },
      { id: 1, parentId: null, depth: 0 },
      { id: 2, parentId: null, depth: 0 },
    ]

    const tree = buildTree(items)

    const rootOne = tree.find((node) => node.id === 1)
    const rootTwo = tree.find((node) => node.id === 2)

    expect(rootOne?.children.map((c) => c.id)).toEqual([10])
    expect(rootOne?.children[0]?.children.map((c) => c.id)).toEqual([100])
    expect(rootTwo?.children.map((c) => c.id)).toEqual([20])
  })

  it('trata múltiplas raízes corretamente', () => {
    const items: Item[] = [
      { id: 1, parentId: null, depth: 0 },
      { id: 2, parentId: null, depth: 0 },
      { id: 3, parentId: null, depth: 0 },
    ]

    const tree = buildTree(items)

    expect(tree).toHaveLength(3)
    expect(tree.every((node) => node.children.length === 0)).toBe(true)
  })

  it('devolve array vazio pra lista vazia', () => {
    expect(buildTree([])).toEqual([])
  })
})
