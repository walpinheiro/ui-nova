<script setup lang="ts">
import { computed } from 'vue'
import './VActionList.scss'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import arrowUpRightIcon from '@iconify-icons/keyline-icons/arrow-up-right'
import { VIcon } from '../../primitives/VIcon'
import { mountVActionList } from './mountVActionList'
import type { VActionListEmits, VActionListItem, VActionListProps, VActionListSection } from './VActionList.types'

const props = withDefaults(defineProps<VActionListProps>(), {
  variant: 'card',
  size: 'md',
  dividers: true,
})

const emit = defineEmits<VActionListEmits>()
const config = computed(() => mountVActionList(props))

function select(item: VActionListItem, section: VActionListSection) {
  if (!item.disabled) emit('select', item, section)
}
</script>

<template>
  <nav
    class="v-action-list"
    :class="[`v-action-list--${config.variant}`, `v-action-list--${config.size}`, { 'v-action-list--dividers': dividers }]"
    :aria-label="ariaLabel"
    :data-test-id="dataTestId ?? 'v-action-list'"
  >
    <section
      v-for="section in config.sections"
      :key="section.id"
      class="v-action-list__section"
      :aria-label="section.label"
      data-test-id="v-action-list-section"
    >
      <header v-if="section.label || section.actionIcon" class="v-action-list__section-header">
        <span class="v-action-list__section-label">{{ section.label }}</span>
        <button
          v-if="section.actionIcon"
          type="button"
          class="v-action-list__section-action"
          :aria-label="section.actionLabel ?? `${section.label} options`"
          @click="emit('section-action', section.id)"
        >
          <VIcon :icon="section.actionIcon" size="sm" />
        </button>
      </header>

      <ul v-if="section.items.length" class="v-action-list__items">
        <li v-for="item in section.items" :key="item.value">
          <component
            :is="item.href ? 'a' : 'button'"
            :type="item.href ? undefined : 'button'"
            :href="item.disabled ? undefined : item.href"
            :target="item.href ? '_blank' : undefined"
            :rel="item.href ? 'noopener noreferrer' : undefined"
            class="v-action-list__item"
            :class="{ 'is-active': item.active, 'is-disabled': item.disabled }"
            :aria-disabled="item.disabled || undefined"
            :aria-current="item.active ? 'true' : undefined"
            :disabled="item.href ? undefined : item.disabled"
            data-test-id="v-action-list-item"
            :data-value="item.value"
            @click="select(item, section)"
          >
            <span v-if="item.icon" class="v-action-list__icon" aria-hidden="true">
              <VIcon :icon="item.icon" size="sm" />
            </span>
            <span class="v-action-list__label">
              <slot name="label" :item="item">{{ item.label }}</slot>
            </span>
            <span v-if="$slots[`trailing-${item.value}`] || item.hint" class="v-action-list__hint">
              <slot :name="`trailing-${item.value}`" :item="item">{{ item.hint }}</slot>
            </span>
            <VIcon
              v-if="item.trailing !== 'none'"
              class="v-action-list__trailing"
              :icon="item.trailing === 'external' ? arrowUpRightIcon : chevronDownIcon"
              size="sm"
              aria-hidden="true"
            />
          </component>
        </li>
      </ul>

      <div v-if="$slots[`section-${section.id}`]" class="v-action-list__content">
        <slot :name="`section-${section.id}`" :section="section" />
      </div>
    </section>
  </nav>
</template>
