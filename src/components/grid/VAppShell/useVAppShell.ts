import { computed, ref, watch } from 'vue'
import type { VAppShellEmitFn, VAppShellProps } from './VAppShell.types'
import { mountVAppShell, resolveNavIcon } from './mountVAppShell'

export function useVAppShell(props: VAppShellProps, emit: VAppShellEmitFn) {
  const config = computed(() => mountVAppShell(props))
  const collapsed = ref(Boolean(props.sidebarCollapsed))
  const utilityOpen = ref(Boolean(props.utilityOpen))
  const searchQuery = ref(props.searchQuery ?? '')
  const searchFocused = ref(false)
  const activeItem = ref(props.activeNavItem ?? 'dashboard')

  watch(() => props.sidebarCollapsed, (v) => { if (v !== undefined) collapsed.value = v })
  watch(() => props.utilityOpen, (v) => { if (v !== undefined) utilityOpen.value = v })
  watch(() => props.searchQuery, (v) => { if (v !== undefined) searchQuery.value = v })
  watch(() => props.activeNavItem, (v) => { if (v !== undefined) activeItem.value = v })

  const resolvedNavItems = computed(() =>
    config.value.navItems.map((item) => ({
      ...item,
      iconData: resolveNavIcon(item.icon ?? item.value),
    })),
  )

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
    emit('update:sidebarCollapsed', collapsed.value)
  }

  function toggleUtility() {
    utilityOpen.value = !utilityOpen.value
    emit('update:utilityOpen', utilityOpen.value)
  }

  function closeUtility() {
    utilityOpen.value = false
    emit('update:utilityOpen', false)
  }

  function onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    searchQuery.value = value
    emit('update:searchQuery', value)
    emit('search', value)
  }

  function clearSearch() {
    searchQuery.value = ''
    emit('update:searchQuery', '')
    emit('search', '')
  }

  function selectNav(value: string) {
    activeItem.value = value
    emit('update:activeNavItem', value)
    emit('nav', value)
  }

  function onNavKeydown(event: KeyboardEvent, value: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectNav(value)
    }
  }

  function onQuickAction(name: string) {
    emit('quick-action', name)
  }

  function onShortcut(keys: string) {
    emit('shortcut', keys)
  }

  const rootAttrs = computed(() => ({
    class: [
      'v-appshell',
      `v-appshell--${config.value.variant}`,
      `v-appshell--${config.value.layoutMode}`,
      collapsed.value ? 'v-appshell--sidebar-collapsed' : null,
      utilityOpen.value ? 'v-appshell--utility-open' : null,
      searchFocused.value ? 'v-appshell--search-focused' : null,
    ],
    'data-test-id': 'v-appshell',
    'data-variant': config.value.variant,
    'data-layout-mode': config.value.layoutMode,
  }))

  return {
    config,
    collapsed,
    utilityOpen,
    searchQuery,
    searchFocused,
    activeItem,
    resolvedNavItems,
    toggleCollapsed,
    toggleUtility,
    closeUtility,
    onSearchInput,
    clearSearch,
    selectNav,
    onNavKeydown,
    onQuickAction,
    onShortcut,
    rootAttrs,
  }
}
