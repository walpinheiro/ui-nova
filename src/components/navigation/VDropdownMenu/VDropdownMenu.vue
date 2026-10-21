<script setup lang="ts">

import './VDropdownMenu.scss'

import { VIcon } from '../../primitives/VIcon'

import { DROPDOWN_MENU_UI_ICONS } from './mountVDropdownMenu'

import { useVDropdownMenu } from './useVDropdownMenu'

import type { VDropdownMenuItem, VDropdownMenuProps } from './VDropdownMenu.types'



const props = withDefaults(defineProps<VDropdownMenuProps>(), {

  size: 'md',

  variant: 'secondary',

  disabled: false,

  loading: false,

  showTriggerIcon: true,
  showChevron: true,
})



const emit = defineEmits<{

  'update:modelValue': [value: boolean]

  'update:value': [value: string]

  'open-change': [value: boolean]

  select: [value: string]

}>()



const {

  config,

  isOpen,

  activeSubmenu,

  bindRootRef,

  bindTriggerRef,

  bindMenuRef,

  rootAttrs,

  menuPositionStyle,
  submenuPlacementClass,
  submenuPositionStyle,

  triggerAttrs,

  menuAttrs,

  itemAttrs,

  toggle,

  onTriggerKeydown,

  resolveDropdownIcon,

  menuPlacement,

} = useVDropdownMenu(props, emit)



function submenuItems(item: VDropdownMenuItem) {

  return item.children ?? []

}

</script>



<template>

  <div :ref="bindRootRef" v-bind="rootAttrs">

    <slot name="trigger">

      <button :ref="bindTriggerRef" v-bind="triggerAttrs" @click="toggle" @keydown="onTriggerKeydown">

        <VIcon

          v-if="config.showTriggerIcon && config.triggerIconData"

          :icon="config.triggerIconData"

          size="sm"

          class="v-dropdown-menu__trigger-icon"

          data-test-id="dropdown-trigger-icon"

        />

        <span v-if="config.triggerStyle !== 'icon'" class="v-dropdown-menu__label">{{ config.label }}</span>

        <span
          v-if="config.showChevron && config.triggerStyle !== 'icon'"
          class="v-dropdown-menu__chevron-wrap"
          data-test-id="dropdown-chevron"
          aria-hidden="true"
        >
          <VIcon
            :icon="DROPDOWN_MENU_UI_ICONS.chevronDown"
            size="sm"
            class="v-dropdown-menu__chevron"
            :class="{
              'v-dropdown-menu__chevron--open': isOpen,
              'v-dropdown-menu__chevron--up': menuPlacement.startsWith('top-'),
            }"
          />
        </span>

        <span

          v-if="loading"

          class="v-dropdown-menu__loader"

          data-test-id="dropdown-loader"

          aria-hidden="true"

        />

      </button>

    </slot>

    <div
      v-if="isOpen"
      :ref="bindMenuRef"
      :style="menuPositionStyle"
      v-bind="menuAttrs"
      :data-placement="menuPlacement"
    >

        <template v-if="$slots.default">

          <slot />

        </template>

        <template v-else>

          <template v-for="item in config.items" :key="item.value">

            <div

              v-if="item.divider"

              class="v-dropdown-menu__separator"

              role="separator"

              data-test-id="dropdown-separator"

            />

            <div v-else class="v-dropdown-menu__item-wrap">

              <button v-bind="itemAttrs(item, config.items)">

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

                <span class="v-dropdown-menu__item-label">{{ item.label }}</span>

                <VIcon

                  v-if="item.children?.length"

                  :icon="DROPDOWN_MENU_UI_ICONS.chevronRight"

                  size="sm"

                  class="v-dropdown-menu__submenu-chevron"

                  data-test-id="dropdown-submenu-trigger"

                  aria-hidden="true"

                />

              </button>



              <div

                v-if="item.children?.length && activeSubmenu === item.value"

                class="v-dropdown-menu__submenu"
                :class="submenuPlacementClass"
                :style="submenuPositionStyle"

                role="menu"

                data-test-id="dropdown-submenu"

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

                  <span class="v-dropdown-menu__item-label">{{ child.label }}</span>

                </button>

              </div>

            </div>

          </template>

        </template>

      </div>

  </div>

</template>


