<script setup lang="ts">
import { V_MOTION_DEFAULT } from '../../../motion/types'
import { VIcon } from '../../primitives/VIcon'
import { VTag } from '../../primitives/VTag'
import './VCard.scss'
import { V_CARD_SELECTED_ICON } from './mountVCard'
import { useVCard } from './useVCard'
import type { VCardProps } from './VCard.types'

const props = withDefaults(defineProps<VCardProps>(), {
  size: 'md',
  variant: 'elevated',
  loading: false,
  interactive: false,
  selected: false,
  mediaPlacement: 'top',
  motion: V_MOTION_DEFAULT,
})
const emit = defineEmits<{ click: [event: MouseEvent | KeyboardEvent] }>()
const vm = useVCard(props, (event, payload) => {
  if (event === 'click') emit('click', payload as MouseEvent & KeyboardEvent)
})
</script>

<template>
  <article
    v-bind="vm.rootAttrs.value"
    :class="{
      'v-card--has-media':
        !!$slots.media || !!$slots['media-overlay'] || loading || vm.config.value.showRefineFrame,
    }"
    @click="vm.onActivate($event)"
    @keydown="vm.onKeydown($event)"
  >
    <div v-if="vm.isFlippable.value" class="v-card__flip" data-test-id="v-card-flip">
      <div class="v-card__face v-card__face--front">
        <div class="v-card__main">
          <slot name="front">
            <div
              v-if="$slots.media || $slots['media-overlay'] || loading || vm.config.value.showRefineFrame"
              class="v-card__media"
              data-test-id="v-card-media"
            >
              <slot v-if="!loading && !vm.config.value.showRefineFrame" name="media" />
              <div
                v-if="vm.config.value.showRefineFrame"
                class="v-card__refine-frame"
                data-test-id="v-card-refine-frame"
              >
                <slot name="refine-media" />
                <span
                  v-if="vm.config.value.refineFrameActive"
                  class="v-card__refine-sweep"
                  aria-hidden="true"
                  data-test-id="v-card-refine-sweep"
                />
                <span class="v-card__refine-chip" data-test-id="v-card-refine-chip">
                  {{ vm.config.value.refineFrameLabel }}
                </span>
              </div>
              <span
                v-if="loading"
                class="v-card__skeleton v-card__skeleton--media"
                data-test-id="v-card-skeleton"
                aria-hidden="true"
              />
              <div
                v-if="$slots['media-overlay'] && !loading"
                class="v-card__media-overlay"
                data-test-id="v-card-media-overlay"
              >
                <slot name="media-overlay" />
              </div>
            </div>
            <div v-if="badge || $slots.badge" class="v-card__badge" data-test-id="v-card-badge">
              <slot name="badge">
                <VTag size="sm" variant="overlay" :interactive="false">{{ badge }}</VTag>
              </slot>
            </div>
            <span
              v-if="vm.config.value.selected && !(badge || $slots.badge)"
              class="v-card__selected-check"
              data-test-id="v-card-selected-check"
              aria-hidden="true"
            >
              <VIcon :icon="V_CARD_SELECTED_ICON" size="sm" />
            </span>
            <div class="v-card__content" v-if="loading || $slots.icon || title || $slots.title || $slots['header-trailing'] || description || $slots.description || $slots.default" data-test-id="v-card-content">
              <template v-if="loading">
                <span class="v-card__skeleton v-card__skeleton--title" data-test-id="v-card-skeleton-title" aria-hidden="true" />
                <span class="v-card__skeleton v-card__skeleton--description" data-test-id="v-card-skeleton-description" aria-hidden="true" />
              </template>
              <template v-else>
                <span v-if="$slots.icon" class="v-card__icon" data-test-id="v-card-icon"><slot name="icon" /></span>
                <div
                  v-if="title || $slots.title || $slots['header-trailing']"
                  class="v-card__heading"
                  data-test-id="v-card-heading"
                >
                  <span v-if="title || $slots.title" class="v-card__title" data-test-id="v-card-title"><template v-if="title">{{ title }}</template><slot v-else name="title" /></span>
                  <span
                    v-if="$slots['header-trailing']"
                    class="v-card__header-trailing"
                    data-test-id="v-card-header-trailing"
                  >
                    <slot name="header-trailing" />
                  </span>
                </div>
                <span v-if="description || $slots.description" class="v-card__description" data-test-id="v-card-description"><template v-if="description">{{ description }}</template><slot v-else name="description" /></span>
                <slot />
              </template>
            </div>
          </slot>
        </div>
      </div>
      <div class="v-card__face v-card__face--back">
        <slot name="back" />
      </div>
    </div>

    <template v-else>
      <div class="v-card__main">
        <div
          v-if="$slots.media || $slots['media-overlay'] || loading || vm.config.value.showRefineFrame"
          class="v-card__media"
          data-test-id="v-card-media"
        >
          <slot v-if="!loading && !vm.config.value.showRefineFrame" name="media" />
          <div
            v-if="vm.config.value.showRefineFrame"
            class="v-card__refine-frame"
            data-test-id="v-card-refine-frame"
          >
            <slot name="refine-media" />
            <span
              v-if="vm.config.value.refineFrameActive"
              class="v-card__refine-sweep"
              aria-hidden="true"
              data-test-id="v-card-refine-sweep"
            />
            <span
              class="v-card__refine-chip"
              data-test-id="v-card-refine-chip"
            >
              {{ vm.config.value.refineFrameLabel }}
            </span>
          </div>
          <span v-if="loading" class="v-card__skeleton v-card__skeleton--media" data-test-id="v-card-skeleton" aria-hidden="true" />
          <div
            v-if="$slots['media-overlay'] && !loading"
            class="v-card__media-overlay"
            data-test-id="v-card-media-overlay"
          >
            <slot name="media-overlay" />
          </div>
        </div>
        <div v-if="badge || $slots.badge" class="v-card__badge" data-test-id="v-card-badge">
          <slot name="badge">
            <VTag size="sm" variant="overlay" :interactive="false">{{ badge }}</VTag>
          </slot>
        </div>
        <span
          v-if="vm.config.value.selected && !(badge || $slots.badge)"
          class="v-card__selected-check"
          data-test-id="v-card-selected-check"
          aria-hidden="true"
        >
          <VIcon :icon="V_CARD_SELECTED_ICON" size="sm" />
        </span>
        <div class="v-card__content" v-if="loading || $slots.icon || title || $slots.title || $slots['header-trailing'] || description || $slots.description || $slots.default" data-test-id="v-card-content">
          <template v-if="loading">
            <span class="v-card__skeleton v-card__skeleton--title" data-test-id="v-card-skeleton-title" aria-hidden="true" />
            <span class="v-card__skeleton v-card__skeleton--description" data-test-id="v-card-skeleton-description" aria-hidden="true" />
          </template>
          <template v-else>
            <span v-if="$slots.icon" class="v-card__icon" data-test-id="v-card-icon"><slot name="icon" /></span>
            <div
              v-if="title || $slots.title || $slots['header-trailing']"
              class="v-card__heading"
              data-test-id="v-card-heading"
            >
              <span v-if="title || $slots.title" class="v-card__title" data-test-id="v-card-title"><template v-if="title">{{ title }}</template><slot v-else name="title" /></span>
              <span
                v-if="$slots['header-trailing']"
                class="v-card__header-trailing"
                data-test-id="v-card-header-trailing"
              >
                <slot name="header-trailing" />
              </span>
            </div>
            <span v-if="description || $slots.description" class="v-card__description" data-test-id="v-card-description"><template v-if="description">{{ description }}</template><slot v-else name="description" /></span>
            <slot />
          </template>
        </div>
      </div>
    </template>
    <div v-if="!loading && ($slots['avatar-group'] || $slots.actions || $slots.footer)" class="v-card__footer" data-test-id="v-card-footer">
      <span v-if="$slots['avatar-group']" class="v-card__avatars" data-test-id="v-card-avatar-group"><slot name="avatar-group" /></span>
      <span v-if="$slots.actions" class="v-card__actions" data-test-id="v-card-actions"><slot name="actions" /></span>
      <slot name="footer" />
    </div>
    <div
      v-if="!loading && $slots.caption"
      class="v-card__caption"
      data-test-id="v-card-caption"
    >
      <slot name="caption" />
    </div>
  </article>
</template>
