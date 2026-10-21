<script setup lang="ts">
import './VToast.scss'
import VToast from './VToast.vue'
import type { VToastPlacement } from './VToast.types'
import { useVToastQueue } from './useVToast'

const props = withDefaults(
  defineProps<{
    placement?: VToastPlacement
  }>(),
  { placement: 'top-right' },
)

const queue = useVToastQueue()

defineExpose({
  items: queue.items,
  push: queue.push,
  remove: queue.remove,
  clear: queue.clear,
})
</script>

<template>
  <Teleport to="body">
    <div
      class="v-toast-stack"
      :class="`v-toast-stack--${placement}`"
      data-test-id="v-toast-stack"
      :data-placement="placement"
    >
      <VToast
        v-for="item in queue.items.value"
        :key="item.id"
        :message="item.message"
        :variant="item.variant"
        :size="item.size"
        :duration="item.duration"
        :closable="item.closable"
        :show-progress="item.showProgress"
        @close="queue.remove(item.id)"
      />
    </div>
  </Teleport>
</template>
