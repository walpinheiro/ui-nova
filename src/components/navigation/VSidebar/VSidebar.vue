<script setup lang="ts">

import './VSidebar.scss'

import { provide, ref, useSlots, watch } from 'vue'

import VSidebarNode from './VSidebarNode.vue'

import { VSIDEBAR_CONTEXT } from './sidebarContext'

import { VIcon } from '../../primitives/VIcon'

import { SIDEBAR_UI_ICONS } from './mountVSidebar'

import { useVSidebar } from './useVSidebar'

import type { VSidebarEmits, VSidebarProps } from './VSidebar.types'



const props = withDefaults(defineProps<VSidebarProps>(), {

  size: 'md',

  variant: 'default',

  disabled: false,

  showSearch: true,

  showBrand: true,

  showFooter: true,

  showCollapseToggle: true,

  brandName: 'VueUI Nova',

  searchPlaceholder: 'Search…',

  searchShortcut: '⌘K',

  userName: 'Alex Chen',

  userEmail: 'alex@nova.dev',

  userAvatar: 'AC',

  heading: '',

  position: '',

  locked: false,

  accordion: true,

  accordionGroups: false,

  filterOnSearch: true,
  groupChevron: 'end',
  groupChevronOpen: 'down',
  chevron: 'rotate',
  groupDividers: false,

})

const emit = defineEmits<VSidebarEmits>()

const vm = useVSidebar(props, (event, ...args) => {

  const handler = emit as (name: keyof VSidebarEmits, ...payload: unknown[]) => void

  handler(event, ...args)

})


const slots = useSlots()

// The icons-rail island animates only when re-expanding from collapsed, never on first mount.
const islandEntering = ref(false)
watch(vm.collapsed, (next, prev) => {
  if (prev && !next && props.variant === 'icons') islandEntering.value = true
})

const navRef = vm.navRef

provide(VSIDEBAR_CONTEXT, { ...vm, slots })

</script>



