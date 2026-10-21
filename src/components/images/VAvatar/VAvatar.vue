<script setup lang="ts">
import './VAvatar.scss'
import { VIcon } from '../../primitives/VIcon'
import { V_AVATAR_CHECK_ICON, V_AVATAR_CROWN_ICON, V_AVATAR_USER_ICON } from './mountVAvatar'
import { useVAvatar } from './useVAvatar'
import type { VAvatarProps } from './VAvatar.types'

const props = withDefaults(defineProps<VAvatarProps>(), {
  size: 'md',
  shape: 'circle',
  selectable: false,
  loading: false,
  decorative: false,
})

const emit = defineEmits<{
  click: [MouseEvent]
  select: [MouseEvent]
  'update:selected': [boolean]
}>()

const {
  config,
  selected,
  imageFailed,
  rootAttrs,
  handleClick,
  handleKeydown,
  onImageError,
} = useVAvatar(props, emit)
</script>

<template>
  <button
    v-if="config.interactive"
    type="button"
    v-bind="(rootAttrs as Record<string, unknown>)"
    :class="{ 'v-avatar--selected': selected || props.badge === 'selected' || props.badge === 'check' }"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span
      class="v-avatar__container"
      :class="{ 'v-avatar__container--square': config.shape === 'square' }"
      :data-test-id="config.sizeTestId"
    >
      <img
        v-if="props.src && !imageFailed && !props.loading"
        class="v-avatar__image"
        data-test-id="avatar-image"
        :src="props.src"
        :alt="props.decorative ? '' : props.alt"
        @error="onImageError"
      />

      <span
        v-else-if="props.initials && !props.loading"
        class="v-avatar__initials"
        data-test-id="avatar-initials"
        aria-hidden="true"
      >
        {{ props.initials }}
      </span>

      <span
        v-else-if="!props.loading"
        class="v-avatar__icon"
        data-test-id="avatar-icon"
        aria-hidden="true"
      >
        <VIcon :icon="V_AVATAR_USER_ICON" size="sm" />
      </span>

      <span
        v-if="props.loading"
        class="v-avatar__loader"
        data-test-id="avatar-state-loading"
        aria-hidden="true"
      />

      <span
        v-if="selected && !props.badge"
        class="v-avatar__selected-mark"
        data-test-id="avatar-state-selected"
        aria-hidden="true"
      >
        <VIcon :icon="V_AVATAR_CHECK_ICON" size="sm" />
      </span>
    </span>

    <span
      v-if="props.status"
      class="v-avatar__status"
      :class="[
        `v-avatar__status--${props.status}`,
        { 'v-avatar__status--sm': config.smallIndicators },
      ]"
      :data-test-id="config.statusTestId ?? 'avatar-status'"
      :aria-hidden="props.decorative ? 'true' : undefined"
    />

    <span
      v-if="props.badge"
      class="v-avatar__badge"
      :class="{ 'v-avatar__badge--sm': config.smallIndicators }"
      data-test-id="avatar-badge"
      aria-hidden="true"
    >
      <VIcon
        :icon="props.badge === 'pro' ? V_AVATAR_CROWN_ICON : V_AVATAR_CHECK_ICON"
        size="sm"
      />
    </span>
  </button>
  <div
    v-else
    v-bind="(rootAttrs as Record<string, unknown>)"
    :class="{ 'v-avatar--selected': selected || props.badge === 'selected' || props.badge === 'check' }"
  >
    <span
      class="v-avatar__container"
      :class="{ 'v-avatar__container--square': config.shape === 'square' }"
      :data-test-id="config.sizeTestId"
    >
      <img
        v-if="props.src && !imageFailed && !props.loading"
        class="v-avatar__image"
        data-test-id="avatar-image"
        :src="props.src"
        :alt="props.decorative ? '' : props.alt"
        @error="onImageError"
      />

      <span
        v-else-if="props.initials && !props.loading"
        class="v-avatar__initials"
        data-test-id="avatar-initials"
        aria-hidden="true"
      >
        {{ props.initials }}
      </span>

      <span
        v-else-if="!props.loading"
        class="v-avatar__icon"
        data-test-id="avatar-icon"
        aria-hidden="true"
      >
        <VIcon :icon="V_AVATAR_USER_ICON" size="sm" />
      </span>

      <span
        v-if="props.loading"
        class="v-avatar__loader"
        data-test-id="avatar-state-loading"
        aria-hidden="true"
      />

      <span
        v-if="selected && !props.badge"
        class="v-avatar__selected-mark"
        data-test-id="avatar-state-selected"
        aria-hidden="true"
      >
        <VIcon :icon="V_AVATAR_CHECK_ICON" size="sm" />
      </span>
    </span>

    <span
      v-if="props.status"
      class="v-avatar__status"
      :class="[
        `v-avatar__status--${props.status}`,
        { 'v-avatar__status--sm': config.smallIndicators },
      ]"
      :data-test-id="config.statusTestId ?? 'avatar-status'"
      :aria-hidden="props.decorative ? 'true' : undefined"
    />

    <span
      v-if="props.badge"
      class="v-avatar__badge"
      :class="{ 'v-avatar__badge--sm': config.smallIndicators }"
      data-test-id="avatar-badge"
      aria-hidden="true"
    >
      <VIcon
        :icon="props.badge === 'pro' ? V_AVATAR_CROWN_ICON : V_AVATAR_CHECK_ICON"
        size="sm"
      />
    </span>
  </div>
</template>
