<script setup lang="ts">
import './VDrawer.scss'
import { computed } from 'vue'
import { VIcon } from '../../primitives/VIcon'
import xIcon from '@iconify-icons/keyline-icons/x'
import VSheet from '../../containment/VSheet/VSheet.vue'
import type { VSheetSide } from '../../containment/VSheet/VSheet.types'
import type { VDrawerEmits, VDrawerProps } from './VDrawer.types'

const props = withDefaults(defineProps<VDrawerProps>(), {
  modelValue: undefined,
  open: undefined,
  title: undefined,
  placement: 'right',
  size: 'md',
  showClose: true,
  dismissible: true,
  disabled: false,
  loading: false,
  closeLabel: 'Close drawer',
  ariaLabel: undefined,
  ariaDescribedby: undefined,
})
const emit = defineEmits<VDrawerEmits>()

const side = computed((): VSheetSide => (props.placement ?? props.side ?? 'right') as VSheetSide)
const sheetSize = computed(() => (props.size ?? props.width ?? 'md') as 'sm' | 'md' | 'lg')

const isOpen = computed({
  get: () => Boolean(props.modelValue ?? props.open ?? false),
  set: (value: boolean) => {
    emit('update:modelValue', value)
    emit('update:open', value)
    emit('open-change', value)
  },
})

const drawerTestIds = {
  root: 'v-drawer',
  backdrop: 'drawer-overlay',
  panel: 'drawer-container',
  header: 'drawer-header',
  title: 'drawer-title',
  content: 'drawer-content',
  footer: 'drawer-footer',
  close: 'drawer-close-button',
  divider: 'drawer-divider',
  prepend: 'drawer-tabs',
} as const
</script>

<template>
  <VSheet
    v-model:open="isOpen"
    :side="side"
    :size="sheetSize"
    :title="title"
    :show-close="showClose"
    :close-label="closeLabel"
    :dismissible="dismissible"
    :disabled="disabled"
    :loading="loading"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedby"
    :root-class="`v-drawer v-drawer--${side} v-drawer--${sheetSize}`"
    surface-class="v-drawer__container"
    :test-ids="drawerTestIds"
    :root-data-attrs="{ 'data-placement': side, 'data-size': sheetSize }"
    @close="emit('close')"
    @dismiss="emit('dismiss')"
  >
    <template v-if="$slots.tabs" #prepend>
      <div class="v-drawer__tabs">
        <slot name="tabs" />
      </div>
    </template>
    <template v-if="$slots.actions" #actions>
      <span class="v-drawer__actions">
        <slot name="actions" />
      </span>
    </template>
    <template v-if="showClose" #close>
      <VIcon :icon="xIcon" size="sm" />
    </template>
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </VSheet>
</template>
