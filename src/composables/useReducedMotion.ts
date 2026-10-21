import { onMounted, onUnmounted, ref } from 'vue'

export function useReducedMotion() {
  const reduced = ref(false)
  let media: MediaQueryList | null = null

  const sync = () => {
    reduced.value = media?.matches ?? false
  }

  onMounted(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    sync()
    media.addEventListener('change', sync)
  })

  onUnmounted(() => {
    media?.removeEventListener('change', sync)
  })

  return reduced
}

export function isMotionDisabled(level: 'default' | 'expressive' | 'none', reduced: boolean): boolean {
  return level === 'none' || reduced
}
