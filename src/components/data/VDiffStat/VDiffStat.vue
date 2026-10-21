<script setup lang="ts">
import { computed } from 'vue'
import './VDiffStat.scss'
import { mountVDiffStat } from './mountVDiffStat'
import type { VDiffStatProps } from './VDiffStat.types'

const props = withDefaults(defineProps<VDiffStatProps>(), {
  additions: 0,
  deletions: 0,
  size: 'md',
  blocks: false,
  blockCount: 5,
})

const config = computed(() => mountVDiffStat(props))
</script>

<template>
  <span
    class="v-diff-stat"
    :class="`v-diff-stat--${config.size}`"
    role="img"
    :aria-label="config.label"
    :data-test-id="dataTestId ?? 'v-diff-stat'"
  >
    <span class="v-diff-stat__add" aria-hidden="true" data-test-id="v-diff-stat-add">{{ config.additionsText }}</span>
    <span class="v-diff-stat__del" aria-hidden="true" data-test-id="v-diff-stat-del">{{ config.deletionsText }}</span>
    <span v-if="config.blocks.length" class="v-diff-stat__blocks" aria-hidden="true">
      <span v-for="(block, index) in config.blocks" :key="index" class="v-diff-stat__block" :class="`v-diff-stat__block--${block}`" />
    </span>
  </span>
</template>
