import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import type {
  VTreeNavigationEmit,
  VTreeNavigationFlatNode,
  VTreeNavigationItem,
  VTreeNavigationProps,
} from './VTreeNavigation.types'
import {
  flattenVisibleTree,
  mountVTreeNavigation,
  resolveCount,
  resolveIconData,
} from './mountVTreeNavigation'

function normalizeActive(value: string | string[] | undefined, multiple: boolean): string[] {
  if (value === undefined) return []
  const values = Array.isArray(value) ? value : [value]
  const unique = values.filter((candidate, index) => values.indexOf(candidate) === index)
  return multiple ? unique : unique.slice(0, 1)
}

function activeFromKeys(keys: string[], multiple: boolean): string | string[] {
  return multiple ? keys : (keys[0] ?? '')
}

function mergeLoadedChildren(
  items: VTreeNavigationItem[],
  loaded: Record<string, VTreeNavigationItem[]>,
): VTreeNavigationItem[] {
  return items.map((item) => {
    const children = loaded[item.key] ?? item.children
    const nextChildren = children?.length ? mergeLoadedChildren(children, loaded) : children
    return nextChildren ? { ...item, children: nextChildren } : item
  })
}

export function useVTreeNavigation(props: VTreeNavigationProps, emit: VTreeNavigationEmit) {
  const config = computed(() => mountVTreeNavigation(props))
  const internalExpanded = ref<string[]>(config.value.defaultExpandedKeys)
  const internalActive = ref<string[]>(
    normalizeActive(config.value.defaultActive, config.value.multiple),
  )
  const loadedChildren = shallowRef<Record<string, VTreeNavigationItem[]>>({})
  const loadingKeys = ref<Set<string>>(new Set())
  const nodeRefs = new Map<string, HTMLElement>()
  const focusedKey = ref<string | null>(null)

  watch(
    () => config.value.items,
    () => {
      if (props.expandedKeys === undefined) {
        internalExpanded.value = config.value.defaultExpandedKeys
      }
    },
  )

  const expandedKeys = computed(() => {
    const keys = props.expandedKeys ?? internalExpanded.value
    return new Set(keys)
  })

  const activeKeys = computed(() => {
    if (props.active !== undefined) return normalizeActive(props.active, config.value.multiple)
    return internalActive.value
  })

  const mergedItems = computed(() => mergeLoadedChildren(config.value.items, loadedChildren.value))

  const flatNodes = computed(() => flattenVisibleTree(mergedItems.value, expandedKeys.value))

  watch(
    flatNodes,
    (nodes) => {
      if (!nodes.length) {
        focusedKey.value = null
        return
      }
      if (!focusedKey.value || !nodes.some((node) => node.item.key === focusedKey.value)) {
        focusedKey.value = nodes[0]?.item.key ?? null
      }
    },
    { immediate: true },
  )

  const rootAttrs = computed<Record<string, unknown>>(() => ({
    class: [
      'v-tree-navigation',
      `v-tree-navigation--${config.value.size}`,
      `v-tree-navigation--${config.value.variant}`,
      { 'v-tree-navigation--loading': config.value.loading },
    ],
    role: 'tree',
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'aria-label': props.ariaLabel ?? 'Tree navigation',
    'aria-multiselectable': config.value.multiple || undefined,
    'data-test-id': 'tree-navigation',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': config.value.loading ? 'loading' : config.value.disabled ? 'disabled' : 'default',
  }))

  const setExpandedKeys = (keys: string[]) => {
    internalExpanded.value = keys
    emit('update:expandedKeys', keys)
  }

  const setActiveKeys = (keys: string[]) => {
    internalActive.value = keys
    const value = activeFromKeys(keys, config.value.multiple)
    emit('update:active', value)
    emit('select', value)
  }

  const isExpanded = (key: string) => expandedKeys.value.has(key)

  const isSelected = (key: string) => activeKeys.value.includes(key)

  const isNodeDisabled = (item: VTreeNavigationItem) =>
    Boolean(config.value.disabled || item.disabled)

  const getIconData = (item: VTreeNavigationItem) =>
    resolveIconData(item, config.value.variant, config.value.iconField)

  const getCount = (item: VTreeNavigationItem) => resolveCount(item, config.value.showCounts)

  const registerNodeRef = (key: string, el: HTMLElement | null) => {
    if (el) nodeRefs.set(key, el)
    else nodeRefs.delete(key)
  }

  const focusNode = (key: string) => {
    focusedKey.value = key
    void nextTick(() => nodeRefs.get(key)?.focus())
  }

  const loadNodeChildren = async (item: VTreeNavigationItem) => {
    if (!props.loadChildren || loadingKeys.value.has(item.key)) return
    loadingKeys.value = new Set([...loadingKeys.value, item.key])
    try {
      const children = await props.loadChildren(item)
      loadedChildren.value = { ...loadedChildren.value, [item.key]: children }
    } finally {
      const next = new Set(loadingKeys.value)
      next.delete(item.key)
      loadingKeys.value = next
    }
  }

  const hasExpandableChildren = (item: VTreeNavigationItem) =>
    Boolean(
      item.children?.length ||
        item.lazy ||
        config.value.lazy ||
        loadedChildren.value[item.key]?.length,
    )

  const toggleExpand = async (item: VTreeNavigationItem) => {
    if (isNodeDisabled(item) || !hasExpandableChildren(item)) return
    const keys = [...expandedKeys.value]
    const index = keys.indexOf(item.key)
    if (index >= 0) {
      keys.splice(index, 1)
    } else {
      if ((item.lazy || config.value.lazy) && props.loadChildren && !loadedChildren.value[item.key]?.length) {
        await loadNodeChildren(item)
      }
      keys.push(item.key)
    }
    setExpandedKeys(keys)
  }

  const selectNode = (item: VTreeNavigationItem) => {
    if (isNodeDisabled(item)) return
    const current = [...activeKeys.value]
    const index = current.indexOf(item.key)
    if (config.value.multiple) {
      if (index >= 0) current.splice(index, 1)
      else current.push(item.key)
    } else {
      current.splice(0, current.length, item.key)
    }
    setActiveKeys(current)
  }

  const onToggleClick = (event: MouseEvent, flat: VTreeNavigationFlatNode) => {
    event.stopPropagation()
    void toggleExpand(flat.item)
  }

  const onNodeClick = (flat: VTreeNavigationFlatNode) => {
    selectNode(flat.item)
  }

  const nodeAttrs = (flat: VTreeNavigationFlatNode): Record<string, unknown> => ({
    class: [
      'v-tree-navigation__node',
      {
        'v-tree-navigation__node--expanded': flat.isExpanded,
        'v-tree-navigation__node--selected': isSelected(flat.item.key),
        'v-tree-navigation__node--disabled': isNodeDisabled(flat.item),
        'v-tree-navigation__node--branch': flat.hasChildren,
      },
    ],
    role: 'treeitem',
    tabindex: flat.item.key === focusedKey.value ? 0 : -1,
    'aria-expanded': flat.hasChildren ? (flat.isExpanded ? 'true' : 'false') : undefined,
    'aria-selected': isSelected(flat.item.key),
    'aria-disabled': isNodeDisabled(flat.item) || undefined,
    'aria-level': flat.depth + 1,
    'data-test-id': `tree-node--${flat.item.key}`,
    style: {
      paddingInlineStart: `calc(${flat.depth} * var(--v-tree-indent-size) + var(--v-tree-node-padding-x))`,
    },
  })

  const toggleAttrs = (flat: VTreeNavigationFlatNode): Record<string, unknown> => ({
    type: 'button' as const,
    class: [
      'v-tree-navigation__toggle',
      { 'v-tree-navigation__toggle--expanded': flat.isExpanded },
    ],
    'aria-label': flat.isExpanded ? `Collapse ${flat.item.label}` : `Expand ${flat.item.label}`,
    'aria-hidden': flat.hasChildren ? undefined : true,
    tabindex: -1,
    disabled: isNodeDisabled(flat.item) || undefined,
    'data-test-id': `tree-node-toggle--${flat.item.key}`,
  })

  const onNodeKeydown = (event: KeyboardEvent, index: number) => {
    const nodes = flatNodes.value
    const flat = nodes[index]
    if (!flat || isNodeDisabled(flat.item)) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (flat.hasChildren && !flat.isExpanded) void toggleExpand(flat.item)
      else selectNode(flat.item)
      return
    }

    let targetIndex: number | null = null
    if (event.key === 'ArrowDown') targetIndex = index < nodes.length - 1 ? index + 1 : index
    else if (event.key === 'ArrowUp') targetIndex = index > 0 ? index - 1 : index
    else if (event.key === 'ArrowRight') {
      if (flat.hasChildren) {
        if (!flat.isExpanded) void toggleExpand(flat.item)
        else {
          const child = nodes.slice(index + 1).find((node) => node.parentKey === flat.item.key)
          if (child) targetIndex = nodes.indexOf(child)
        }
      }
    } else if (event.key === 'ArrowLeft') {
      if (flat.hasChildren && flat.isExpanded) void toggleExpand(flat.item)
      else if (flat.parentKey) targetIndex = nodes.findIndex((node) => node.item.key === flat.parentKey)
    } else if (event.key === 'Home') targetIndex = 0
    else if (event.key === 'End') targetIndex = nodes.length - 1

    if (targetIndex === null || targetIndex === index) return
    event.preventDefault()
    const target = nodes[targetIndex]
    if (!target) return
    focusNode(target.item.key)
  }

  const vmConfig = computed(() => ({
    ...config.value,
    flatNodes: flatNodes.value,
    activeKeys: activeKeys.value,
    expandedKeys: [...expandedKeys.value],
  }))

  return {
    config: vmConfig,
    rootAttrs,
    flatNodes,
    isSelected,
    isNodeDisabled,
    getIconData,
    getCount,
    isNodeLoading: (key: string) => loadingKeys.value.has(key),
    nodeAttrs,
    toggleAttrs,
    registerNodeRef,
    onToggleClick,
    onNodeClick,
    onNodeKeydown,
    focusNode,
  }
}
