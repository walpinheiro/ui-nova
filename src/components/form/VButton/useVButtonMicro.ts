import { computed, onBeforeUnmount, ref } from 'vue'
import type { VButtonProps } from './VButton.types'

type ButtonEmit = {
  (event: 'click', payload: MouseEvent): void
  (event: 'undo'): void
  (event: 'confirmed'): void
}

export function useVButtonMicro(props: VButtonProps, emit: ButtonEmit) {
  const fuseActive = ref(false)
  const fuseProgress = ref(100)
  const holdProgress = ref(0)
  const holding = ref(false)
  const favorited = ref(false)
  const favoritePop = ref(false)
  let fuseTimer: ReturnType<typeof setInterval> | null = null
  let holdFrame: ReturnType<typeof requestAnimationFrame> | null = null
  let holdStart = 0

  const isExpressive = computed(() => props.motion === 'expressive')
  const isFuse = computed(() => isExpressive.value && props.microInteraction === 'fuse' && (props.undoWindow ?? 0) > 0)
  const isHold = computed(() => isExpressive.value && props.microInteraction === 'hold' && (props.holdDuration ?? 0) > 0)
  const isFavorite = computed(() => isExpressive.value && props.microInteraction === 'favorite')

  const microClass = computed(() => ({
    'v-button--micro-fuse': isFuse.value && fuseActive.value,
    'v-button--micro-hold': isHold.value && holding.value,
    'v-button--micro-holding': holding.value,
    'v-button--micro-favorite': isFavorite.value,
    'v-button--micro-favorite-on': isFavorite.value && favorited.value,
    'v-button--micro-favorite-pop': favoritePop.value,
  }))

  const fuseStyle = computed(() => ({
    '--v-button-fuse-progress': `${fuseProgress.value}%`,
  }))

  const holdStyle = computed(() => ({
    '--v-button-hold-progress': `${holdProgress.value}%`,
  }))

  const clearFuse = () => {
    if (fuseTimer) clearInterval(fuseTimer)
    fuseTimer = null
  }

  const clearHold = () => {
    if (holdFrame) cancelAnimationFrame(holdFrame)
    holdFrame = null
    holding.value = false
    holdProgress.value = 0
  }

  const startFuse = () => {
    if (!isFuse.value) return
    fuseActive.value = true
    fuseProgress.value = 100
    const windowMs = props.undoWindow ?? 5000
    const started = performance.now()
    clearFuse()
    fuseTimer = setInterval(() => {
      const elapsed = performance.now() - started
      fuseProgress.value = Math.max(0, 100 - (elapsed / windowMs) * 100)
      if (elapsed >= windowMs) {
        clearFuse()
        fuseActive.value = false
      }
    }, 50)
  }

  const onFuseUndo = (event: MouseEvent) => {
    if (!fuseActive.value) return
    event.stopPropagation()
    clearFuse()
    fuseActive.value = false
    emit('undo')
  }

  const onHoldPointerDown = (event: PointerEvent) => {
    if (!isHold.value || event.button !== 0) return
    holding.value = true
    holdStart = performance.now()
    const duration = props.holdDuration ?? 1500
    const tick = () => {
      if (!holding.value) return
      const elapsed = performance.now() - holdStart
      holdProgress.value = Math.min(100, (elapsed / duration) * 100)
      if (elapsed >= duration) {
        clearHold()
        emit('confirmed')
        return
      }
      holdFrame = requestAnimationFrame(tick)
    }
    holdFrame = requestAnimationFrame(tick)
  }

  const onHoldPointerUp = () => {
    if (!holding.value) return
    clearHold()
  }

  const onFavoriteClick = (event: MouseEvent) => {
    if (!isFavorite.value) return
    favorited.value = !favorited.value
    favoritePop.value = true
    setTimeout(() => {
      favoritePop.value = false
    }, 300)
    emit('click', event)
  }

  onBeforeUnmount(() => {
    clearFuse()
    clearHold()
  })

  return {
    isFuse,
    isHold,
    isFavorite,
    holding,
    fuseActive,
    microClass,
    fuseStyle,
    holdStyle,
    favorited,
    favoriteCount: computed(() => props.favoriteCount),
    startFuse,
    onFuseUndo,
    onHoldPointerDown,
    onHoldPointerUp,
    onFavoriteClick,
  }
}
