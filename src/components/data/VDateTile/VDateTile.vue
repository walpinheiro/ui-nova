<script setup lang="ts">
import { computed } from 'vue'
import './VDateTile.scss'
import { mountVDateTile } from './mountVDateTile'
import type { VDateTileProps } from './VDateTile.types'

const props = withDefaults(defineProps<VDateTileProps>(), {
  size: 'md',
  tone: 'neutral',
})

const config = computed(() => mountVDateTile(props))
</script>

<template>
  <time
    class="v-date-tile"
    :class="[`v-date-tile--${config.size}`, `v-date-tile--${config.tone}`]"
    :datetime="config.datetime"
    :aria-label="config.label"
    :data-test-id="dataTestId ?? 'v-date-tile'"
  >
    <span class="v-date-tile__month" aria-hidden="true" data-test-id="v-date-tile-month">{{ config.month }}</span>
    <span class="v-date-tile__day" aria-hidden="true" data-test-id="v-date-tile-day">{{ config.day }}</span>
  </time>
</template>
