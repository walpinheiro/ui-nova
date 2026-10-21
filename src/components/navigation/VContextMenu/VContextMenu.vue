<script setup lang="ts">
import './VContextMenu.scss'

import { VIcon } from '../../primitives/VIcon'

import { CONTEXT_MENU_UI_ICONS } from './mountVContextMenu'
import { useVContextMenu } from './useVContextMenu'
import type { VContextMenuItem, VContextMenuProps } from './VContextMenu.types'

const props = withDefaults(defineProps<VContextMenuProps>(), {
  size: 'md',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:x': [value: number]
  'update:y': [value: number]
  'open-change': [value: boolean]
  select: [value: string]
}>()

const {
  config,
  isOpen,
  activeSubmenu,
  bindRootRef,
  bindMenuRef,
  rootAttrs,
  menuAttrs,
  itemAttrs,
  menuPositionStyle,
  resolveContextMenuIcon,
} = useVContextMenu(props, emit)

function submenuItems(item: VContextMenuItem) {
  return item.children ?? []
}
</script>

<template>
  <div :ref="bindRootRef" v-bind="rootAttrs">
    <span
      v-if="loading"
      class="v-context-menu__loader"
      data-test-id="context-menu-loader"
      aria-hidden="true"
    />
    <slot />
  </div>

  <Teleport to="body">
    <div
      v-if="isOpen"
      :ref="bindMenuRef"
      :style="menuPositionStyle"
      v-bind="menuAttrs"
    >
      <template v-if="$slots.menu">
        <slot name="menu" />
      </template>
      <template v-else>
        <template v-for="item in config.items" :key="item.value">
          <div
            v-if="item.divider"
            class="v-context-menu__separator"
            role="separator"
            data-test-id="context-menu-separator"
          />
          <div v-else class="v-context-menu__item-wrap">
            <button v-bind="itemAttrs(item, config.items)">
              <VIcon
                v-if="item.selected"
                :icon="CONTEXT_MENU_UI_ICONS.check"
                size="sm"
                class="v-context-menu__check"
                aria-hidden="true"
              />
              <VIcon
                v-if="item.icon && resolveContextMenuIcon(item.icon)"
                :icon="resolveContextMenuIcon(item.icon)"
                size="sm"
                class="v-context-menu__item-icon"
              />
              <span class="v-context-menu__item-label">{{ item.label }}</span>
              <VIcon
                v-if="item.children?.length"
                :icon="CONTEXT_MENU_UI_ICONS.chevronRight"
                size="sm"
                class="v-context-menu__submenu-chevron"
                data-test-id="context-menu-submenu-trigger"
                aria-hidden="true"
              />
            </button>

            <div
              v-if="item.children?.length && activeSubmenu === item.value"
              class="v-context-menu__submenu"
              role="menu"
              data-test-id="context-menu-submenu"
            >
              <button
                v-for="child in submenuItems(item)"
                :key="child.value"
                v-bind="itemAttrs(child, submenuItems(item))"
              >
                <VIcon
                  v-if="child.selected"
                  :icon="CONTEXT_MENU_UI_ICONS.check"
                  size="sm"
                  class="v-context-menu__check"
                  aria-hidden="true"
                />
                <VIcon
                  v-if="child.icon && resolveContextMenuIcon(child.icon)"
                  :icon="resolveContextMenuIcon(child.icon)"
                  size="sm"
                  class="v-context-menu__item-icon"
                />
                <span class="v-context-menu__item-label">{{ child.label }}</span>
              </button>
            </div>
          </div>
        </template>
      </template>
    </div>
  </Teleport>
</template>
