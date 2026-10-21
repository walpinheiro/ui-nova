<script setup lang="ts">
import './VTopBar.scss'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useVTopBar } from './useVTopBar'
import type { VTopBarEmits, VTopBarProps } from './VTopBar.types'

const props = withDefaults(defineProps<VTopBarProps>(), {
  size: 'md',
  variant: 'default',
  disabled: false,
  loading: false,
  bordered: true,
  sticky: false,
  items: () => [],
})

const emit = defineEmits<VTopBarEmits>()
const vm = useVTopBar(props, emit)

const navRef = ref<HTMLElement | null>(null)
const overflowStart = ref(false)
const overflowEnd = ref(false)
let resizeObserver: ResizeObserver | null = null

function updateOverflow() {
  const el = navRef.value
  if (!el) return
  overflowStart.value = el.scrollLeft > 1
  overflowEnd.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

function revealActive() {
  const el = navRef.value
  const active = el?.querySelector<HTMLElement>('[aria-current="page"]')
  if (!el || !active) return
  const box = el.getBoundingClientRect()
  const pill = active.getBoundingClientRect()
  const pad = 24
  if (pill.left < box.left + pad) el.scrollLeft += pill.left - box.left - pad
  else if (pill.right > box.right - pad) el.scrollLeft += pill.right - box.right + pad
  updateOverflow()
}

onMounted(() => {
  revealActive()
  updateOverflow()
  if (typeof ResizeObserver !== 'undefined' && navRef.value) {
    let first = true
    resizeObserver = new ResizeObserver(() => {
      if (first) { first = false; revealActive() }
      updateOverflow()
    })
    resizeObserver.observe(navRef.value)
  }
})
onBeforeUnmount(() => resizeObserver?.disconnect())
watch(
  () => vm.activeItem.value,
  () => nextTick(revealActive),
)
</script>

<template>
  <header v-bind="vm.rootAttrs.value">
    <span
      v-if="loading"
      class="v-top-bar__loader"
      data-test-id="v-top-bar-loader"
      aria-hidden="true"
    />

    <div
      v-if="vm.hasLeading.value || $slots.leading"
      class="v-top-bar__leading"
      data-test-id="v-top-bar-leading"
    >
      <slot name="leading" />
    </div>

    <div class="v-top-bar__content" data-test-id="v-top-bar-content">
      <nav
        v-if="vm.config.value.items.length"
        ref="navRef"
        class="v-top-bar__nav"
        :data-overflow-start="overflowStart || undefined"
        :data-overflow-end="overflowEnd || undefined"
        @scroll.passive="updateOverflow"
        data-test-id="v-top-bar-nav"
        aria-label="Primary"
      >
        <button
          v-for="item in vm.config.value.items"
          :key="item.value"
          type="button"
          class="v-top-bar__nav-item"
          :class="{ 'v-top-bar__nav-item--active': vm.activeItem.value === item.value }"
          :aria-current="vm.activeItem.value === item.value ? 'page' : undefined"
          :data-test-id="`v-top-bar-nav-item-${item.value}`"
          :disabled="vm.config.value.disabled || undefined"
          @click="vm.selectNav(item.value)"
        >
          {{ item.label }}
        </button>
      </nav>
      <slot>
        <h1
          v-if="title"
          class="v-top-bar__title"
          data-test-id="v-top-bar-title"
        >
          {{ title }}
        </h1>
      </slot>
    </div>

    <div
      v-if="vm.hasActions.value || $slots.actions"
      class="v-top-bar__actions"
      data-test-id="v-top-bar-actions"
    >
      <slot name="actions" />
    </div>
  </header>
</template>
