import type { VGridCols } from '../shared/gridUtils'

export type VCardGridGap = number

export interface VCardGridProps {
  /** N�mero fixo de colunas, ou mapa por breakpoint ({ default, sm, md, lg, xl }). Ignorado quando `minCardWidth` � definido. */
  cols?: VGridCols
  /** Largura m�nima de cada card (px). Ativa o modo auto-fill: o n�mero de colunas se adapta � largura do container. */
  minCardWidth?: number
  gap?: VCardGridGap
  ariaLabel?: string
}
