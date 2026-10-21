<script setup lang="ts">
import './VBottomUtilityBar.scss'
import { useVBottomUtilityBar } from './useVBottomUtilityBar'
import type { VBottomUtilityBarProps } from './VBottomUtilityBar.types'

const props = withDefaults(defineProps<VBottomUtilityBarProps>(), {
  size: 'md',
  variant: 'default',
  disabled: false,
  loading: false,
  fixed: true,
  safeArea: true,
  bordered: true,
})

const vm = useVBottomUtilityBar(props)
</script>

<template>
  <footer v-bind="vm.rootAttrs.value">
    <span
      v-if="loading"
      class="v-bottom-utility-bar__loader"
      data-test-id="v-bottom-utility-bar-loader"
      aria-hidden="true"
    />

    <div
      v-if="vm.hasStatus.value || $slots.status"
      class="v-bottom-utility-bar__status"
      data-test-id="v-bottom-utility-bar-status"
    >
      <slot name="status" />
    </div>

    <div class="v-bottom-utility-bar__content" data-test-id="v-bottom-utility-bar-content">
      <slot />
    </div>

    <div
      v-if="vm.hasActions.value || $slots.actions"
      class="v-bottom-utility-bar__actions"
      data-test-id="v-bottom-utility-bar-actions"
    >
      <slot name="actions" />
    </div>
  </footer>
</template>
