import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import { SPRING_PRESETS, springReadings, springStep, zetaFromBounce } from '../motion/springs'
import { GESTURE_DEFAULTS, rubberBand, snapFromVelocity } from '../motion/gestures'

const meta = {
  title: 'Docs/Motion API',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Utilitários de movimento exportados: molas (`springs`) e gestos (`gestures`).' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Springs: Story = {
  name: 'SPRING_PRESETS, springStep, zetaFromBounce',
  parameters: {
    docs: {
      description: { story: 'Presets de mola (`snappy`, `bouncy`, `critical`) com o fator de amortecimento `zetaFromBounce(bounce)` e a resposta ao degrau simulada com `springStep`.' },
      source: { code: "import { SPRING_PRESETS, springStep, zetaFromBounce } from 'vueui-nova-kit'\nconst { value, velocity } = springStep(current, target, velocity, 180, 18, 1 / 60)" },
    },
  },
  render: () => ({
    setup() {
      const rows = Object.entries(SPRING_PRESETS).map(([name, cfg]) => {
        const zeta = zetaFromBounce(cfg.bounce)
        const stiffness = 180
        const damping = 2 * zeta * Math.sqrt(stiffness)
        let v = 0
        let vel = 0
        const pts: string[] = []
        for (let i = 0; i < 90; i++) {
          const r = springStep(v, 1, vel, stiffness, damping)
          v = r.value
          vel = r.velocity
          pts.push(`${(i / 89) * 200},${60 - v * 40}`)
        }
        return { name, ...cfg, zeta: zeta.toFixed(3), path: pts.join(' ') }
      })
      return { rows }
    },
    template: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px">
      <div v-for="r in rows" :key="r.name" style="border:1px solid var(--v-color-border);border-radius:10px;padding:12px">
        <strong>{{ r.name }}</strong>
        <div style="font-size:12px;color:var(--v-color-text-muted)">visualDuration {{ r.visualDuration }}s · bounce {{ r.bounce }} · ζ {{ r.zeta }}</div>
        <svg viewBox="0 0 200 70" width="100%"><polyline :points="r.path" fill="none" stroke="var(--v-color-primary)" stroke-width="2" /></svg>
      </div></div>`,
  }),
}

export const SpringReadingsStory: Story = {
  name: 'springReadings',
  parameters: {
    docs: {
      description: { story: 'Traduz o progresso `t` da mola (0 → 1+) em leituras visuais: escala do preenchimento, da caixa, deslocamento do check, opacidade do texto e escala do risco.' },
    },
  },
  render: () => ({
    setup() {
      const t = ref(0.6)
      const r = computed(() => springReadings(t.value))
      return { t, r }
    },
    template: `<div style="max-width:420px;display:grid;gap:8px"><input type="range" min="0" max="1.4" step="0.01" v-model.number="t" /><code>t = {{ t }}</code>
      <pre style="margin:0">{{ JSON.stringify(r, null, 2) }}</pre></div>`,
  }),
}

export const Gestures: Story = {
  name: 'GESTURE_DEFAULTS, rubberBand, snapFromVelocity',
  parameters: {
    docs: {
      description: { story: '`rubberBand` amortece o arraste fora de `[min, max]`; `snapFromVelocity` decide se o gesto completa (distância > limiar ou flick rápido). Ajuste offset e velocidade.' },
      source: { code: "import { GESTURE_DEFAULTS, rubberBand, snapFromVelocity } from 'vueui-nova-kit'\nrubberBand(150, 0, 100)        // 117.5\nsnapFromVelocity(50, 0.8)      // true (flick)" },
    },
  },
  render: () => ({
    setup() {
      const offset = ref(150)
      const velocity = ref(0.2)
      return {
        offset, velocity, defaults: GESTURE_DEFAULTS,
        banded: computed(() => rubberBand(offset.value, 0, 100)),
        snap: computed(() => snapFromVelocity(offset.value, velocity.value)),
      }
    },
    template: `<div style="max-width:420px;display:grid;gap:8px">
      <label>offset <input type="range" min="-50" max="250" v-model.number="offset" /> {{ offset }}</label>
      <label>velocidade <input type="range" min="0" max="2" step="0.05" v-model.number="velocity" /> {{ velocity }}</label>
      <code>rubberBand(offset, 0, 100) = {{ banded.toFixed(1) }}</code>
      <code>snapFromVelocity(offset, velocity) = {{ snap }}</code>
      <code>GESTURE_DEFAULTS = {{ JSON.stringify(defaults) }}</code></div>`,
  }),
}
