import type { IconifyIcon } from '@iconify/types'
import bellIcon from '@iconify-icons/keyline-icons/bell'
import fileTextIcon from '@iconify-icons/keyline-icons/file-text'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import plusIcon from '@iconify-icons/keyline-icons/plus'
import searchIcon from '@iconify-icons/keyline-icons/search'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import type { VEmptyStateAction, VEmptyStateProps, VEmptyStateVariant } from './VEmptyState.types'

export const V_EMPTY_STATE_ACTION_ICONS: Record<string, IconifyIcon> = {
  plus: plusIcon,
}

export const V_EMPTY_STATE_VARIANT_ICONS: Record<VEmptyStateVariant, IconifyIcon> = {
  default: folderIcon,
  results: searchIcon,
  files: fileTextIcon,
  notifications: bellIcon,
  create: sparklesIcon,
}

const VARIANT_COPY: Record<VEmptyStateVariant, { title: string; description: string; action?: VEmptyStateAction }> = {
  default: {
    title: 'No projects yet',
    description: 'Get started by creating your first project.',
    action: { label: 'Create project', icon: 'plus' },
  },
  results: {
    title: 'No results',
    description: "We couldn't find anything matching your search.",
    action: { label: 'Try a different search' },
  },
  files: {
    title: 'No files',
    description: "You haven't uploaded any files yet.",
    action: { label: 'Upload a file', icon: 'plus' },
  },
  notifications: {
    title: 'No notifications',
    description: "You're all caught up! We'll notify you when something new happens.",
    action: { label: 'View settings' },
  },
  create: {
    title: 'Create your first project',
    description: 'Get started by creating a project to organize your work.',
    action: { label: 'Create project', icon: 'plus' },
  },
}

export function mountVEmptyState(props: VEmptyStateProps) {
  const variant = props.variant ?? 'default'
  const copy = VARIANT_COPY[variant]

  return {
    size: props.size ?? 'md',
    variant,
    compact: Boolean(props.compact),
    showIllustration: props.showIllustration ?? true,
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
    title: props.title ?? copy.title,
    description: props.description ?? copy.description,
    action: props.action ?? copy.action,
    iconData: V_EMPTY_STATE_VARIANT_ICONS[variant],
    headingLevel: props.headingLevel ?? 2,
  } as const
}

export function resolveEmptyStateActionIcon(icon?: string) {
  if (!icon) return undefined
  return V_EMPTY_STATE_ACTION_ICONS[icon]
}
