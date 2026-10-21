import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import type { VNavItemVariant } from '../VNavItem/VNavItem.types'
import type { ResolvedVSidebarItem, VSidebarEmits, VSidebarProps } from './VSidebar.types'
import { mountVSidebar } from './mountVSidebar'

type VSidebarEmitFn = <K extends keyof VSidebarEmits>(e: K, ...args: VSidebarEmits[K]) => void

/** Entry of the keyboard-navigable (visible) list. */
interface FlatEntry {
  value: string
  node: ResolvedVSidebarItem
  parent: string | null
}

/** Distance (px) kept free at the nav edges so the fade masks never cover the target. */
const SCROLL_PAD = 28

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
}

export function useVSidebar(props: VSidebarProps, emit: VSidebarEmitFn) {
  const uid = useId()
  const config = computed(() => mountVSidebar(props))
  const internalCollapsed = ref(config.value.collapsed)
  const internalLocked = ref(Boolean(props.locked))
  const internalActiveItem = ref(config.value.activeItem)
  const internalExpandedSections = ref<string[]>([...config.value.expandedSections])
  const searchQuery = ref('')
  const navRef = ref<HTMLElement | null>(null)

  // ── scroll state (fades + auto-hiding scrollbar) ─────────────────────────────
  const scrollAtTop = ref(true)
  const scrollAtBottom = ref(true)
  const scrolling = ref(false)
  let scrollTimer: ReturnType<typeof setTimeout> | undefined
  let resizeObserver: ResizeObserver | undefined

  function updateScrollState(): void {
    const el = navRef.value
    if (!el) return
    scrollAtTop.value = el.scrollTop <= 1
    scrollAtBottom.value = el.scrollHeight - el.clientHeight - el.scrollTop <= 1
  }

  function onNavScroll(): void {
    updateScrollState()
    scrolling.value = true
    clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
      scrolling.value = false
    }, 700)
  }

  watch(navRef, (el) => {
    resizeObserver?.disconnect()
    resizeObserver = undefined
    if (!el) return
    updateScrollState()
    if (typeof ResizeObserver === 'undefined') return
    resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(el)
    if (el.firstElementChild) resizeObserver.observe(el.firstElementChild)
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    clearTimeout(scrollTimer)
  })

  const navAttrs = computed(() => ({
    'data-scroll-top': scrollAtTop.value ? 'true' : 'false',
    'data-scroll-bottom': scrollAtBottom.value ? 'true' : 'false',
    'data-scrolling': scrolling.value ? 'true' : 'false',
  }))

  /**
   * Scrolls only the nav (never the page) so `el` is visible. When a `header`
   * is given the whole header→el block is shown if it fits, otherwise the
   * header is aligned to the top.
   */
  function scrollIntoNav(el: Element | null | undefined, header?: Element | null, smooth = true): void {
    const nav = navRef.value
    if (!nav || !el) return
    const n = nav.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    const top = header ? header.getBoundingClientRect().top : r.top
    let bottom = r.bottom
    const room = n.height - SCROLL_PAD * 2
    if (room > 0 && bottom - top > room) bottom = top + room
    let delta = 0
    if (top < n.top + SCROLL_PAD) delta = top - (n.top + SCROLL_PAD)
    else if (bottom > n.bottom - SCROLL_PAD) delta = bottom - (n.bottom - SCROLL_PAD)
    if (Math.abs(delta) < 1) return
    const target = Math.max(0, nav.scrollTop + delta)
    if (typeof nav.scrollTo === 'function') {
      nav.scrollTo({ top: target, behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto' })
    } else {
      nav.scrollTop = target
    }
  }

  function scrollActiveIntoView(smooth: boolean): void {
    const el = navRef.value?.querySelector<HTMLElement>('[data-active="true"]')
    scrollIntoNav(el, null, smooth)
  }

  /** `<Transition @after-enter>` hook of a submenu: reveal the expanded block. */
  function onSectionEntered(el: Element): void {
    scrollIntoNav(el, el.previousElementSibling)
  }

  // ── controlled-prop syncing ──────────────────────────────────────────────────
  watch(
    () => [props.collapsed, props.modelValue] as const,
    ([collapsed, modelValue]) => {
      const next = collapsed ?? modelValue
      if (next !== undefined) internalCollapsed.value = Boolean(next)
    },
  )

  watch(
    () => props.locked,
    (locked) => {
      if (locked !== undefined) internalLocked.value = Boolean(locked)
    },
  )

  watch(
    () => props.activeItem,
    (activeItem) => {
      if (activeItem !== undefined) internalActiveItem.value = activeItem
    },
  )

  watch(
    () => props.expandedSections,
    (expandedSections) => {
      if (expandedSections !== undefined) internalExpandedSections.value = [...expandedSections]
    },
    { deep: true },
  )

  const locked = computed(() => internalLocked.value)
  const collapsed = computed(() => (locked.value ? false : internalCollapsed.value))
  const labelsVisible = computed(() => config.value.variant !== 'icons' && !collapsed.value)
  const activeItem = computed(() =>
    props.activeItem === undefined ? internalActiveItem.value : config.value.activeItem,
  )
  const expandedSections = computed(() => internalExpandedSections.value)

  const widthStyle = computed(() => {
    const w = props.width
    if (w === undefined || w === null || w === '') return undefined
    return { '--v-sidebar-width': typeof w === 'number' ? `${w}px` : w }
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-sidebar',
      `v-sidebar--${config.value.size}`,
      `v-sidebar--${config.value.variant}`,
      {
        'v-sidebar--collapsed': collapsed.value,
        'v-sidebar--locked': locked.value,
        'v-sidebar--disabled': config.value.disabled,
        'v-sidebar--has-width': widthStyle.value !== undefined,
        'v-sidebar--group-dividers': config.value.groupDividers,
        'v-sidebar--chevron-start': config.value.groupChevron === 'start',
        'v-sidebar--group-open-up': config.value.groupChevronOpen === 'up',
        'v-sidebar--chevron-updown': config.value.chevron === 'updown',
      },
    ],
    style: widthStyle.value,
    'aria-label': config.value.ariaLabel,
    'aria-disabled': config.value.disabled || undefined,
    'data-test-id': 'v-sidebar',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-collapsed': collapsed.value ? 'true' : 'false',
    'data-locked': locked.value ? 'true' : 'false',
  }))

  function setCollapsed(next: boolean): void {
    if (config.value.disabled || locked.value) return
    internalCollapsed.value = next
    emit('update:collapsed', next)
    emit('update:modelValue', next)
  }

  function toggleCollapsed(): void {
    if (config.value.disabled || locked.value) return
    setCollapsed(!collapsed.value)
  }

  function toggleLocked(): void {
    if (config.value.disabled) return
    const next = !locked.value
    if (next && collapsed.value) {
      internalCollapsed.value = false
      emit('update:collapsed', false)
      emit('update:modelValue', false)
    }
    internalLocked.value = next
    emit('update:locked', next)
  }

  const itemVariant = computed((): VNavItemVariant => {
    if (config.value.variant === 'card') return 'soft'
    if (config.value.variant === 'workspace') return 'raised'
    return 'default'
  })

  // ── tree helpers (over the unfiltered tree) ──────────────────────────────────
  const nodeIndex = computed(() => {
    const map = new Map<string, ResolvedVSidebarItem>()
    const walk = (nodes: ResolvedVSidebarItem[]) => {
      for (const node of nodes) {
        map.set(node.value, node)
        if (node.children.length) walk(node.children)
      }
    }
    walk(config.value.resolvedItems)
    return map
  })

  function siblingsOf(node: ResolvedVSidebarItem): ResolvedVSidebarItem[] {
    const parent = node.parent ? nodeIndex.value.get(node.parent) : undefined
    return parent ? parent.children : config.value.resolvedItems
  }

  function descendantValues(node: ResolvedVSidebarItem, out: string[] = []): string[] {
    for (const child of node.children) {
      out.push(child.value)
      descendantValues(child, out)
    }
    return out
  }

  function ancestorValues(value: string): string[] {
    const out: string[] = []
    let node = nodeIndex.value.get(value)
    while (node?.parent) {
      out.push(node.parent)
      node = nodeIndex.value.get(node.parent)
    }
    return out
  }

  const activeChain = computed(() => new Set(ancestorValues(activeItem.value)))

  function isItemActive(value: string): boolean {
    return activeItem.value === value
  }

  /** True for every ancestor of the active item ("contains active"). */
  function containsActive(value: string): boolean {
    return activeChain.value.has(value)
  }

  // ── search filter ────────────────────────────────────────────────────────────
  const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())
  const searching = computed(() => config.value.filterOnSearch && normalizedQuery.value.length > 0)

  const filtered = computed(() => {
    const forced = new Set<string>()
    if (!searching.value) return { tree: config.value.resolvedItems, forced }
    const q = normalizedQuery.value
    const filterNodes = (nodes: ResolvedVSidebarItem[]): ResolvedVSidebarItem[] => {
      const out: ResolvedVSidebarItem[] = []
      let pendingHeading: ResolvedVSidebarItem | null = null
      for (const node of nodes) {
        if (node.type === 'heading') {
          pendingHeading = node
          continue
        }
        const selfMatch = node.label.toLowerCase().includes(q)
        if (selfMatch && node.children.length) {
          // Parent match: reveal the whole subtree, expanded.
          if (pendingHeading) {
            out.push(pendingHeading)
            pendingHeading = null
          }
          forced.add(node.value)
          out.push(node)
          continue
        }
        const kids = node.children.length ? filterNodes(node.children) : []
        if (!selfMatch && !kids.length) continue
        if (pendingHeading) {
          out.push(pendingHeading)
          pendingHeading = null
        }
        if (kids.length) {
          forced.add(node.value)
          out.push({ ...node, children: kids, hasChildren: true })
        } else {
          out.push(node)
        }
      }
      return out
    }
    return { tree: filterNodes(config.value.resolvedItems), forced }
  })

  const visibleItems = computed(() => filtered.value.tree)
  const showEmpty = computed(() => searching.value && visibleItems.value.length === 0)

  /** Splits a label into plain / matched segments for the active search query. */
  function labelParts(label: string): Array<{ text: string; match: boolean }> {
    const q = normalizedQuery.value
    if (!searching.value || !q) return [{ text: label, match: false }]
    const lower = label.toLowerCase()
    const parts: Array<{ text: string; match: boolean }> = []
    let from = 0
    let at = lower.indexOf(q, from)
    if (at < 0) return [{ text: label, match: false }]
    while (at >= 0) {
      if (at > from) parts.push({ text: label.slice(from, at), match: false })
      parts.push({ text: label.slice(at, at + q.length), match: true })
      from = at + q.length
      at = lower.indexOf(q, from)
    }
    if (from < label.length) parts.push({ text: label.slice(from), match: false })
    return parts
  }

  function isSectionExpanded(value: string): boolean {
    return (searching.value && filtered.value.forced.has(value)) || expandedSections.value.includes(value)
  }

  // ── expand / collapse (accordion aware) ──────────────────────────────────────
  function commitExpanded(next: string[], changed: Array<[string, boolean]>): void {
    internalExpandedSections.value = next
    emit('update:expandedSections', next)
    for (const [value, expanded] of changed) emit('section-toggle', value, expanded)
  }

  function accordionAppliesTo(node: ResolvedVSidebarItem): boolean {
    return node.type === 'group' ? config.value.accordionGroups : config.value.accordion
  }

  /** Opens `node`, closing its open siblings (and their descendants) in accordion mode. */
  function computeOpen(
    node: ResolvedVSidebarItem,
    list: string[],
    changed: Array<[string, boolean]>,
    applyAccordion = true,
  ): string[] {
    let next = list.includes(node.value) ? [...list] : [...list, node.value]
    if (!list.includes(node.value)) changed.push([node.value, true])
    if (applyAccordion && accordionAppliesTo(node)) {
      for (const sibling of siblingsOf(node)) {
        if (sibling.value === node.value || sibling.type !== node.type || !sibling.children.length) continue
        const drop = new Set([sibling.value, ...descendantValues(sibling)])
        for (const value of next) {
          if (drop.has(value)) changed.push([value, false])
        }
        next = next.filter((value) => !drop.has(value))
      }
    }
    return next
  }

  function openSection(value: string): void {
    const node = nodeIndex.value.get(value)
    if (!node || config.value.disabled || expandedSections.value.includes(value)) return
    const changed: Array<[string, boolean]> = []
    commitExpanded(computeOpen(node, expandedSections.value, changed), changed)
  }

  function toggleSection(value: string): void {
    if (config.value.disabled) return
    const node = nodeIndex.value.get(value)
    const wasExpanded = expandedSections.value.includes(value)
    if (!node) {
      const next = wasExpanded
        ? expandedSections.value.filter((candidate) => candidate !== value)
        : [...expandedSections.value, value]
      commitExpanded(next, [[value, !wasExpanded]])
      return
    }
    if (wasExpanded) {
      commitExpanded(expandedSections.value.filter((candidate) => candidate !== value), [[value, false]])
    } else {
      const changed: Array<[string, boolean]> = []
      commitExpanded(computeOpen(node, expandedSections.value, changed), changed)
    }
  }

  /** Opens the ancestor chain of `value` (used for the active item). */
  function revealItem(value: string, applyAccordion: boolean): boolean {
    const chain = ancestorValues(value).reverse() // outermost first
    let list = expandedSections.value
    const changed: Array<[string, boolean]> = []
    for (const ancestor of chain) {
      const node = nodeIndex.value.get(ancestor)
      if (node && !list.includes(ancestor)) list = computeOpen(node, list, changed, applyAccordion)
    }
    if (!changed.length) return false
    commitExpanded(list, changed)
    return true
  }

  function selectItem(item: ResolvedVSidebarItem): void {
    if (config.value.disabled || item.disabled || item.type === 'heading') return
    if (item.hasChildren) {
      if (collapsed.value) {
        // Rail mode: expand the sidebar and reveal this section.
        setCollapsed(false)
        openSection(item.value)
      } else {
        toggleSection(item.value)
      }
      return
    }
    internalActiveItem.value = item.value
    emit('update:activeItem', item.value)
    emit('select', item.value)
  }

  // ── search ───────────────────────────────────────────────────────────────────
  function onSearchChange(value: string): void {
    searchQuery.value = value
    emit('search', value)
  }

  function onSearchInput(event: Event): void {
    onSearchChange((event.target as HTMLInputElement).value)
  }

  function clearSearch(): void {
    onSearchChange('')
  }

  // ── keyboard navigation ──────────────────────────────────────────────────────
  const flatEntries = computed((): FlatEntry[] => {
    const out: FlatEntry[] = []
    const walk = (nodes: ResolvedVSidebarItem[], parent: string | null) => {
      for (const node of nodes) {
        if (node.type === 'heading' || node.disabled) continue
        if (node.type === 'group') {
          if (!labelsVisible.value) {
            walk(node.children, parent)
            continue
          }
          if (node.collapsible) out.push({ value: node.value, node, parent })
          if (!node.collapsible || isSectionExpanded(node.value)) {
            walk(node.children, node.collapsible ? node.value : parent)
          }
          continue
        }
        out.push({ value: node.value, node, parent })
        if (node.hasChildren && labelsVisible.value && isSectionExpanded(node.value)) {
          walk(node.children, node.value)
        }
      }
    }
    walk(visibleItems.value, null)
    return out
  })

  function focusNavItem(value: string): void {
    void nextTick(() => {
      const safe = value.replace(/"/g, '\\"')
      const el = navRef.value?.querySelector<HTMLElement>(`[data-sidebar-key="${safe}"]`)
      el?.focus()
      scrollIntoNav(el, null)
    })
  }

  function onItemKeydown(event: KeyboardEvent, item: ResolvedVSidebarItem): void {
    const entries = flatEntries.value
    const index = entries.findIndex((candidate) => candidate.value === item.value)
    if (index < 0) return
    const entry = entries[index]
    const expandable = item.hasChildren && labelsVisible.value
    const open = expandable && isSectionExpanded(item.value)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusNavItem(entries[(index + 1) % entries.length].value)
        break
      case 'ArrowUp':
        event.preventDefault()
        focusNavItem(entries[(index - 1 + entries.length) % entries.length].value)
        break
      case 'Home':
        event.preventDefault()
        focusNavItem(entries[0].value)
        break
      case 'End':
        event.preventDefault()
        focusNavItem(entries[entries.length - 1].value)
        break
      case 'ArrowRight':
        if (!expandable) return
        event.preventDefault()
        if (!open) toggleSection(item.value)
        else if (entries[index + 1]?.parent === item.value) focusNavItem(entries[index + 1].value)
        break
      case 'ArrowLeft':
        if (open) {
          event.preventDefault()
          toggleSection(item.value)
        } else if (entry.parent) {
          event.preventDefault()
          focusNavItem(entry.parent)
        }
        break
      // Enter / Space are handled by VNavItem (click) and the group header button.
    }
  }

  // ── active item: reveal + scroll ─────────────────────────────────────────────
  onMounted(() => {
    revealItem(activeItem.value, false)
    void nextTick(() => {
      updateScrollState()
      scrollActiveIntoView(false)
    })
  })

  watch(activeItem, (value) => {
    const expanded = revealItem(value, config.value.accordion)
    void nextTick(() => {
      // Newly opened sections animate; their after-enter hook reveals the block.
      if (!expanded) scrollActiveIntoView(true)
    })
  })

  function itemTestId(value: string): string {
    return `v-sidebar-nav-item-${value}`
  }

  function submenuId(value: string): string {
    return `${uid}-sub-${value.replace(/[^\w-]/g, '_')}`
  }

  return {
    config,
    collapsed,
    locked,
    labelsVisible,
    activeItem,
    expandedSections,
    searchQuery,
    searching,
    visibleItems,
    showEmpty,
    labelParts,
    navRef,
    navAttrs,
    rootAttrs,
    setCollapsed,
    toggleCollapsed,
    toggleLocked,
    itemVariant,
    isItemActive,
    containsActive,
    isSectionExpanded,
    selectItem,
    toggleSection,
    openSection,
    onSearchInput,
    onSearchChange,
    clearSearch,
    onItemKeydown,
    onNavScroll,
    onSectionEntered,
    itemTestId,
    submenuId,
  }
}
