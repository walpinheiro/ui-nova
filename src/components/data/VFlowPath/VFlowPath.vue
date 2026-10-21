<script setup lang="ts">
import { computed } from 'vue'
import './VFlowPath.scss'
import botIcon from '@iconify-icons/keyline-icons/bot'
import { VIcon } from '../../primitives/VIcon'
import { mountVFlowPath } from './mountVFlowPath'
import type { VFlowPathProps } from './VFlowPath.types'

const props = withDefaults(defineProps<VFlowPathProps>(), {
  animated: true,
})

const config = computed(() => mountVFlowPath(props))
</script>

<template>
  <div class="v-flow-path" :class="{ 'v-flow-path--animated': animated }" :data-test-id="dataTestId ?? 'v-flow-path'">
    <ol class="v-flow-path__list" :aria-label="ariaLabel">
      <template v-for="segment in config.segments" :key="segment.key">
        <li v-if="segment.kind === 'node'" class="v-flow-path__node" data-test-id="v-flow-path-node">
          <slot name="node" :node="segment.node" :index="segment.index">
            <span class="v-flow-path__node-icon" aria-hidden="true">
              <VIcon :icon="segment.node.icon ?? botIcon" size="sm" />
            </span>
            <span class="v-flow-path__node-text">
              <span class="v-flow-path__node-title">{{ segment.node.title }}</span>
              <span v-if="segment.node.subtitle" class="v-flow-path__node-subtitle">{{ segment.node.subtitle }}</span>
            </span>
          </slot>
        </li>
        <li
          v-else
          class="v-flow-path__edge"
          :class="`v-flow-path__edge--${segment.edge.status}`"
          :aria-label="`${segment.edge.label ?? 'Edge'} from ${segment.from.title} to ${segment.to.title}: ${segment.edge.status}`"
          data-test-id="v-flow-path-edge"
          :data-status="segment.edge.status"
        >
          <span class="v-flow-path__line" aria-hidden="true" />
          <span v-if="segment.edge.metrics?.length || $slots.edge" class="v-flow-path__chip">
            <slot name="edge" :edge="segment.edge" :from="segment.from" :to="segment.to">
              <span v-for="metric in segment.edge.metrics" :key="metric.label" class="v-flow-path__metric">
                <span class="v-flow-path__metric-value">{{ metric.value }}</span>
                <span class="v-flow-path__metric-label">{{ metric.label }}</span>
              </span>
            </slot>
          </span>
        </li>
      </template>
    </ol>
  </div>
</template>
