import type { Meta, StoryObj } from '@storybook/vue3-vite'
import receiptIcon from '@iconify-icons/keyline-icons/receipt'
import VTimeline from './VTimeline.vue'
import VButton from '../../form/VButton/VButton.vue'

const claimSteps = [
  { id: 1, title: 'Compressor replaced', description: 'Job #4821 · 4.5 h labor · R-410A recharged.', time: 'Sep 18' },
  { id: 2, title: 'Claim prepared', description: 'Warranty matched, 9 of 10 evidence items, priced to the Carrier labor guide.', time: 'Sep 21' },
  { id: 3, title: 'Submitted to Carrier', description: 'Confirmation CW-7730418, filed as Copperline Home Services.', time: 'Today, 9:14 AM' },
  { id: 4, title: 'Carrier review', description: 'Clawback checks the Carrier portal every morning.', time: 'By Oct 13', state: 'current' as const },
  { id: 5, title: 'Payment', description: 'Credit memo, usually 6 days after approval.', time: 'About Oct 19', state: 'upcoming' as const, icon: receiptIcon },
]

const activity = [
  { id: 1, group: 'Today', title: 'You completed Launch readiness checklist', time: '4h ago', avatar: { initials: 'AM' } },
  { id: 2, group: 'Today', title: 'Lena Fischer commented on Launch readiness checklist', time: '7h ago', avatar: { initials: 'LF' } },
  { id: 3, group: 'Earlier', title: 'You created project Product Launch', time: 'Sep 2', avatar: { initials: 'AM' } },
]

const meta = {
  title: 'data/VTimeline',
  component: VTimeline,
  tags: ['autodocs'],
  args: { items: claimSteps, variant: 'steps', size: 'md', ariaLabel: 'Claim timeline' },
  argTypes: {
    items: { description: 'Itens `{ id, title, description?, time?, state?, icon?, avatar?, group? }`.', control: 'object' },
    variant: { description: '`steps` (marcadores + conector) ou `feed` (avatar, agrupado por `group`).', control: 'inline-radio', options: ['steps', 'feed'] },
    size: { description: 'Densidade.', control: 'inline-radio', options: ['sm', 'md'] },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Linha do tempo vertical. `steps` mostra o andamento de um processo (concluído, atual, futuro, erro); `feed` é um log de atividade agrupado por período. Slots: `marker`, `title`, `description`, `extra` (recebem `item`).',
          '',
          '```vue',
          '<VTimeline :items="steps" />',
          '<VTimeline variant="feed" :items="activity" />',
          '```',
        ].join('\n'),
      },
    },
  },
  decorators: [() => ({ template: '<div style="max-width:520px;"><story /></div>' })],
} satisfies Meta<typeof VTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { docs: { description: { story: 'Variação **Etapas** (Claim timeline).' } } },
}

export const ActivityFeed: Story = {
  parameters: { docs: { description: { story: 'Variação **Feed** agrupado (Today / Earlier).' } } },
  args: { variant: 'feed', items: activity, ariaLabel: 'Activity' },
}

export const WithError: Story = {
  parameters: { docs: { description: { story: 'Variação **Com erro** em uma etapa.' } } },
  args: {
    items: [
      { id: 1, title: 'Claim prepared', time: 'Sep 21' },
      { id: 2, title: 'Submitted to Carrier', time: 'Sep 22' },
      { id: 3, title: 'Denied — missing failure photo', description: 'Add the photo and resubmit within 7 days.', time: 'Sep 30', state: 'error' as const },
    ],
  },
}

export const WithExtraSlot: Story = {
  parameters: { docs: { description: { story: 'Variação **Slot extra**: ação inline na etapa atual.' } } },
  render: (args) => ({
    components: { VTimeline, VButton },
    setup: () => ({ args }),
    template: `<VTimeline v-bind="args">
      <template #extra="{ item }">
        <div v-if="item.state === 'current'" style="margin-top:8px"><VButton size="sm" variant="secondary">View in Carrier portal</VButton></div>
      </template>
    </VTimeline>`,
  }),
}

export const Small: Story = {
  parameters: { docs: { description: { story: 'Variação **Compacta**. Props: `size="sm"`.' } } },
  args: { size: 'sm' },
}
