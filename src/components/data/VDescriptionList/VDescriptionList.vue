<script setup lang="ts">
import './VDescriptionList.scss'
import { useVDescriptionList } from './useVDescriptionList'
import type { VDescriptionListProps } from './VDescriptionList.types'

const props = withDefaults(defineProps<VDescriptionListProps>(), {
  layout: 'inline',
  size: 'md',
  dividers: false,
  columns: 2,
})

const vm = useVDescriptionList(props)
</script>

<template>
  <dl v-bind="vm.rootAttrs.value">
    <div v-for="row in vm.config.value.rows" :key="row.key" class="v-description-list__row" data-test-id="v-description-list-row">
      <dt class="v-description-list__label">{{ row.label }}</dt>
      <dd v-if="row.hint" class="v-description-list__hint">{{ row.hint }}</dd>
      <dd class="v-description-list__value">
        <slot :name="`value-${row.key}`" :item="row">
          <slot name="value" :item="row">{{ row.value }}</slot>
        </slot>
      </dd>
    </div>
    <div v-if="total" class="v-description-list__row v-description-list__row--total" data-test-id="v-description-list-total">
      <dt class="v-description-list__label">{{ total.label }}</dt>
      <dd class="v-description-list__value">{{ total.value }}</dd>
    </div>
  </dl>
</template>
