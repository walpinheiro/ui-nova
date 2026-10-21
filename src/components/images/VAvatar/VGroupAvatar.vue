<script setup lang="ts">
import { computed } from 'vue'
import './VAvatar.scss'
import VAvatar from './VAvatar.vue'
import type { VGroupAvatarProps } from './VAvatar.types'

const props = withDefaults(defineProps<VGroupAvatarProps>(), {
  max: 3,
  size: 'md',
  shape: 'circle',
  dataTestId: 'avatar-group',
})

const visibleMembers = computed(() => props.members.slice(0, props.max))
const overflowCount = computed(() => Math.max(0, props.members.length - props.max))
</script>

<template>
  <div class="v-avatar-group" :data-test-id="props.dataTestId">
    <div
      v-for="(member, index) in visibleMembers"
      :key="`${member.alt ?? member.initials ?? index}`"
      class="v-avatar-group__item"
    >
      <VAvatar
        :src="member.src"
        :alt="member.alt"
        :initials="member.initials"
        :size="size"
        :shape="shape"
        decorative
      />
    </div>
    <span
      v-if="overflowCount > 0"
      class="v-avatar-group__overflow"
      data-test-id="avatar-group-overflow"
    >
      +{{ overflowCount }}
    </span>
  </div>
</template>
