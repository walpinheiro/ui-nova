export type VDiffStatSize = 'sm' | 'md' | 'lg'

export interface VDiffStatProps {
  additions?: number
  deletions?: number
  size?: VDiffStatSize
  /** Renders GitHub-style proportion blocks after the counts. */
  blocks?: boolean
  /** Number of proportion blocks. */
  blockCount?: number
  dataTestId?: string
}
