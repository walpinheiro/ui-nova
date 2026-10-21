import type { VActionListProps, VActionListSize, VActionListTrailing, VActionListVariant } from './VActionList.types'

const VARIANTS: VActionListVariant[] = ['plain', 'card']
const SIZES: VActionListSize[] = ['sm', 'md']
const TRAILING: VActionListTrailing[] = ['chevron', 'external', 'none']

export function mountVActionList(props: VActionListProps) {
  const variant = VARIANTS.includes(props.variant as VActionListVariant) ? (props.variant as VActionListVariant) : 'card'
  const size = SIZES.includes(props.size as VActionListSize) ? (props.size as VActionListSize) : 'md'
  const sections = (props.sections ?? []).map((section) => ({
    ...section,
    items: (section.items ?? []).map((item) => ({
      ...item,
      trailing: TRAILING.includes(item.trailing as VActionListTrailing)
        ? (item.trailing as VActionListTrailing)
        : item.href
          ? ('external' as const)
          : ('none' as const),
    })),
  }))

  return { variant, size, sections } as const
}
