<script setup lang="ts">
import { VIcon } from '../../primitives/VIcon'
import { V_ACCORDION_CHEVRON_DOWN, V_ACCORDION_CHEVRON_RIGHT } from './mountVAccordion'
import { useVAccordionItem } from './useVAccordionItem'
import type { VAccordionItemProps } from './VAccordion.types'

const props = withDefaults(defineProps<VAccordionItemProps>(), {})
const vm = useVAccordionItem(props)
</script>

<template>
  <div v-bind="vm.itemAttrs.value">
    <button
      :ref="vm.triggerRef"
      v-bind="vm.triggerAttrs.value"
      @click="vm.toggle"
      @keydown="vm.onKeydown"
    >
      <span
        v-if="vm.config.value.variant === 'leading-icon' && $slots.icon"
        class="v-accordion__leading-icon"
        data-test-id="accordion-leading-icon"
        aria-hidden="true"
      >
        <slot name="icon" />
      </span>
      <span
        v-else
        class="v-accordion__leading-indicator"
        data-test-id="accordion-leading-indicator"
        aria-hidden="true"
      >
        <VIcon
          :icon="vm.isOpen.value ? V_ACCORDION_CHEVRON_DOWN : V_ACCORDION_CHEVRON_RIGHT"
          size="sm"
          class="v-accordion__chevron-icon v-accordion__chevron-icon--leading"
        />
      </span>
      <span class="v-accordion__title" data-test-id="accordion-title">
        <slot name="title">{{ props.title ?? 'Section title' }}</slot>
      </span>
      <span
        class="v-accordion__indicator"
        data-test-id="accordion-indicator"
        aria-hidden="true"
      >
        <VIcon
          :icon="V_ACCORDION_CHEVRON_DOWN"
          size="sm"
          :class="[
            'v-accordion__chevron-icon',
            'v-accordion__chevron-icon--indicator',
            { 'v-accordion__chevron-icon--expanded': vm.isOpen.value },
          ]"
        />
      </span>
    </button>

    <div v-bind="vm.panelWrapAttrs.value">
      <div class="v-accordion__panel-clip">
        <section v-bind="vm.panelAttrs.value">
          <div class="v-accordion__content" data-test-id="accordion-content">
            <slot />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
