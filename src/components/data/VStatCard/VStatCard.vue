<script setup lang="ts">
import './VStatCard.scss'
import trendingUpIcon from '@iconify-icons/keyline-icons/trending-up'
import trendingDownIcon from '@iconify-icons/keyline-icons/trending-down'
import { VIcon } from '../../primitives/VIcon'
import { useVStatCard } from './useVStatCard'
import type { VStatCardProps } from './VStatCard.types'

const props = withDefaults(defineProps<VStatCardProps>(), {
  size: 'md',
  variant: 'outlined',
  loading: false,
})

const vm = useVStatCard(props)
</script>

<template>
  <section v-bind="vm.rootAttrs.value">
    <header v-if="label || icon || $slots.label || $slots['header-trailing']" class="v-stat-card__header">
      <span v-if="icon" class="v-stat-card__icon" aria-hidden="true">
        <VIcon :icon="icon" size="sm" />
      </span>
      <span class="v-stat-card__label" data-test-id="v-stat-card-label">
        <slot name="label">{{ label }}</slot>
      </span>
      <span v-if="$slots['header-trailing']" class="v-stat-card__header-trailing">
        <slot name="header-trailing" />
      </span>
    </header>

    <div class="v-stat-card__body">
      <span v-if="loading" class="v-stat-card__skeleton" aria-hidden="true" />
      <div v-else class="v-stat-card__value-row">
        <span class="v-stat-card__value" data-test-id="v-stat-card-value">
          <slot name="value">{{ value }}</slot>
        </span>
        <slot name="value-trailing" />
      </div>

      <p v-if="vm.config.value.hasDelta || deltaCaption" class="v-stat-card__delta-row">
        <span
          v-if="vm.config.value.hasDelta"
          class="v-stat-card__delta"
          :class="`v-stat-card__delta--${vm.config.value.trend}`"
          :data-trend="vm.config.value.trend"
          data-test-id="v-stat-card-delta"
        >
          <VIcon
            v-if="vm.config.value.trend !== 'neutral'"
            :icon="vm.config.value.trend === 'up' ? trendingUpIcon : trendingDownIcon"
            size="sm"
          />
          <span v-if="vm.config.value.trend !== 'neutral'" class="v-stat-card__sr">{{ vm.config.value.trend }}</span>
          {{ vm.config.value.deltaText }}
        </span>
        <span v-if="deltaCaption" class="v-stat-card__delta-caption">{{ deltaCaption }}</span>
      </p>

      <p v-if="caption" class="v-stat-card__caption" data-test-id="v-stat-card-caption">{{ caption }}</p>
    </div>

    <slot />

    <dl v-if="vm.config.value.stats.length" class="v-stat-card__stats" data-test-id="v-stat-card-stats">
      <div v-for="stat in vm.config.value.stats" :key="stat.label" class="v-stat-card__stat">
        <dt class="v-stat-card__stat-label">
          <span v-if="stat.color" class="v-stat-card__stat-dot" :style="{ background: stat.color }" aria-hidden="true" />
          {{ stat.label }}
        </dt>
        <dd class="v-stat-card__stat-value">
          {{ stat.value }}
          <span v-if="stat.caption" class="v-stat-card__stat-caption">{{ stat.caption }}</span>
        </dd>
      </div>
    </dl>

    <footer v-if="$slots.footer" class="v-stat-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
