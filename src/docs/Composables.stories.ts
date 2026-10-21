import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion'
import { useSpringValue } from '../composables/useSpringValue'
import { usePointerDrag } from '../composables/usePointerDrag'
import { useWarmTooltipGroup } from '../composables/useWarmTooltipGroup'
import { useTheme } from '../composables/useTheme'
import VButton from '../components/form/VButton/VButton.vue'

const meta = {
  title: 'Docs/Composables',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Composables públicos exportados por `vueui-nova-kit`.' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const UseThemeStory: Story = {
  name: 'useTheme',
  parameters: {
    docs: {
      description: { story: 'Escolha do tema (`light`/`dark`/`system`), tema efetivo e alternância. Demo isolada em um contêiner (sem tocar no `<html>`).' },
      source: { code: "const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme({ default: 'system' })" },
    },
  },
  render: () => ({
    components: { VButton },
    setup() {
      const el = ref<HTMLElement | null>(null)
      const t = useTheme({ target: () => el.value, storageKey: false, default: 'light' })
      return { el, ...t }
    },
    template: `<div ref="el" style="padding:16px;border:1px solid var(--v-color-border);border-radius:10px;display:grid;gap:8px;max-width:360px">
      <code>theme: {{ theme }} · resolved: {{ resolvedTheme }}</code>
      <div style="display:flex;gap:8px"><VButton size="sm" @click="setTheme('system')">system</VButton><VButton size="sm" variant="outline" @click="toggleTheme">toggleTheme()</VButton></div>
    </div>`,
  }),
}

export const UseReducedMotionStory: Story = {
  name: 'useReducedMotion',
  parameters: {
    docs: {
      description: { story: 'Ref reativa que reflete `prefers-reduced-motion: reduce`. Altere a preferência do sistema (ou emulação do DevTools) e veja o valor mudar.' },
      source: { code: 'const reduced = useReducedMotion() // Ref<boolean>' },
    },
  },
  render: () => ({
    setup: () => ({ reduced: useReducedMotion() }),
    template: '<p>prefers-reduced-motion: <strong>{{ reduced ? "reduce" : "no-preference" }}</strong></p>',
  }),
}

export const UseSpringValueStory: Story = {
  name: 'useSpringValue',
  parameters: {
    docs: {
      description: { story: 'Anima um número até o alvo com mola amortecida (`stiffness`, `damping`). Mude o alvo e a barra acompanha com overshoot.' },
      source: { code: 'const target = ref(0)\nconst { value, jump, start } = useSpringValue(target, { stiffness: 180, damping: 18 })' },
    },
  },
  render: () => ({
    setup() {
      const target = ref(20)
      const { value, jump } = useSpringValue(target)
      return { target, value, jump, width: computed(() => `${value.value}%`) }
    },
    template: `<div style="max-width:420px;display:grid;gap:10px">
      <input type="range" min="0" max="100" v-model.number="target" />
      <div style="height:14px;border-radius:7px;background:var(--v-color-surface-muted);overflow:hidden"><div :style="{width,height:'100%',background:'var(--v-color-primary)'}" /></div>
      <code>alvo {{ target }} · valor {{ value.toFixed(1) }}</code>
      <button type="button" @click="jump(0)">jump(0)</button>
    </div>`,
  }),
}

export const UsePointerDragStory: Story = {
  name: 'usePointerDrag',
  parameters: {
    docs: {
      description: { story: 'Arraste horizontal com rubber band entre `min` e `max`; ao soltar, `onCommit(offset, velocity)` decide o snap (`snapFromVelocity`).' },
      source: { code: "const { offset, dragging, onPointerDown, onPointerMove, onPointerUp, reset } =\n  usePointerDrag(elRef, { axis: 'x', min: -120, max: 0, rubberBand: true, onCommit })" },
    },
  },
  render: () => ({
    setup() {
      const el = ref<HTMLElement | null>(null)
      const last = ref('—')
      const d = usePointerDrag(el, {
        axis: 'x', min: -120, max: 120, rubberBand: true,
        onCommit: (o, v) => { last.value = `offset ${o.toFixed(0)}px, vel ${v.toFixed(2)}`; d.reset() },
      })
      return { el, last, ...d }
    },
    template: `<div style="max-width:420px;display:grid;gap:8px">
      <div ref="el" @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp" @pointercancel="onPointerUp"
        :style="{transform:'translateX('+offset+'px)',touchAction:'none',cursor:'grab',padding:'20px',borderRadius:'10px',background:'var(--v-color-primary)',color:'#fff',userSelect:'none',transition:dragging?'none':'transform .2s'}">Arraste-me</div>
      <code>offset {{ offset.toFixed(0) }}px · último commit: {{ last }}</code>
    </div>`,
  }),
}

export const UseWarmTooltipGroupStory: Story = {
  name: 'useWarmTooltipGroup',
  parameters: {
    docs: {
      description: { story: 'Grupo de tooltips "aquecido": ao entrar no grupo, o próximo tooltip abre sem atraso (`getShowDelay()` = 0) até o cooldown. Passe o mouse rapidamente entre os botões.' },
      source: { code: 'const { getShowDelay, onGroupEnter, onGroupLeave, isWarm } = useWarmTooltipGroup()' },
    },
  },
  render: () => ({
    components: { VButton },
    setup() {
      const g = useWarmTooltipGroup()
      const delay = ref(g.getShowDelay())
      const enter = () => { delay.value = g.getShowDelay(); g.onGroupEnter() }
      return { enter, leave: g.onGroupLeave, delay }
    },
    template: `<div style="display:grid;gap:8px"><div style="display:flex;gap:8px" @mouseleave="leave">
      <VButton v-for="n in 4" :key="n" variant="outline" size="sm" @mouseenter="enter">Item {{ n }}</VButton></div>
      <code>delay do próximo tooltip: {{ delay }}ms</code></div>`,
  }),
}
