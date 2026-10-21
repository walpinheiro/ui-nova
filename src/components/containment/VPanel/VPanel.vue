<script setup lang="ts">
import './VPanel.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVPanel } from './useVPanel'
import type { VPanelProps } from './VPanel.types'

const props = withDefaults(defineProps<VPanelProps>(), {
  open: undefined,
  modelValue: undefined,
  size: 'md',
  variant: 'default',
  headingLevel: '3',
  interactive: false,
})
const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: boolean]
  click: [event: MouseEvent | KeyboardEvent]
}>()
const vm = useVPanel(props, emit)
</script>

<template>
  <Transition name="v-panel">
    <section
      v-if="vm.isOpen.value"
      v-bind="vm.rootAttrs.value"
      @click="vm.onActivate($event)"
      @keydown="vm.onKeydown"
    >
      <header
        v-if="title || $slots.header || $slots.actions || icon || $slots.icon"
        class="v-panel__header"
        data-test-id="v-panel-header"
      >
        <span
          v-if="icon || $slots.icon"
          class="v-panel__icon"
          data-test-id="v-panel-icon"
          aria-hidden="true"
        >
          <slot v-if="$slots.icon" name="icon" />
          <VIcon v-else-if="vm.iconData.value" :icon="vm.iconData.value" size="md" />
        </span>
        <span class="v-panel__titles">
          <component
            :is="`h${vm.headingLevel.value}`"
            v-if="title"
            :id="vm.headingId"
            class="v-panel__title"
            data-test-id="v-panel-title"
          >
            {{ title }}
          </component>
          <component
            :is="`h${vm.headingLevel.value}`"
            v-else-if="$slots.title"
            :id="vm.headingId"
            class="v-panel__title"
            data-test-id="v-panel-title"
          >
            <slot name="title" />
          </component>
          <p v-if="description" class="v-panel__description" data-test-id="v-panel-description">
            {{ description }}
          </p>
          <p v-else-if="$slots.description" class="v-panel__description" data-test-id="v-panel-description">
            <slot name="description" />
          </p>
        </span>
        <span v-if="$slots.header || $slots.actions" class="v-panel__actions" data-test-id="v-panel-actions">
          <slot name="header" />
          <slot name="actions" />
        </span>
      </header>
      <div class="v-panel__content" data-test-id="v-panel-content">
        <slot />
      </div>
      <footer v-if="$slots.footer" class="v-panel__footer" data-test-id="v-panel-footer">
        <slot name="footer" />
      </footer>
    </section>
  </Transition>
</template>
