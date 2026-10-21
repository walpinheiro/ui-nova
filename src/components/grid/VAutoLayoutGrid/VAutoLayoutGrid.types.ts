export type VAutoLayoutGridBehavior = 'auto-fit' | 'auto-fill' | 'dense' | 'equal-height'
export type VAutoLayoutGridSize = 'compact' | 'medium' | 'spacious'

export interface VAutoLayoutGridProps {
  /** Largura m�nima (px) de cada coluna; define quantas colunas cabem. */
  minItemWidth?: number
  /** Espa�amento (px) entre linhas e colunas. Se omitido, `size` decide. */
  gap?: number
  rowGap?: number
  columnGap?: number
  behavior?: VAutoLayoutGridBehavior
  size?: VAutoLayoutGridSize
  selectable?: boolean
  ariaLabel?: string
}

export interface VAutoLayoutGridItemProps {
  id?: string
  selected?: boolean
  disabled?: boolean
  dragging?: boolean
  interactive?: boolean
  /** Quantas colunas o item ocupa (>= 1). */
  colSpan?: number
  /** Quantas linhas o item ocupa (>= 1). */
  rowSpan?: number
}

export interface VAutoLayoutGridItemEmits {
  click: [event: MouseEvent | KeyboardEvent]
  select: [selected: boolean]
}
