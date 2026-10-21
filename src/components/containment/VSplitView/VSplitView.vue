<script setup lang="ts">
import { useSlots } from 'vue'
import './VSplitView.scss'
import { useVSplitView } from './useVSplitView'
import type { VSplitViewEmits, VSplitViewProps } from './VSplitView.types'

const props = withDefaults(defineProps<VSplitViewProps>(), {
  orientation: 'vertical',
  mode: 'resizable',
  defaultSize: 280,
  minSize: 200,
  maxSize: 600,
  disabled: false,
})
const emit = defineEmits<VSplitViewEmits>()
const slots = useSlots()
const namedPaneCount = Math.max(
  ['pane-1', 'pane-2', 'pane-3'].filter((name) => Boolean(slots[name])).length,
  [slots.start, slots.default, slots.end].filter(Boolean).length,
)
const fallbackPaneCount = slots.default ? 2 : 0
const vm = useVSplitView(props, emit, Math.max(namedPaneCount, fallbackPaneCount, Array.isArray(props.sizes) ? props.sizes.length : 0))
const dividerCount = () => Math.max(0, vm.config.value.paneCount - 1)
</script>

<template>
  <div v-bind="vm.rootAttrs.value" :aria-label="props.ariaLabel ?? 'Split view'">
    <div class="v-split-view__track" data-test-id="v-split-view-track" :style="vm.gridStyle.value">
      <template v-for="index in vm.config.value.paneCount" :key="`pane-${index}`">
        <section v-bind="vm.paneAttrs(index - 1)">
          <template v-if="index === 1">
            <slot v-if="slots['pane-1']" name="pane-1" />
            <slot v-else-if="slots.start" name="start" />
            <template v-else>Sidebar Pane (Navigation)</template>
          </template>
          <template v-else-if="index === 2">
            <slot v-if="slots['pane-2']" name="pane-2" />
            <slot v-else-if="slots.default" name="default" />
            <template v-else>Content Pane (Main content)</template>
          </template>
          <template v-else-if="index === 3">
            <slot v-if="slots['pane-3']" name="pane-3" />
            <slot v-else-if="slots.end" name="end" />
            <template v-else>Inspector Pane (Properties)</template>
          </template>
          <template v-else><slot :name="`pane-${index}`">Pane {{ index }}</slot></template>
        </section>
        <div
          v-if="index <= dividerCount()"
          v-bind="vm.dividerAttrs(index - 1)"
          @keydown="vm.onDividerKeydown(index - 1, $event)"
          @pointerdown="vm.startDrag(index - 1, $event)"
          @pointerup="vm.stopDrag()"
          @pointercancel="vm.stopDrag()"
          @mousedown="vm.setPressed(index - 1, true)"
          @mouseup="vm.setPressed(index - 1, false)"
          @mouseleave="vm.setPressed(index - 1, false)"
          @dblclick="vm.toggleCollapse(index - 1)"
        >
          <span
            class="v-split-view__handle"
            :data-test-id="`v-split-view-handle-${index - 1}`"
            aria-hidden="true"
          />
          <button
            v-if="vm.config.value.collapsible"
            type="button"
            class="v-split-view__collapse"
            :data-test-id="`v-split-view-collapse-${index - 1}`"
            :aria-label="vm.collapseLabel(index - 1)"
            :disabled="props.disabled || undefined"
            @pointerdown.stop
            @mousedown.stop
            @click.stop="vm.toggleCollapse(index - 1)"
          >
            <span aria-hidden="true">{{ vm.collapseGlyph(index - 1) }}</span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
