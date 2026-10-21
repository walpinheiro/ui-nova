import type { VDiffStatProps, VDiffStatSize } from './VDiffStat.types'

const SIZES: VDiffStatSize[] = ['sm', 'md', 'lg']

export type VDiffBlock = 'add' | 'del' | 'neutral'

export function diffBlocks(additions: number, deletions: number, count: number): VDiffBlock[] {
  const total = additions + deletions
  if (total === 0) return Array.from({ length: count }, () => 'neutral')
  let add = Math.round((additions / total) * count)
  let del = Math.round((deletions / total) * count)
  if (additions > 0 && add === 0) add = 1
  if (deletions > 0 && del === 0) del = 1
  while (add + del > count) {
    if (add >= del) add -= 1
    else del -= 1
  }
  return [
    ...Array.from({ length: add }, () => 'add' as const),
    ...Array.from({ length: del }, () => 'del' as const),
    ...Array.from({ length: count - add - del }, () => 'neutral' as const),
  ]
}

const formatter = new Intl.NumberFormat('en-US')

export function mountVDiffStat(props: VDiffStatProps) {
  const size = SIZES.includes(props.size as VDiffStatSize) ? (props.size as VDiffStatSize) : 'md'
  const additions = Math.max(0, Math.floor(props.additions ?? 0))
  const deletions = Math.max(0, Math.floor(props.deletions ?? 0))
  const blockCount = Math.max(1, Math.floor(props.blockCount ?? 5))

  return {
    size,
    additions,
    deletions,
    additionsText: `+${formatter.format(additions)}`,
    deletionsText: `−${formatter.format(deletions)}`,
    label: `${additions} additions, ${deletions} deletions`,
    blocks: props.blocks ? diffBlocks(additions, deletions, blockCount) : [],
  } as const
}
