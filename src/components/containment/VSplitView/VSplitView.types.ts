export type VSplitViewOrientation = 'vertical' | 'horizontal'
export type VSplitViewMode = 'fixed' | 'resizable' | 'collapsible'
export type VSplitViewSizeValue = number | string

export interface VSplitViewProps {
  /** Pane sizes. Numbers > 24 are px, numbers <= 24 are flex units, strings accept px/%/fr. */
  sizes?: VSplitViewSizeValue[]
  /** vertical = panes lado a lado (divisor vertical). horizontal = panes empilhados. */
  orientation?: VSplitViewOrientation
  /** fixed = sem resize; resizable = arrastar; collapsible = resizable + recolher. Default resizable. */
  mode?: VSplitViewMode
  /** Mostra controle de recolher no divisor. Opt-in, default false. */
  collapsible?: boolean
  /** Chave de persistencia: salva/restaura sizes em localStorage (Pro tip spec §2/§5). */
  persistKey?: string
  /** Tamanho inicial(px) usado como referencia para panes flexiveis. */
  defaultSize?: number | string
  /** Tamanho minimo(px) por pane. */
  minSize?: number | string
  /** Tamanho maximo(px) por pane. */
  maxSize?: number | string
  disabled?: boolean
  ariaLabel?: string
}

export type VSplitViewEmits = {
  'update:sizes': [sizes: VSplitViewSizeValue[]]
  resize: [sizes: VSplitViewSizeValue[]]
  collapse: [index: number]
  expand: [index: number]
}

export type VSplitViewEmitFn = {
  (e: 'update:sizes', sizes: VSplitViewSizeValue[]): void
  (e: 'resize', sizes: VSplitViewSizeValue[]): void
  (e: 'collapse', index: number): void
  (e: 'expand', index: number): void
}
