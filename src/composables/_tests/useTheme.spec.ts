/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTheme } from '../useTheme'

function mockMatchMedia(matches: boolean) {
  const listeners: Array<(e: { matches: boolean }) => void> = []
  const mql = {
    matches,
    addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => listeners.push(cb),
    removeEventListener: vi.fn(),
  }
  window.matchMedia = vi.fn(() => mql) as unknown as typeof window.matchMedia
  return { fire: (m: boolean) => listeners.forEach((l) => l({ matches: m })) }
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    mockMatchMedia(false)
  })

  it('applies data-theme and persists', () => {
    const { theme, setTheme, resolvedTheme } = useTheme({ default: 'light' })
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    setTheme('dark')
    expect(theme.value).toBe('dark')
    expect(resolvedTheme.value).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('v-theme')).toBe('dark')
  })

  it('restores from storage and toggles', () => {
    localStorage.setItem('v-theme', 'dark')
    const { theme, toggleTheme } = useTheme()
    expect(theme.value).toBe('dark')
    toggleTheme()
    expect(theme.value).toBe('light')
  })

  it('follows system preference', () => {
    const m = mockMatchMedia(true)
    const { resolvedTheme } = useTheme({ storageKey: false })
    expect(resolvedTheme.value).toBe('dark')
    m.fire(false)
    expect(resolvedTheme.value).toBe('light')
    expect(localStorage.getItem('v-theme')).toBeNull()
  })

  it('supports a custom target', () => {
    const el = document.createElement('div')
    useTheme({ target: () => el, default: 'dark', storageKey: false })
    expect(el.getAttribute('data-theme')).toBe('dark')
  })
})
