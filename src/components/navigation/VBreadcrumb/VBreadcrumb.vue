<script setup lang="ts">
import './VBreadcrumb.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVBreadcrumb } from './useVBreadcrumb'
import type { VBreadcrumbProps } from './VBreadcrumb.types'

const props = withDefaults(defineProps<VBreadcrumbProps>(), {
  size: 'md',
  variant: 'default',
  maxItems: 4,
})
const emit = defineEmits<{
  navigate: [payload: { item: { label: string; href?: string; originalIndex: number }; index: number }]
}>()
const vm = useVBreadcrumb(props, (event, payload) => emit(event, payload))
</script>

<template>
  <nav v-bind="vm.rootAttrs.value">
    <ol class="v-breadcrumb__list" data-test-id="v-breadcrumb-list">
      <template v-for="(segment, index) in vm.segments.value" :key="vm.segmentKey(segment, index)">
        <li
          v-if="index > 0"
          class="v-breadcrumb__separator"
          data-test-id="v-breadcrumb-separator"
          aria-hidden="true"
        >
          <slot name="separator">
            <span class="v-breadcrumb__separator-icon">›</span>
          </slot>
        </li>

        <li
          v-if="segment.type === 'item'"
          class="v-breadcrumb__item"
          :data-test-id="`v-breadcrumb-item-${segment.item.originalIndex}`"
        >
          <span
            v-if="segment.item.isCurrent"
            class="v-breadcrumb__current"
            aria-current="page"
            data-test-id="v-breadcrumb-current"
            :title="segment.item.label"
          >
            <VIcon
              v-if="segment.item.homeIconData"
              :icon="segment.item.homeIconData"
              size="sm"
              class="v-breadcrumb__home-icon"
              data-test-id="v-breadcrumb-home-icon"
            />
            <VIcon
              v-if="segment.item.iconData"
              :icon="segment.item.iconData"
              size="sm"
              class="v-breadcrumb__icon"
            />
            <span class="v-breadcrumb__label">{{ segment.item.label }}</span>
          </span>
          <a
            v-else
            class="v-breadcrumb__link"
            :href="segment.item.href"
            data-test-id="v-breadcrumb-link"
            :aria-disabled="segment.item.disabled || undefined"
            :tabindex="segment.item.disabled ? -1 : undefined"
            :title="segment.item.label"
            @click="vm.onNavigate($event, segment.item)"
          >
            <VIcon
              v-if="segment.item.homeIconData"
              :icon="segment.item.homeIconData"
              size="sm"
              class="v-breadcrumb__home-icon"
              data-test-id="v-breadcrumb-home-icon"
            />
            <VIcon
              v-if="segment.item.iconData"
              :icon="segment.item.iconData"
              size="sm"
              class="v-breadcrumb__icon"
            />
            <span class="v-breadcrumb__label">{{ segment.item.label }}</span>
          </a>
        </li>

        <li
          v-else
          class="v-breadcrumb__item v-breadcrumb__item--overflow"
          :data-test-id="`v-breadcrumb-item-overflow`"
        >
          <button
            type="button"
            class="v-breadcrumb__overflow"
            data-test-id="v-breadcrumb-overflow"
            :aria-expanded="vm.overflowOpen.value"
            aria-haspopup="menu"
            @click="vm.toggleOverflow()"
            @keydown="vm.onOverflowKeydown($event)"
          >
            …
          </button>
          <ul
            v-if="vm.overflowOpen.value"
            class="v-breadcrumb__overflow-menu"
            role="menu"
            data-test-id="v-breadcrumb-overflow-menu"
          >
            <li
              v-for="item in segment.items"
              :key="item.originalIndex"
              role="none"
            >
              <a
                class="v-breadcrumb__overflow-link"
                role="menuitem"
                :href="item.href"
                :data-test-id="`v-breadcrumb-overflow-item-${item.originalIndex}`"
                :aria-disabled="item.disabled || undefined"
                :title="item.label"
                @click="vm.onOverflowNavigate($event, item)"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </li>
      </template>
    </ol>
  </nav>
</template>
