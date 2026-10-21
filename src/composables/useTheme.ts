import { computed, getCurrentInstance, onUnmounted, ref, type ComputedRef, type Ref } from 'vue'

export type VTheme = 'light' | 'dark' | 'system'

export interface UseThemeOptions {
  /** Elemento que recebe `data-theme` (default: document.documentElement). */
  target?: HTMLElement | (() => HTMLElement | null)
  /** Chave do localStorage; `false` desativa a persistência. Default: 'v-theme'. */
  storageKey?: string | false
  /** Tema inicial quando nada está salvo. Default: 'system'. */
  default?: VTheme
}

export interface UseThemeReturn {
  theme: Ref<VTheme>
  resolvedTheme: ComputedRef<'light' | 'dark'>
  setTheme: (t: VTheme) => void
  toggleTheme: () => void
}

const isTheme = (v: unknown): v is VTheme => v === 'light' || v === 'dark' || v === 'system'

export function useTheme(options: UseThemeOptions = {}): UseThemeReturn {
  const storageKey = options.storageKey === undefined ? 'v-theme' : options.storageKey
  const hasWindow = typeof window !== 'undefined'

  let initial: VTheme = options.default ?? 'system'
  if (hasWindow && storageKey) {
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (isTheme(saved)) initial = saved
    } catch {
      /* storage indisponível */
    }
  }

  const theme = ref<VTheme>(initial)
  const systemDark = ref(false)

  let media: MediaQueryList | null = null
  const onMedia = (e: MediaQueryListEvent) => {
    systemDark.value = e.matches
  }
  if (hasWindow && typeof window.matchMedia === 'function') {
    media = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = media.matches
    media.addEventListener?.('change', onMedia)
  }

  const resolvedTheme = computed<'light' | 'dark'>(() =>
    theme.value === 'system' ? (systemDark.value ? 'dark' : 'light') : theme.value,
  )

  const getTarget = (): HTMLElement | null => {
    if (typeof document === 'undefined') return null
    const t = options.target
    if (typeof t === 'function') return t()
    return t ?? document.documentElement
  }

  const apply = () => {
    getTarget()?.setAttribute('data-theme', theme.value)
  }

  const setTheme = (t: VTheme) => {
    theme.value = t
    apply()
    if (hasWindow && storageKey) {
      try {
        window.localStorage.setItem(storageKey, t)
      } catch {
        /* ignore */
      }
    }
  }

  const toggleTheme = () => setTheme(resolvedTheme.value === 'dark' ? 'light' : 'dark')

  apply()

  if (getCurrentInstance()) {
    onUnmounted(() => media?.removeEventListener?.('change', onMedia))
  }

  return { theme, resolvedTheme, setTheme, toggleTheme }
}
