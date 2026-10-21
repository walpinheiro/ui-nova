<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

const TOKENS = [
  ['--v-color-bg', 'Fundo da aplicação'],
  ['--v-color-surface', 'Cards, painéis, popovers'],
  ['--v-color-surface-muted', 'Superfície secundária / hover'],
  ['--v-color-text', 'Texto principal'],
  ['--v-color-text-muted', 'Texto secundário'],
  ['--v-color-border', 'Bordas e divisórias'],
  ['--v-color-border-strong', 'Bordas de controles (checkbox, radio)'],
  ['--v-color-primary', 'Ação primária / marca'],
  ['--v-color-primary-text', 'Texto sobre fundo tintado de primary'],
  ['--v-color-success-base', 'Sucesso'],
  ['--v-color-warning-base', 'Atenção'],
  ['--v-color-error-base', 'Erro'],
  ['--v-color-info-base', 'Informação'],
] as const

const lightEl = ref<HTMLElement | null>(null)
const darkEl = ref<HTMLElement | null>(null)
const values = ref<Record<string, { light: string; dark: string }>>({})

onMounted(async () => {
  await nextTick()
  const read = (el: HTMLElement | null, name: string) =>
    el ? getComputedStyle(el).getPropertyValue(name).trim() : ''
  const next: Record<string, { light: string; dark: string }> = {}
  for (const [name] of TOKENS) next[name] = { light: read(lightEl.value, name), dark: read(darkEl.value, name) }
  values.value = next
})
</script>

<template>
  <div class="stt">
    <div ref="lightEl" class="v-theme-light stt__probe" aria-hidden="true" />
    <div ref="darkEl" class="v-theme-dark stt__probe" aria-hidden="true" />
    <table class="stt__table">
      <thead>
        <tr>
          <th>Token</th>
          <th>Uso</th>
          <th class="v-theme-light">Light</th>
          <th class="v-theme-dark">Dark</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[name, usage] in TOKENS" :key="name">
          <td><code>{{ name }}</code></td>
          <td>{{ usage }}</td>
          <td class="v-theme-light stt__cell">
            <span class="stt__swatch" :style="{ background: `var(${name})` }" />
            <code>{{ values[name]?.light }}</code>
          </td>
          <td class="v-theme-dark stt__cell">
            <span class="stt__swatch" :style="{ background: `var(${name})` }" />
            <code>{{ values[name]?.dark }}</code>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.stt { font-family: var(--v-font-family-sans); overflow-x: auto; }
.stt__probe { position: absolute; width: 0; height: 0; overflow: hidden; }
.stt__table { border-collapse: collapse; width: 100%; font-size: 13px; }
.stt__table th, .stt__table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--v-color-border); }
.stt__cell { white-space: nowrap; }
.stt__swatch { display: inline-block; width: 18px; height: 18px; border-radius: 4px; vertical-align: middle; margin-right: 8px; border: 1px solid color-mix(in srgb, currentColor 25%, transparent); }
</style>
