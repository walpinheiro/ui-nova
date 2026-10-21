<script setup lang="ts">
import { V_MOTION_DEFAULT } from '../../../motion/types'
import './VStatusMark.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVStatusMark } from './useVStatusMark'
import type { VStatusMarkProps } from './VStatusMark.types'

const props = withDefaults(defineProps<VStatusMarkProps>(), {
  state: 'idle',
  size: 'md',
  motion: V_MOTION_DEFAULT,
})

const vm = useVStatusMark(props)
</script>

<template>
  <span v-bind="vm.rootAttrs.value">
    <span class="v-status-mark__glyph" aria-hidden="true" data-test-id="v-status-mark-glyph">
      <span v-if="vm.config.value.spinning" class="v-status-mark__ring" />
      <VIcon :icon="vm.config.value.iconData" size="sm" />
    </span>
    <span v-if="label" class="v-status-mark__label" data-test-id="v-status-mark-label">{{ label }}</span>
  </span>
</template>
