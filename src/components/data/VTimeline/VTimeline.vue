<script setup lang="ts">
import './VTimeline.scss'
import checkIcon from '@iconify-icons/keyline-icons/check'
import clockIcon from '@iconify-icons/keyline-icons/clock'
import xIcon from '@iconify-icons/keyline-icons/x'
import { VIcon } from '../../primitives/VIcon'
import { VAvatar } from '../../images/VAvatar'
import { useVTimeline } from './useVTimeline'
import type { VTimelineItemState, VTimelineProps } from './VTimeline.types'

const props = withDefaults(defineProps<VTimelineProps>(), {
  variant: 'steps',
  size: 'md',
})

const vm = useVTimeline(props)

const STATE_ICONS = { complete: checkIcon, current: clockIcon, error: xIcon, upcoming: undefined }
const STATE_LABELS: Record<VTimelineItemState, string> = {
  complete: 'Completed',
  current: 'In progress',
  upcoming: 'Upcoming',
  error: 'Failed',
}
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <section v-for="section in vm.config.value.sections" :key="section.key" class="v-timeline__section">
      <h4 v-if="section.label" class="v-timeline__group" data-test-id="v-timeline-group">{{ section.label }}</h4>
      <ol class="v-timeline__list">
        <li
          v-for="item in section.items"
          :key="item.id"
          class="v-timeline__item"
          :class="[`v-timeline__item--${item.state}`, { 'v-timeline__item--last': item.last }]"
          :aria-current="item.state === 'current' ? 'step' : undefined"
          data-test-id="v-timeline-item"
          :data-state="item.state"
        >
          <span class="v-timeline__marker" aria-hidden="true">
            <slot name="marker" :item="item">
              <VAvatar
                v-if="vm.config.value.variant === 'feed'"
                size="xs"
                :src="item.avatar?.src"
                :initials="item.avatar?.initials"
                decorative
              />
              <VIcon v-else-if="item.icon ?? STATE_ICONS[item.state]" :icon="item.icon ?? STATE_ICONS[item.state]" size="sm" />
            </slot>
          </span>
          <div class="v-timeline__content">
            <p class="v-timeline__title">
              <span v-if="vm.config.value.variant === 'steps'" class="v-timeline__sr">{{ STATE_LABELS[item.state] }}: </span>
              <slot name="title" :item="item">{{ item.title }}</slot>
            </p>
            <p v-if="item.description || $slots.description" class="v-timeline__description">
              <slot name="description" :item="item">{{ item.description }}</slot>
            </p>
            <slot name="extra" :item="item" />
          </div>
          <span v-if="item.time" class="v-timeline__time" data-test-id="v-timeline-time">{{ item.time }}</span>
        </li>
      </ol>
    </section>
  </div>
</template>
