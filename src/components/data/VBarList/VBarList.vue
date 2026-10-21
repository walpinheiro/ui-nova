<script setup lang="ts">
import './VBarList.scss'
import { useVBarList } from './useVBarList'
import type { VBarListProps } from './VBarList.types'

const props = withDefaults(defineProps<VBarListProps>(), {
  layout: 'inline',
  emphasis: 'max',
  size: 'md',
  showValue: true,
})

const vm = useVBarList(props)
</script>

<template>
  <ul v-bind="vm.rootAttrs.value">
    <li
      v-for="row in vm.config.value.rows"
      :key="row.key"
      class="v-bar-list__item"
      :class="{ 'v-bar-list__item--strong': row.strong }"
      data-test-id="v-bar-list-item"
    >
      <span class="v-bar-list__label">
        <slot name="label" :item="row">
          <span class="v-bar-list__label-text">{{ row.label }}</span>
          <span v-if="row.hint" class="v-bar-list__hint">{{ row.hint }}</span>
        </slot>
      </span>
      <span
        class="v-bar-list__track"
        role="meter"
        :aria-label="row.label"
        :aria-valuenow="row.value"
        aria-valuemin="0"
        :aria-valuemax="vm.config.value.max"
        :aria-valuetext="row.text"
      >
        <span
          class="v-bar-list__fill"
          data-test-id="v-bar-list-fill"
          :style="{ width: `${row.percent}%`, background: row.color }"
        />
      </span>
      <span v-if="showValue" class="v-bar-list__value" data-test-id="v-bar-list-value">
        <slot name="value" :item="row">{{ row.text }}</slot>
      </span>
    </li>
  </ul>
</template>
