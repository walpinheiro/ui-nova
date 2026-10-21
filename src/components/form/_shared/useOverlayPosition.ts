import { computed, nextTick, onBeforeUnmount, ref, type CSSProperties, type Ref } from 'vue'
import {
  computeDropdownMenuPosition,
  type DropdownMenuPlacement,
} from '../../navigation/VDropdownMenu/positionDropdownMenu'

export function useOverlayPosition(
  triggerRef: Ref<HTMLElement | null>,
  panelRef: Ref<HTMLElement | null>,
  open: Ref<boolean>,
  preferredAlign: 'start' | 'end' = 'start',
  gap = 8,
  estimatePanelHeight = 320,
) {
  const placement = ref<DropdownMenuPlacement>('bottom-start')

  const positionStyle = computed((): CSSProperties => ({}))

  const updatePosition = async () => {
    await nextTick()
    const trigger = triggerRef.value
    if (!trigger) return

    const triggerRect = trigger.getBoundingClientRect()
    let panelRect = panelRef.value?.getBoundingClientRect()
    if (!panelRect || panelRect.width === 0 || panelRect.height === 0) {
      panelRect = new DOMRect(0, 0, triggerRect.width, estimatePanelHeight)
    }

    const result = computeDropdownMenuPosition(triggerRect, panelRect, preferredAlign, gap)
    placement.value = result.placement
  }

  const onViewportChange = () => {
    if (open.value) void updatePosition()
  }

  const bindListeners = () => {
    window.addEventListener('resize', onViewportChange)
  }

  const unbindListeners = () => {
    window.removeEventListener('resize', onViewportChange)
  }

  onBeforeUnmount(unbindListeners)

  return {
    placement,
    positionStyle,
    updatePosition,
    bindListeners,
    unbindListeners,
  }
}
