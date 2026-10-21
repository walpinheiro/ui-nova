import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VToast from './VToast.vue'
import { ref } from 'vue'
import VToastStack from './VToastStack.vue'
import VButton from '../../form/VButton/VButton.vue'
import type { VToastPlacement } from './VToast.types'

const meta = {
  title: 'feedback/VToast',
  component: VToast,
  args: {
    message: 'New updates are available.',
    size: 'md',
    variant: 'info',
    duration: 5000,
  },
} satisfies Meta<typeof VToast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const Success: Story = { parameters: { docs: { description: { story: 'Variação **Sucesso**. Props: `variant="success"`, `message="Project saved successfully."`.' } } }, args: { variant: 'success', message: 'Project saved successfully.' } }
export const Warning: Story = { parameters: { docs: { description: { story: 'Variação **Aviso**. Props: `variant="warning"`, `message="Connection is unstable."`.' } } }, args: { variant: 'warning', message: 'Connection is unstable.' } }
export const Error: Story = { parameters: { docs: { description: { story: 'Variação **Erro**. Props: `variant="error"`, `message="Failed to upload file."`.' } } }, args: { variant: 'error', message: 'Failed to upload file.' } }

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VToast },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:420px;">
        <VToast size="sm" variant="success" message="Saved successfully." :duration="0" />
        <VToast size="md" variant="success" message="Saved successfully." :duration="0" />
        <VToast size="lg" variant="success" message="Saved successfully." :duration="0" />
      </div>
    `,
  }),
}

export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `variant="loading"`, `message="Enviando arquivo…"`, `duration=0`.' } } }, args: { variant: 'loading', message: 'Enviando arquivo…', duration: 0 } }

export const WithoutProgressNotClosable: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Sem Progress Not Closable**. Props: `showProgress=false`, `closable=false`, `message="Toast fixo, sem barra e sem…"`, `duration=0`.' } },
  },
  args: { showProgress: false, closable: false, message: 'Toast fixo, sem barra e sem botão de fechar.', duration: 0 },
}

export const Stack: Story = {
  name: 'Stack (useVToastQueue)',
  parameters: {
    docs: {
      description: {
        story:
          'Fila de toasts com `VToastStack` + `useVToastQueue()`. O stack é teleportado para o `body`; escolha `placement` entre os seis cantos/centros.',
      },
    },
  },
  render: () => ({
    components: { VToastStack, VButton },
    setup() {
      const stack = ref<InstanceType<typeof VToastStack> | null>(null)
      const placement = ref<VToastPlacement>('top-right')
      const placements: VToastPlacement[] = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center']
      const variants = ['success', 'info', 'warning', 'error'] as const
      let n = 0
      const push = () => stack.value?.push({ message: `Notificação #${++n}`, variant: variants[n % 4], duration: 4000 })
      return { stack, placement, placements, push, clear: () => stack.value?.clear() }
    },
    template: `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <VToastStack ref="stack" :placement="placement" />
      <VButton variant="primary" @click="push">Adicionar toast</VButton>
      <VButton variant="outline" @click="clear">Limpar</VButton>
      <select v-model="placement"><option v-for="p in placements" :key="p" :value="p">{{ p }}</option></select>
    </div>`,
  }),
}

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`, `duration=0`.' } } }, args: { disabled: true, duration: 0 } }
