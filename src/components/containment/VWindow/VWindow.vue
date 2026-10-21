<script setup lang="ts">
import './VWindow.scss'
import { VIcon } from '../../primitives/VIcon'
import appWindowIcon from '@iconify-icons/keyline-icons/app-window-2'
import { useVWindow } from './useVWindow'
import type { VWindowEmits, VWindowProps } from './VWindow.types'

const props = withDefaults(defineProps<VWindowProps>(), {
  size: 'md',
  variant: 'default',
  active: undefined,
  disabled: false,
  loading: false,
  resizable: false,
  showActions: true,
  showTrafficLights: undefined,
  showAppIcon: undefined,
  showMinimize: undefined,
  showSidebar: undefined,
  modelValue: undefined,
  open: undefined,
})
const emit = defineEmits<VWindowEmits>()
const vm = useVWindow(props, emit as never)

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (props.resizable && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault()
    vm.onResizeKey(event.key)
    return
  }
  vm.onRootKeydown(event)
}
</script>

<template>
  <div
    v-if="vm.config.value.variant === 'modal' && vm.config.value.open"
    v-bind="vm.backdropAttrs.value"
    @click="vm.onBackdropClick()"
  />
  <section
    :ref="(el) => { vm.rootEl.value = el as unknown as HTMLElement | null }"
    v-bind="vm.rootAttrs.value"
    :style="vm.windowStyle.value"
    @keydown="onKeydown"
  >
    <header
      class="v-window__titlebar"
      data-test-id="v-window-titlebar"
      @pointerdown="vm.onTitlebarPointerDown($event)"
      @pointermove="vm.onTitlebarPointerMove($event)"
      @pointerup="vm.onTitlebarPointerUp()"
    >
      <span
        v-if="vm.config.value.showTrafficLights"
        class="v-window__traffic"
        data-test-id="v-window-traffic-lights"
        aria-hidden="true"
      >
        <span class="v-window__light v-window__light--close" />
        <span class="v-window__light v-window__light--minimize" />
        <span class="v-window__light v-window__light--maximize" />
      </span>
      <span
        v-if="vm.config.value.showAppIcon"
        class="v-window__icon"
        data-test-id="v-window-app-icon"
        aria-hidden="true"
      >
        <slot name="icon">
          <VIcon :icon="appWindowIcon" size="sm" class="v-window__glyph" />
        </slot>
      </span>
      <span class="v-window__title" data-test-id="v-window-title">
        <slot name="title">{{ vm.config.value.title || 'Window' }}</slot>
      </span>
      <span v-if="vm.config.value.showActions" class="v-window__actions" data-test-id="v-window-actions">
        <button
          v-if="vm.config.value.showMinimize"
          type="button"
          class="v-window__action"
          data-test-id="v-window-minimize"
          aria-label="Minimize window"
          :disabled="props.disabled"
          @click="vm.onAction('minimize')"
        >
          <span aria-hidden="true">–</span>
        </button>
        <button
          type="button"
          class="v-window__action"
          data-test-id="v-window-maximize"
          aria-label="Maximize window"
          :disabled="props.disabled"
          @click="vm.onAction('maximize')"
        >
          <span aria-hidden="true">▢</span>
        </button>
        <button
          type="button"
          class="v-window__action v-window__action--close"
          data-test-id="v-window-close"
          aria-label="Close window"
          :disabled="props.disabled"
          @click="vm.onAction('close')"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </span>
    </header>
    <div class="v-window__main">
      <nav
        v-if="vm.config.value.showSidebar"
        class="v-window__sidebar"
        data-test-id="v-window-sidebar"
        aria-label="Window sections"
      >
        <slot name="sidebar">
          <button
            v-for="item in vm.navItems"
            :key="item"
            type="button"
            class="v-window__nav"
            :data-test-id="`v-window-nav-${item}`"
            :disabled="props.disabled"
          >
            {{ item }}
          </button>
        </slot>
      </nav>
      <div class="v-window__body" data-test-id="v-window-content">
        <span
          v-if="props.loading"
          class="v-window__loader"
          data-test-id="v-window-loader"
          aria-hidden="true"
        />
        <slot>Window</slot>
      </div>
    </div>
    <button
      v-if="vm.config.value.resizable"
      type="button"
      class="v-window__resize"
      data-test-id="v-window-resize-handle"
      aria-label="Resize window"
      :disabled="props.disabled"
      @click="vm.onResize"
      @pointerdown="vm.onResizePointerDown($event)"
      @pointermove="vm.onResizePointerMove($event)"
      @pointerup="vm.onResizePointerUp()"
    >
      <span aria-hidden="true">⤡</span>
    </button>
  </section>
</template>
