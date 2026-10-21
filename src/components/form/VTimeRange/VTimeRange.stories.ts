import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VTimeRange from './VTimeRange.vue'

const meta = {
  title: 'form/VTimeRange',
  component: VTimeRange,
  tags: ['autodocs'],
  args: { start: '12:00', end: '12:30', step: 5, showDuration: true, closable: true, disabled: false, size: 'md' },
  argTypes: {
    start: { description: 'Início `HH:MM` (`v-model:start`).', control: 'text' },
    end: { description: 'Fim `HH:MM` (`v-model:end`); antes do início = passa da meia-noite.', control: 'text' },
    step: { description: 'Passo em minutos dos inputs.', control: 'number' },
    showDuration: { description: 'Mostra a duração calculada (ex.: `30min`, `1h 30min`).', control: 'boolean' },
    closable: { description: 'Botão de fechar.', control: 'boolean' },
    disabled: { description: 'Desabilita.', control: 'boolean' },
    size: { description: 'Altura.', control: 'inline-radio', options: ['sm', 'md'] },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Barra compacta de intervalo de horário `12:00 → 12:30 · 30min`, usando `<input type="time">` nativo (teclado e leitores de tela inclusos). Emite `change` com `{ start, end, minutes }`.',
          '',
          '```vue',
          '<VTimeRange v-model:start="start" v-model:end="end" @close="hide" />',
          '```',
        ].join('\n'),
      },
    },
  },
  decorators: [() => ({ template: '<div style="max-width:460px;"><story /></div>' })],
  render: (args) => ({
    components: { VTimeRange },
    setup: () => ({ args, start: ref(args.start), end: ref(args.end) }),
    template: `<VTimeRange v-bind="args" v-model:start="start" v-model:end="end" />`,
  }),
} satisfies Meta<typeof VTimeRange>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Padrão**. Edite os horários para ver a duração.' } } },
}

export const Overnight: Story = {
  parameters: { docs: { description: { story: 'Variação **Passa da meia-noite**.' } } },
  args: { start: '23:30', end: '01:15' },
}

export const Small: Story = {
  parameters: { docs: { description: { story: 'Variação **Compacta** sem fechar.' } } },
  args: { size: 'sm', closable: false },
}
