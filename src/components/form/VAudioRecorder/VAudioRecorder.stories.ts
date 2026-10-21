import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { onBeforeUnmount, ref } from 'vue'
import micIcon from '@iconify-icons/keyline-icons/mic'
import VAudioRecorder from './VAudioRecorder.vue'
import VButton from '../VButton/VButton.vue'
import { VIcon } from '../../primitives/VIcon'
import { isAudioRecordingSupported, useAudioRecorder } from '../../../composables/useAudioRecorder'

const sampleLevels = Array.from({ length: 60 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 0.55)) * 0.6 * ((i % 7) / 7 + 0.3))

const meta = {
  title: 'form/VAudioRecorder',
  component: VAudioRecorder,
  tags: ['autodocs'],
  args: { state: 'ready', elapsed: 0, duration: 24, levels: sampleLevels, bars: 32, size: 'md', closable: true, disabled: false },
  argTypes: {
    state: { description: '`recording`, `paused`, `ready` (take pronto) ou `playing`.', control: 'inline-radio', options: ['recording', 'paused', 'ready', 'playing'] },
    elapsed: { description: 'Segundos gravados (recording/paused) ou reproduzidos (ready/playing).', control: 'number' },
    duration: { description: 'Duração total do take, para o progresso de reprodução.', control: 'number' },
    levels: { description: 'Amplitudes 0–1 do waveform (mais antigas primeiro).', control: 'object' },
    bars: { description: 'Quantidade de barras do waveform.', control: 'number' },
    size: { description: 'Altura da barra.', control: 'inline-radio', options: ['sm', 'md'] },
    closable: { description: 'Botão de fechar ao lado.', control: 'boolean' },
    disabled: { description: 'Desabilita ações.', control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Barra de nota de voz (gravar, pausar, salvar, ouvir, descartar) com waveform. É **controlada**: emite `pause`, `resume`, `save`, `play`, `stop`, `discard`, `close`. Use o composable `useAudioRecorder()` para captura real via MediaRecorder.',
          '',
          '```vue',
          'const rec = useAudioRecorder()',
          '<VAudioRecorder v-if="rec.status.value !== \'idle\'" :state="rec.status.value" :elapsed="rec.elapsed.value"',
          '  :duration="rec.duration.value" :levels="rec.levels.value" @pause="rec.pause" @resume="rec.resume"',
          '  @save="rec.save" @play="rec.play" @stop="rec.stop" @discard="rec.discard" />',
          '```',
        ].join('\n'),
      },
    },
  },
  decorators: [() => ({ template: '<div style="max-width:460px;"><story /></div>' })],
} satisfies Meta<typeof VAudioRecorder>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Pronto para ouvir** (0:00 + play).' } } },
}

export const Recording: Story = {
  parameters: { docs: { description: { story: 'Variação **Gravando** com waveform animado (simulado).' } } },
  render: (args) => ({
    components: { VAudioRecorder },
    setup: () => {
      const levels = ref<number[]>([])
      const elapsed = ref(0)
      const state = ref<'recording' | 'paused'>('recording')
      const timer = setInterval(() => {
        if (state.value !== 'recording') return
        levels.value = [...levels.value, 0.15 + Math.random() * 0.85].slice(-64)
        elapsed.value += 0.12
      }, 120)
      onBeforeUnmount(() => clearInterval(timer))
      return { args, levels, elapsed, state }
    },
    template: `<VAudioRecorder v-bind="args" :state="state" :levels="levels" :elapsed="elapsed"
      @pause="state = 'paused'" @resume="state = 'recording'" @discard="levels = []; elapsed = 0" />`,
  }),
}

export const Paused: Story = {
  parameters: { docs: { description: { story: 'Variação **Pausado**.' } } },
  args: { state: 'paused', elapsed: 4, levels: sampleLevels.slice(0, 20) },
}

export const Playing: Story = {
  parameters: { docs: { description: { story: 'Variação **Reproduzindo** a 40%.' } } },
  args: { state: 'playing', elapsed: 9.6, duration: 24 },
}

export const LiveMicrophone: Story = {
  parameters: { docs: { description: { story: 'Variação **Microfone real** com `useAudioRecorder()` (pede permissão de microfone).' } } },
  render: (args) => ({
    components: { VAudioRecorder, VButton, VIcon },
    setup: () => ({ args, rec: useAudioRecorder(), supported: isAudioRecordingSupported(), micIcon }),
    template: `<div style="display:grid;gap:12px;justify-items:start;">
      <VButton v-if="rec.status.value === 'idle'" :disabled="!supported" @click="rec.start()">
        <VIcon :icon="micIcon" size="sm" /> Gravar nota de voz
      </VButton>
      <VAudioRecorder v-else v-bind="args" :state="rec.status.value" :elapsed="rec.elapsed.value" :duration="rec.duration.value"
        :levels="rec.levels.value" @pause="rec.pause" @resume="rec.resume" @save="rec.save" @play="rec.play"
        @stop="rec.stop" @discard="rec.discard" @close="rec.discard" />
      <small v-if="rec.error.value" style="color:var(--v-color-error-base)">{{ rec.error.value }}</small>
      <small v-if="!supported" style="color:var(--v-color-text-muted)">Gravação não suportada neste navegador.</small>
    </div>`,
  }),
}
