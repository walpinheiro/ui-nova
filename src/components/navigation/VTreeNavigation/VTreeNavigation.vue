<script setup lang="ts">
import './VTreeNavigation.scss'
import { VIcon } from '../../primitives/VIcon'
import { TREE_NAVIGATION_UI_ICONS } from './mountVTreeNavigation'
import { useVTreeNavigation } from './useVTreeNavigation'
import type { VTreeNavigationProps } from './VTreeNavigation.types'

const props = withDefaults(defineProps<VTreeNavigationProps>(), {
  size: 'md',
  variant: 'file',
  disabled: false,
  loading: false,
  multiple: false,
  showCounts: true,
  iconField: 'icon',
  lazy: false,
})

const emit = defineEmits<{
  'update:active': [value: string | string[]]
  'update:expandedKeys': [value: string[]]
  select: [value: string | string[]]
}>()

const vm = useVTreeNavigation(props, emit)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <span
      v-if="loading"
      class="v-tree-navigation__loader"
      data-test-id="tree-navigation-loader"
      aria-hidden="true"
    />
    <div
      v-for="(flat, index) in vm.flatNodes.value"
      :key="flat.item.key"
      :ref="(el) => vm.registerNodeRef(flat.item.key, el as HTMLElement | null)"
      v-bind="vm.nodeAttrs(flat)"
      @click="vm.onNodeClick(flat)"
      @keydown="vm.onNodeKeydown($event, index)"
    >
      <button
        v-bind="vm.toggleAttrs(flat)"
        :class="{ 'v-tree-navigation__toggle--placeholder': !flat.hasChildren }"
        @click="vm.onToggleClick($event, flat)"
      >
        <VIcon
          v-if="flat.hasChildren"
          :icon="flat.isExpanded ? TREE_NAVIGATION_UI_ICONS.chevronDown : TREE_NAVIGATION_UI_ICONS.chevronRight"
          size="sm"
          class="v-tree-navigation__chevron"
          aria-hidden="true"
        />
      </button>
      <VIcon
        :icon="vm.getIconData(flat.item)"
        size="sm"
        class="v-tree-navigation__icon"
        data-test-id="tree-node-icon"
      />
      <span class="v-tree-navigation__label" data-test-id="tree-node-label">
        {{ flat.item.label }}
      </span>
      <span
        v-if="vm.getCount(flat.item) !== undefined"
        class="v-tree-navigation__count"
        data-test-id="tree-node-count"
      >
        {{ vm.getCount(flat.item) }}
      </span>
      <span
        v-if="vm.isNodeLoading(flat.item.key)"
        class="v-tree-navigation__node-loader"
        data-test-id="tree-node-loader"
        aria-hidden="true"
      />
    </div>
    <div
      v-if="!vm.flatNodes.value.length"
      class="v-tree-navigation__empty"
      data-test-id="tree-navigation-empty"
    >
      <slot>No items</slot>
    </div>
  </div>
</template>
