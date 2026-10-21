<script setup lang="ts">
import { VIcon } from '../../primitives/VIcon'
import { MASONRY_UI_ICONS } from './mountVMasonryGrid'
import { useVMasonryItem } from './useVMasonryItem'
import type { VMasonryItemProps } from './VMasonryGrid.types'

const props = withDefaults(defineProps<VMasonryItemProps>(), {
  interactive: true,
  selected: false,
})

const emit = defineEmits<{ click: [event: MouseEvent | KeyboardEvent]; select: [selected: boolean] }>()
const vm = useVMasonryItem(props)

function onActivate(event: MouseEvent | KeyboardEvent) {
  if (props.interactive === false) return
  emit('click', event)
  emit('select', !props.selected)
}

function onKeydown(event: KeyboardEvent) {
  if (props.interactive === false) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onActivate(event)
  }
}
</script>

<template>
  <article
    v-bind="vm.rootAttrs.value"
    :class="{ 'masonry-tile-selected': selected }"
    @click="onActivate($event)"
    @keydown="onKeydown"
  >
    <span v-if="selected" class="v-masonry-grid__selected-badge" data-test-id="masonry-tile-selected">
      <VIcon :icon="MASONRY_UI_ICONS.check" size="sm" />
    </span>
    <div v-if="$slots.media || $slots.default" class="v-masonry-grid__media" data-test-id="masonry-tile-media">
      <slot name="media" />
    </div>
    <div class="v-masonry-grid__content">
      <h3 v-if="title" class="v-masonry-grid__title" data-test-id="masonry-tile-title">{{ title }}</h3>
      <p v-if="category" class="v-masonry-grid__category" data-test-id="masonry-tile-meta">{{ category }}</p>
      <div v-if="likes !== undefined || $slots.meta" class="v-masonry-grid__meta">
        <slot name="meta">
          <span class="v-masonry-grid__like" data-test-id="masonry-like">
            <VIcon :icon="MASONRY_UI_ICONS.heart" size="sm" />
            <span data-test-id="masonry-like-count">{{ likes }}</span>
          </span>
        </slot>
      </div>
      <slot />
    </div>
  </article>
</template>