<template>

  <aside v-bind="vm.rootAttrs.value">

    <header
      v-if="$slots.header"
      class="v-sidebar__header-slot"
      data-test-id="v-sidebar-header"
    >
      <slot name="header" :collapsed="vm.collapsed.value" :toggle="vm.toggleCollapsed" />
    </header>

    <header
      v-else-if="showBrand"
      class="v-sidebar__brand"
      data-test-id="v-sidebar-brand"
      :role="variant === 'floating' && vm.collapsed.value ? 'button' : undefined"
      :tabindex="variant === 'floating' && vm.collapsed.value ? 0 : undefined"
      :aria-label="variant === 'floating' && vm.collapsed.value ? 'Expand sidebar' : undefined"
      @click="variant === 'floating' && vm.collapsed.value ? vm.toggleCollapsed() : undefined"
      @keydown.enter="variant === 'floating' && vm.collapsed.value ? vm.toggleCollapsed() : undefined"
    >

      <span v-if="variant === 'floating'" class="v-sidebar__brand-mark" aria-hidden="true">
        <VIcon :icon="vm.config.value.brandIconData" size="sm" />
      </span>
      <VIcon
        v-else
        :icon="vm.config.value.brandIconData"
        size="sm"
        class="v-sidebar__brand-icon"
      />

      <span v-if="variant === 'floating' || heading || position" class="v-sidebar__identity" data-test-id="v-sidebar-identity">
        <span class="v-sidebar__heading-label" data-test-id="v-sidebar-heading">{{ heading || brandName }}</span>
        <span v-if="position" class="v-sidebar__position" data-test-id="v-sidebar-position">{{ position }}</span>
      </span>
      <span v-else-if="vm.labelsVisible.value" class="v-sidebar__brand-name">{{ brandName }}</span>

      <span v-if="variant === 'floating' || (showCollapseToggle && variant !== 'icons' && !vm.collapsed.value)" class="v-sidebar__brand-actions">
        <button
          v-if="variant === 'floating'"
          type="button"
          class="v-sidebar__lock"
          data-test-id="v-sidebar-lock"
          :aria-pressed="vm.locked.value"
          :aria-label="vm.locked.value ? 'Desafixar sidebar' : 'Bloquear sidebar'"
          :disabled="vm.config.value.disabled || undefined"
          @click.stop="vm.toggleLocked()"
        >
          <VIcon :icon="SIDEBAR_UI_ICONS.panelLeft" size="sm" aria-hidden="true" />
        </button>
        <button
          v-if="showCollapseToggle || variant === 'floating'"
          type="button"
          class="v-sidebar__collapse-toggle v-sidebar__collapse-toggle--inline"
          data-test-id="v-sidebar-collapse-toggle"
          :aria-label="vm.collapsed.value ? 'Expand sidebar' : 'Collapse sidebar'"
          :aria-expanded="!vm.collapsed.value"
          :disabled="vm.config.value.disabled || undefined"
          @click.stop="vm.toggleCollapsed()"
        >
          <VIcon :icon="variant === 'floating' ? (vm.collapsed.value ? SIDEBAR_UI_ICONS.chevronDown : SIDEBAR_UI_ICONS.chevronUp) : SIDEBAR_UI_ICONS.collapse" size="sm" aria-hidden="true" />
        </button>
      </span>

    </header>



    <div
      v-if="showSearch"
      class="v-sidebar__search"
      data-test-id="v-sidebar-search"
      :class="{ 'v-sidebar__search--collapsed': !vm.labelsVisible.value }"
    >
      <label v-if="vm.labelsVisible.value" class="v-sidebar__search-field" data-test-id="v-sidebar-search-input">
        <VIcon :icon="SIDEBAR_UI_ICONS.search" size="sm" class="v-sidebar__search-icon" aria-hidden="true" />
        <input
          class="v-sidebar__search-input"
          data-test-id="v-sidebar-search-field"
          type="text"
          role="searchbox"
          autocomplete="off"
          spellcheck="false"
          :value="vm.searchQuery.value"
          :placeholder="searchPlaceholder"
          :aria-label="searchPlaceholder"
          :disabled="vm.config.value.disabled || undefined"
          @input="vm.onSearchInput"
          @keydown.esc="vm.clearSearch()"
        />
        <button
          v-if="vm.searchQuery.value"
          type="button"
          class="v-sidebar__search-clear"
          data-test-id="v-sidebar-search-clear"
          aria-label="Clear search"
          @click.prevent="vm.clearSearch()"
        >
          <VIcon :icon="SIDEBAR_UI_ICONS.close" size="sm" aria-hidden="true" />
        </button>
        <kbd v-else-if="searchShortcut" class="v-sidebar__search-kbd" data-test-id="v-sidebar-search-shortcut">{{ searchShortcut }}</kbd>
      </label>
      <button
        v-else
        type="button"
        class="v-sidebar__search-icon-button"
        data-test-id="v-sidebar-search-icon"
        :aria-label="searchPlaceholder"
        :title="searchPlaceholder"
        :disabled="vm.config.value.disabled || variant === 'icons' || undefined"
        @click="vm.setCollapsed(false)"
      >
        <VIcon :icon="SIDEBAR_UI_ICONS.search" size="sm" aria-hidden="true" />
      </button>
    </div>

    <div v-if="$slots['before-nav']" class="v-sidebar__before-nav" data-test-id="v-sidebar-before-nav">
      <slot name="before-nav" />
    </div>

    <nav
      ref="navRef"
      class="v-sidebar__nav"
      :class="{ 'v-sidebar__nav--island-enter': islandEntering }"
      data-test-id="v-sidebar-nav"
      aria-label="Main navigation"
      v-bind="vm.navAttrs.value"
      @scroll.passive="vm.onNavScroll"
      @animationend="islandEntering = false"
    >
      <ul class="v-sidebar__list" role="list">
        <VSidebarNode v-for="node in vm.visibleItems.value" :key="node.value" :node="node" />
        <li v-if="vm.showEmpty.value" class="v-sidebar__empty" role="status" data-test-id="v-sidebar-empty">
          No results
        </li>
      </ul>
    </nav>

    <div v-if="$slots['after-nav']" class="v-sidebar__after-nav" data-test-id="v-sidebar-after-nav">
      <slot name="after-nav" />
    </div>

    <button

      v-if="showCollapseToggle && (variant === 'icons' || (variant !== 'floating' && vm.collapsed.value))"

      type="button"

      class="v-sidebar__collapse-toggle"

      data-test-id="v-sidebar-collapse-toggle"

      :aria-label="vm.collapsed.value ? 'Expand sidebar' : 'Collapse sidebar'"

      :aria-expanded="!vm.collapsed.value"

      :disabled="vm.config.value.disabled || undefined"

      @click="vm.toggleCollapsed()"

    >

      <VIcon

        :icon="vm.collapsed.value ? SIDEBAR_UI_ICONS.expand : SIDEBAR_UI_ICONS.collapse"

        size="sm"

        aria-hidden="true"

      />

    </button>



    <footer v-if="showFooter" class="v-sidebar__user" data-test-id="v-sidebar-user-area">

      <slot name="footer" :collapsed="vm.collapsed.value">

        <div class="v-sidebar__user-default">

          <span class="v-sidebar__user-avatar" data-test-id="v-sidebar-user-avatar" aria-hidden="true">{{ userAvatar }}</span>

          <span v-if="vm.labelsVisible.value" class="v-sidebar__user-meta">

            <span class="v-sidebar__user-name">{{ userName }}</span>

            <span class="v-sidebar__user-email">{{ userEmail }}</span>

          </span>

          <button

            v-if="vm.labelsVisible.value"

            type="button"

            class="v-sidebar__user-menu-trigger"

            data-test-id="v-sidebar-user-menu-trigger"

            aria-label="User menu"

            :disabled="vm.config.value.disabled || undefined"

          >

            <VIcon :icon="SIDEBAR_UI_ICONS.moreHorizontal" size="sm" aria-hidden="true" />

          </button>

        </div>

      </slot>

    </footer>

  </aside>

</template>

