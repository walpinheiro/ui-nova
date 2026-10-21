import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { onMounted, onUnmounted, ref } from 'vue'
import { VCheckbox } from '../form/VCheckbox'
import { VButton } from '../form/VButton'
import { VTooltip } from '../feedback/VTooltip'
import { VSpinner } from '../feedback/VSpinner'
import { VNumberInput } from '../form/VNumberInput'
import { VSwitch } from '../form/VSwitch'
import { VToast } from '../feedback/VToast'
import { VAgentChip } from '../feedback/VAgentChip'
import { VThoughtLine } from '../feedback/VThoughtLine'
import { VPromptBar } from '../form/VPromptBar'

const meta: Meta = {
  title: 'motion/Expressive',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Galeria de micro-interações de movimento (molas, "fuse and hold", grupo de tooltips aquecido, loader em lattice) usando os utilitários de `Motion API` e os tokens `--v-motion-*`. Respeita `prefers-reduced-motion`.',
          '',
          '```ts',
          "import { useSpringValue, useReducedMotion, useWarmTooltipGroup } from 'vueui-nova-kit'",
          '```',
        ].join('\n'),
      },
    },
  },
}

export default meta
type Story = StoryObj

export const SpringCheck: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Spring Check**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VCheckbox },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;min-width:280px">
        <VCheckbox v-model="checked" motion="expressive" label="Ship the build" />
        <VCheckbox v-model="checked" motion="expressive" label="Update the changelog" strike-through="left" />
      </div>
    `,
  }),
}

export const FuseAndHold: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Fuse e Hold**. Slots usados: `#icon`.' } },
  },
  render: () => ({
    components: { VButton },
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <VButton motion="expressive" micro-interaction="fuse" :undo-window="5000">Enviar</VButton>
        <VButton motion="expressive" micro-interaction="hold" :hold-duration="1500" variant="destructive">Excluir</VButton>
        <VButton motion="expressive" micro-interaction="favorite" variant="icon" :favorite-count="42">
          <template #icon>♥</template>
        </VButton>
      </div>
    `,
  }),
}

export const WarmTooltipGroup: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Warm Tooltip grupo**.' } },
  },
  render: () => ({
    components: { VTooltip },
    template: `
      <div style="display:flex;gap:8px">
        <VTooltip content="Bold" motion="expressive" warm-group="tb"><button type="button">B</button></VTooltip>
        <VTooltip content="Italic" motion="expressive" warm-group="tb"><button type="button">I</button></VTooltip>
        <VTooltip content="Link" motion="expressive" warm-group="tb"><button type="button">🔗</button></VTooltip>
      </div>
    `,
  }),
}

export const LatticeLoader: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Lattice Loader**.' } },
  },
  render: () => ({
    components: { VSpinner },
    template: `<VSpinner variant="lattice" verb="Thinking" label="Thinking" />`,
  }),
}

export const ScrubField: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Scrub Field**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VNumberInput },
    setup() {
      const value = ref(50)
      return { value }
    },
    template: `<VNumberInput v-model="value" motion="expressive" interaction="scrub" :min="0" :max="100" label="Opacity" />`,
  }),
}

export const AiSurface: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Ai Surface**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VAgentChip, VThoughtLine, VPromptBar },
    setup() {
      const prompt = ref('Summarize the latest release notes')
      const busy = ref(true)
      const chipStatus = ref<'pending' | 'success' | 'error'>('pending')
      const chipDuration = ref(0)
      const thoughtDuration = ref(0)
      const thoughtExpanded = ref(false)
      const steps = [
        { id: 'scan', label: 'Scanning documentation' },
        { id: 'rank', label: 'Ranking candidate answers' },
        { id: 'draft', label: 'Drafting response outline' },
      ]

      let timers: ReturnType<typeof setTimeout>[] = []

      const schedule = (fn: () => void, ms: number) => {
        timers.push(setTimeout(fn, ms))
      }

      onMounted(() => {
        schedule(() => {
          chipStatus.value = 'success'
          chipDuration.value = 1240
        }, 1400)

        schedule(() => {
          thoughtDuration.value = 3600
          thoughtExpanded.value = true
        }, 3800)

        schedule(() => {
          busy.value = false
        }, 4200)
      })

      onUnmounted(() => {
        timers.forEach(clearTimeout)
        timers = []
      })

      return {
        prompt,
        busy,
        chipStatus,
        chipDuration,
        thoughtDuration,
        thoughtExpanded,
        steps,
      }
    },
    template: `
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:16px;width:420px;max-width:100%">
        <VAgentChip
          label="search_docs"
          :status="chipStatus"
          :duration-ms="chipDuration"
        />
        <VThoughtLine
          label="Reasoning"
          :steps="steps"
          :duration="thoughtDuration"
          :default-expanded="thoughtExpanded"
        />
        <VPromptBar v-model="prompt" :busy="busy" dictation placeholder="Ask anything…" />
      </div>
    `,
  }),
}
