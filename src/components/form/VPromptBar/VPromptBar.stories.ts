import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VPromptBar from './VPromptBar.vue'

const meta = {
  title: 'form/VPromptBar',
  component: VPromptBar,
  parameters: { layout: 'centered' },
  decorators: [
    () => ({
      template: '<div style="width:min(420px,100%);padding:8px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VPromptBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VPromptBar },
    setup() {
      const prompt = ref('')
      return { prompt }
    },
    template: '<VPromptBar v-model="prompt" placeholder="Ask anything…" />',
  }),
}

export const WithDictation: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Dictation**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VPromptBar },
    setup() {
      const prompt = ref('')
      const lastError = ref('')
      return { prompt, lastError }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;width:100%">
        <VPromptBar
          v-model="prompt"
          dictation
          dictation-lang="pt-BR"
          placeholder="Toque no microfone e fale…"
          @dictation-error="lastError = $event"
        />
        <p style="margin:0;font-size:12px;color:var(--v-color-text-muted)">
          Transcrição: {{ prompt || '—' }}
        </p>
        <p v-if="lastError" style="margin:0;font-size:12px;color:var(--v-color-error-strong)">
          Erro: {{ lastError }}
        </p>
      </div>
    `,
  }),
}

export const Busy: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Busy**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VPromptBar },
    setup() {
      const prompt = ref('Summarize the latest release notes')
      return { prompt }
    },
    template: '<VPromptBar v-model="prompt" busy placeholder="Ask anything…" />',
  }),
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VPromptBar },
    setup() {
      const prompt = ref('Disabled prompt')
      return { prompt }
    },
    template: '<VPromptBar v-model="prompt" disabled />',
  }),
}

export const WithoutDictation: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Sem Dictation**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VPromptBar },
    setup() {
      const prompt = ref('')
      return { prompt }
    },
    template: '<VPromptBar v-model="prompt" :dictation="false" placeholder="Text only…" />',
  }),
}

export const NoDictation: Story = { parameters: { docs: { description: { story: 'Variação **Sem Dictation**. Props: `dictation=false`.' } } }, args: { dictation: false } }
