<script setup lang="ts">
import { computed } from 'vue'
import moonIcon from '@iconify-icons/keyline-icons/moon'
import sunIcon from '@iconify-icons/keyline-icons/sun'
import VButton from '../../components/form/VButton/VButton.vue'
import VNavItem from '../../components/navigation/VNavItem/VNavItem.vue'
import { VIcon } from '../../components/primitives/VIcon'
import { useTheme, type VTheme } from '../../composables/useTheme'

/**
 * Shared light/dark switch for the templates, built on `useTheme`
 * (persists in localStorage, honours `prefers-color-scheme`).
 * - variant "segmented": sun / moon icon group (orientation horizontal | vertical)
 * - variant "pill": single outline button that toggles
 * - variant "icon": icon-only nav item that toggles (same footprint as VSidebar rail items)
 */
const props = withDefaults(
  defineProps<{
    variant?: 'segmented' | 'pill' | 'icon'
    orientation?: 'vertical' | 'horizontal'
    size?: 'sm' | 'md'
  }>(),
  { variant: 'segmented', orientation: 'horizontal', size: 'md' },
)

// Respect a theme already stamped on <html> (e.g. by the Storybook toolbar) until the user chooses one.
function initial(): VTheme {
  if (typeof document === 'undefined') return 'system'
  const t = document.documentElement.dataset.theme
  return t === 'light' || t === 'dark' || t === 'system' ? t : 'system'
}
const { resolvedTheme, setTheme, toggleTheme } = useTheme({ default: initial() })
const dark = computed(() => resolvedTheme.value === 'dark')
</script>

<template>
  <VButton
    v-if="props.variant === 'pill'"
    variant="outline"
    shape="pill"
    :size="props.size"
    :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'"
    data-test-id="theme-toggle"
    @click="toggleTheme"
  >
    <VIcon :icon="dark ? sunIcon : moonIcon" size="sm" />
    <span>{{ dark ? 'Light' : 'Dark' }}</span>
  </VButton>
  <VNavItem
    v-else-if="props.variant === 'icon'"
    collapsed
    :label="dark ? 'Light theme' : 'Dark theme'"
    :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'"
    data-test-id="theme-toggle"
    @click="toggleTheme"
  >
    <template #icon><VIcon :icon="dark ? sunIcon : moonIcon" size="sm" /></template>
  </VNavItem>
  <div
    v-else
    class="theme-toggle"
    :class="`theme-toggle--${props.orientation}`"
    role="group"
    aria-label="Color theme"
    data-test-id="theme-toggle"
  >
    <button
      type="button"
      class="theme-toggle__btn"
      :class="{ 'is-on': !dark }"
      :aria-pressed="!dark"
      aria-label="Light theme"
      @click="setTheme('light')"
    ><VIcon :icon="sunIcon" size="sm" /></button>
    <button
      type="button"
      class="theme-toggle__btn"
      :class="{ 'is-on': dark }"
      :aria-pressed="dark"
      aria-label="Dark theme"
      @click="setTheme('dark')"
    ><VIcon :icon="moonIcon" size="sm" /></button>
  </div>
</template>

<style scoped>
.theme-toggle { display: inline-flex; gap: 2px; padding: 3px; border-radius: var(--v-radius-pill); background: var(--v-color-surface-muted); border: 1px solid var(--v-color-border); }
.theme-toggle--vertical { flex-direction: column; border-radius: 14px; }
.theme-toggle__btn { display: grid; place-items: center; width: 28px; height: 28px; border: 0; border-radius: var(--v-radius-circle); background: transparent; color: var(--v-color-text-muted); cursor: pointer; }
.theme-toggle__btn:hover { color: var(--v-color-text); }
.theme-toggle__btn.is-on { background: var(--v-color-surface); color: var(--v-color-primary-text); box-shadow: var(--v-shadow-sm); }
.theme-toggle__btn:focus-visible { outline: 2px solid var(--v-color-focus); outline-offset: 1px; }
</style>
