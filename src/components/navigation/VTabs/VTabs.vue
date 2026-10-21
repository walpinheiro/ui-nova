<script setup lang="ts">
import './VTabs.scss'
import { ref, watch } from 'vue'
import { VIcon } from '../../primitives/VIcon'
import { useVTabs } from './useVTabs'
import type { VTabsProps } from './VTabs.types'

const props = withDefaults(defineProps<VTabsProps>(), {
  size: 'md',
  variant: 'underline',
  disabled: false,
  dividers: false,
  panels: true,
})
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const vm = useVTabs(props, (event, value) => emit(event as 'update:modelValue', value))

// Navigation direction (next = to the right / later tab) drives panel motion.
const direction = ref<'next' | 'prev'>('next')
watch(
  () => vm.config.value.selected,
  (value, oldValue) => {
    const items = vm.config.value.items
    const from = items.findIndex((item) => item.value === oldValue)
    const to = items.findIndex((item) => item.value === value)
    if (from !== -1 && to !== -1) direction.value = to >= from ? 'next' : 'prev'
  },
  { flush: 'sync' },
)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <div class="v-tabs__bar">
      <div class="v-tabs__scroller">
        <div
          v-if="vm.hasOverflow.value"
          class="v-tabs__fade"
          aria-hidden="true"
        />
        <div
          :ref="(el) => { vm.listRef.value = el as HTMLElement | null }"
          class="v-tabs__list"
          role="tablist"
          :aria-label="ariaLabel"
          data-test-id="v-tabs-list"
        >
          <span
            class="v-tabs__indicator"
            data-test-id="v-tabs-indicator"
            :style="vm.indicatorStyle.value"
            aria-hidden="true"
          />
          <template
            v-for="(item, index) in vm.config.value.items"
            :key="item.value"
          >
            <button
              type="button"
              role="tab"
              class="v-tabs__tab"
              :class="{ 'v-tabs__tab--active': item.value === vm.config.value.selected }"
              :aria-selected="item.value === vm.config.value.selected"
              :aria-disabled="item.disabled || vm.config.value.disabled || undefined"
              :aria-controls="panels ? `v-tabs-panel-${item.value}` : undefined"
              :id="`v-tabs-trigger-${item.value}`"
              :tabindex="item.value === vm.config.value.selected ? 0 : -1"
              :disabled="item.disabled || vm.config.value.disabled || undefined"
              :data-test-id="`v-tabs-tab-${item.value}`"
              @click="vm.select(item.value, item.disabled)"
              @keydown="vm.onKeydown($event, index)"
            >
              <VIcon
                v-if="vm.config.value.showIcons && item.iconData"
                :icon="item.iconData"
                size="sm"
                class="v-tabs__icon"
              />
              <span class="v-tabs__label">{{ item.label }}</span>
            </button>
            <span
              v-if="vm.config.value.dividers && index < vm.config.value.items.length - 1"
              class="v-tabs__divider"
              aria-hidden="true"
            />
          </template>
        </div>
      </div>
      <div
        v-if="vm.hasOverflow.value"
        class="v-tabs__overflow-wrap"
      >
        <button
          type="button"
          class="v-tabs__overflow"
          data-test-id="v-tabs-overflow"
          aria-label="More tabs"
          aria-haspopup="menu"
          :aria-expanded="vm.overflowOpen.value"
          @click="vm.toggleOverflow()"
        >
          …
        </button>
        <div
          v-if="vm.overflowOpen.value"
          class="v-tabs__overflow-menu"
          role="menu"
          data-test-id="v-tabs-overflow-menu"
          aria-label="Overflow tabs"
        >
          <button
            v-for="item in vm.config.value.items"
            :key="`overflow-${item.value}`"
            type="button"
            role="menuitem"
            class="v-tabs__overflow-item"
            :data-test-id="`v-tabs-overflow-item-${item.value}`"
            :disabled="item.disabled || vm.config.value.disabled || undefined"
            :aria-selected="item.value === vm.config.value.selected"
            @click="vm.select(item.value, item.disabled)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
      <div v-if="$slots.actions" class="v-tabs__actions" data-test-id="v-tabs-actions">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="panels" class="v-tabs__panels" :data-direction="direction">
    <Transition name="v-tabs-slide">
      <div
        :key="vm.config.value.selected"
        class="v-tabs__panel"
        role="tabpanel"
        :id="`v-tabs-panel-${vm.config.value.selected}`"
        :aria-labelledby="`v-tabs-trigger-${vm.config.value.selected}`"
        tabindex="0"
        :data-test-id="`v-tabs-panel-${vm.config.value.selected}`"
      >
        <slot>{{ vm.config.value.selected }}</slot>
      </div>
    </Transition>
    </div>
  </div>
</template>
