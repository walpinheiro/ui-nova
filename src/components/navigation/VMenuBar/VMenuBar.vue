<script setup lang="ts">
import './VMenuBar.scss'
import '../VDropdownMenu/VDropdownMenu.scss'

import { VIcon } from '../../primitives/VIcon'
import { DROPDOWN_MENU_UI_ICONS, resolveDropdownIcon } from '../VDropdownMenu/mountVDropdownMenu'
import { useVMenuBar } from './useVMenuBar'
import type { VMenuBarItem, VMenuBarProps } from './VMenuBar.types'

const props = withDefaults(defineProps<VMenuBarProps>(), {
  size: 'md',
  variant: 'default',
  disabled: false,
  loading: false,
  openOnHover: false,
  hoverDelay: 150,
})

const emit = defineEmits<{
  select: [value: string]
  'open-change': [value: string | null]
}>()

const {
  config,
  openMenu,
  activeSubmenu,
  bindMenuRef,
  bindTriggerRef,
  rootAttrs,
  triggerAttrs,
  menuAttrs,
  itemAttrs,
  menuPositionStyle,
  menuPlacement,
  onBarKeydown,
} = useVMenuBar(props, emit)

function submenuItems(item: VMenuBarItem) {
  return item.children ?? []
}
</script>

<template>
  <div v-bind="rootAttrs" @keydown="onBarKeydown">
    <span
      v-if="loading"
      class="v-menu-bar__loader"
      data-test-id="menu-bar-loader"
      aria-hidden="true"
    />

    <slot>
      <button
        v-for="menu in config.items"
        :key="menu.value"
        :ref="(el) => bindTriggerRef(menu.value, el)"
        v-bind="triggerAttrs(menu)"
      >
        <span class="v-menu-bar__trigger-label">{{ menu.label }}</span>
      </button>
    </slot>

    <Teleport to="body">
      <div
        v-if="openMenu"
        :ref="bindMenuRef"
        :style="menuPositionStyle"
        v-bind="menuAttrs"
        :data-placement="menuPlacement"
      >
        <template v-for="item in openMenu.children" :key="item.value">
          <div
            v-if="item.divider"
            class="v-dropdown-menu__separator"
            role="separator"
            data-test-id="menu-bar-separator"
          />

          <div v-else class="v-dropdown-menu__item-wrap">
            <button v-bind="itemAttrs(item, openMenu.children)">
              <VIcon
                v-if="item.selected"
                :icon="DROPDOWN_MENU_UI_ICONS.check"
                size="sm"
                class="v-dropdown-menu__check"
                aria-hidden="true"
              />

              <VIcon
                v-if="item.icon && resolveDropdownIcon(item.icon)"
                :icon="resolveDropdownIcon(item.icon)"
                size="sm"
                class="v-dropdown-menu__item-icon"
              />

              <span class="v-dropdown-menu__item-label v-menu-bar__item-label">{{ item.label }}</span>

              <kbd
                v-if="item.shortcut"
                class="v-menu-bar__shortcut"
                data-test-id="menu-bar-shortcut"
              >
                {{ item.shortcut }}
              </kbd>

              <VIcon
                v-if="item.children?.length"
                :icon="DROPDOWN_MENU_UI_ICONS.chevronRight"
                size="sm"
                class="v-dropdown-menu__submenu-chevron"
                data-test-id="menu-bar-submenu-trigger"
                aria-hidden="true"
              />
            </button>

            <div
              v-if="item.children?.length && activeSubmenu === item.value"
              class="v-dropdown-menu__submenu"
              role="menu"
              data-test-id="menu-bar-submenu"
            >
              <button
                v-for="child in submenuItems(item)"
                :key="child.value"
                v-bind="itemAttrs(child, submenuItems(item))"
              >
                <VIcon
                  v-if="child.selected"
                  :icon="DROPDOWN_MENU_UI_ICONS.check"
                  size="sm"
                  class="v-dropdown-menu__check"
                  aria-hidden="true"
                />

                <VIcon
                  v-if="child.icon && resolveDropdownIcon(child.icon)"
                  :icon="resolveDropdownIcon(child.icon)"
                  size="sm"
                  class="v-dropdown-menu__item-icon"
                />

                <span class="v-dropdown-menu__item-label v-menu-bar__item-label">{{ child.label }}</span>

                <kbd
                  v-if="child.shortcut"
                  class="v-menu-bar__shortcut"
                  data-test-id="menu-bar-shortcut"
                >
                  {{ child.shortcut }}
                </kbd>
              </button>
            </div>
          </div>
        </template>
      </div>
    </Teleport>
  </div>
</template>
