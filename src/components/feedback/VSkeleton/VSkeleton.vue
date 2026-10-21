<script setup lang="ts">
import './VSkeleton.scss'
import { useVSkeleton } from './useVSkeleton'
import type { VSkeletonProps } from './VSkeleton.types'

const props = withDefaults(defineProps<VSkeletonProps>(), {
  variant: 'text',
  size: 'md',
  lines: 3,
  animated: true,
  paused: false,
  disabled: false,
})

const vm = useVSkeleton(props)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <template v-if="vm.config.value.variant === 'text'">
      <span
        v-for="line in vm.lineIndices.value"
        :key="line"
        class="v-skeleton__shape v-skeleton__shape--line"
        :class="{ 'v-skeleton__shape--line-short': line === vm.config.value.lines && vm.config.value.lines > 1 }"
        data-test-id="v-skeleton-shape"
        aria-hidden="true"
      >
        <span
          v-if="vm.config.value.shimmering"
          class="v-skeleton__shimmer"
          data-test-id="v-skeleton-shimmer"
          aria-hidden="true"
        />
      </span>
    </template>

    <template v-else-if="vm.config.value.variant === 'avatar'">
      <span class="v-skeleton__shape v-skeleton__shape--avatar" data-test-id="v-skeleton-shape" aria-hidden="true">
        <span
          v-if="vm.config.value.shimmering"
          class="v-skeleton__shimmer"
          data-test-id="v-skeleton-shimmer"
          aria-hidden="true"
        />
      </span>
    </template>

    <template v-else-if="vm.config.value.variant === 'card'">
      <div class="v-skeleton__card" aria-hidden="true">
        <span class="v-skeleton__shape v-skeleton__shape--card-media" data-test-id="v-skeleton-shape">
          <span
            v-if="vm.config.value.shimmering"
            class="v-skeleton__shimmer"
            data-test-id="v-skeleton-shimmer"
            aria-hidden="true"
          />
        </span>
        <div class="v-skeleton__card-lines">
          <span
            v-for="line in 3"
            :key="line"
            class="v-skeleton__shape v-skeleton__shape--line"
            :class="{ 'v-skeleton__shape--line-short': line === 3 }"
            data-test-id="v-skeleton-shape"
          >
            <span
              v-if="vm.config.value.shimmering"
              class="v-skeleton__shimmer"
              data-test-id="v-skeleton-shimmer"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </template>

    <template v-else-if="vm.config.value.variant === 'table-row'">
      <div class="v-skeleton__table-row" aria-hidden="true">
        <span class="v-skeleton__shape v-skeleton__shape--dot" data-test-id="v-skeleton-shape">
          <span
            v-if="vm.config.value.shimmering"
            class="v-skeleton__shimmer"
            data-test-id="v-skeleton-shimmer"
            aria-hidden="true"
          />
        </span>
        <span
          class="v-skeleton__shape v-skeleton__shape--line v-skeleton__shape--line-wide"
          data-test-id="v-skeleton-shape"
        >
          <span
            v-if="vm.config.value.shimmering"
            class="v-skeleton__shimmer"
            data-test-id="v-skeleton-shimmer"
            aria-hidden="true"
          />
        </span>
        <span
          v-for="cell in 3"
          :key="cell"
          class="v-skeleton__shape v-skeleton__shape--line v-skeleton__shape--line-cell"
          data-test-id="v-skeleton-shape"
        >
          <span
            v-if="vm.config.value.shimmering"
            class="v-skeleton__shimmer"
            data-test-id="v-skeleton-shimmer"
            aria-hidden="true"
          />
        </span>
      </div>
    </template>

    <template v-else-if="vm.config.value.variant === 'chart'">
      <div class="v-skeleton__chart" aria-hidden="true">
        <span
          v-for="(height, index) in vm.chartBarHeights.value"
          :key="index"
          class="v-skeleton__shape v-skeleton__shape--bar"
          :style="{ '--v-skeleton-bar-height': height }"
          data-test-id="v-skeleton-shape"
        >
          <span
            v-if="vm.config.value.shimmering"
            class="v-skeleton__shimmer"
            data-test-id="v-skeleton-shimmer"
            aria-hidden="true"
          />
        </span>
      </div>
    </template>

    <slot />
  </div>
</template>
