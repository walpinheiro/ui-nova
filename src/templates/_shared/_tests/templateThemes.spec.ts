/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import {
  DEFAULT_TEMPLATE_THEME_ID,
  TEMPLATE_THEME_PRESETS,
  formatTemplateThemeCss,
  getTemplateThemeVars,
} from '../templateThemes'

describe('templateThemes', () => {
  it('expõe presets distintos com escala primary completa', () => {
    for (const preset of TEMPLATE_THEME_PRESETS) {
      expect(preset.vars['--v-color-primary']).toBeTruthy()
      expect(preset.vars['--v-color-primary-50']).toBeTruthy()
      expect(preset.vars['--v-color-primary-900']).toBeTruthy()
      expect(preset.vars['--v-color-primary']).toBe(preset.vars['--v-color-primary-600'])
    }
  })

  it('gera CSS :root por preset', () => {
    const css = formatTemplateThemeCss('teal')
    expect(css).toContain(':root {')
    expect(css).toContain('--v-color-primary-600: #0d9488;')
    expect(css).toContain('--v-sidebar-item-active-color: #0d9488;')
    expect(css).toContain('--v-color-focus: #14b8a6;')
  })

  it('fallback para indigo quando id é inválido', () => {
    const vars = getTemplateThemeVars('desconhecido')
    expect(vars['--v-color-primary-600']).toBe(
      getTemplateThemeVars(DEFAULT_TEMPLATE_THEME_ID)['--v-color-primary-600'],
    )
  })
})
