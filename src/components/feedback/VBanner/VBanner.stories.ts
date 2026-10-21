import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VButton from '../../form/VButton/VButton.vue'
import VBanner from './VBanner.vue'

const meta = {
  title: 'feedback/VBanner',
  component: VBanner,
  parameters: { layout: 'fullscreen' },
  args: {
    variant: 'info',
    size: 'md',
    title: 'Scheduled maintenance',
    description: 'The workspace will be read-only on Sunday from 02:00 to 03:00 UTC.',
    closable: true,
  },
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof VBanner>

export default meta
type Story = StoryObj<typeof meta>

/** App frame: the banner is attached to the top edge of the page, above the content. */
const PAGE = 'min-height:320px;background:var(--v-color-bg);'
const BODY = 'margin:24px;height:220px;border:1px dashed var(--v-color-border);border-radius:12px;'

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Aviso da **página ou do app**: faixa de ponta a ponta no topo, uma linha compacta (título + descrição), ações à direita. Para mensagens dentro do conteúdo use o `VAlert`.',
      },
    },
  },
  render: (args) => ({
    components: { VBanner, VButton },
    setup: () => ({ args, page: PAGE, body: BODY }),
    template: `
      <div :style="page">
        <VBanner v-bind="args">
          <template #action><VButton size="sm" variant="outline">View status</VButton></template>
        </VBanner>
        <div :style="body" />
      </div>
    `,
  }),
}

export const Variants: Story = {
  parameters: { docs: { description: { story: '`info`, `success`, `warning`, `error` e `neutral` (anúncio de produto, com ícone de megafone).' } } },
  render: () => ({
    components: { VBanner, VButton },
    setup: () => ({ page: PAGE }),
    template: `
      <div :style="page + 'display:grid;gap:16px;padding-block:16px'">
        <VBanner variant="info" title="Scheduled maintenance" description="Read-only on Sunday, 02:00–03:00 UTC." closable />
        <VBanner variant="success" title="You're all set" description="Your domain is verified and live." closable />
        <VBanner variant="warning" title="Your trial ends in 3 days" description="Add a payment method to keep your projects." closable>
          <template #action><VButton size="sm" variant="outline">Add payment</VButton></template>
        </VBanner>
        <VBanner variant="error" title="Sync is paused" description="We couldn't reach your Git provider." closable>
          <template #action><VButton size="sm" variant="outline">Retry</VButton></template>
        </VBanner>
        <VBanner variant="neutral" title="New: AI summaries" description="Every thread now gets a summary." closable>
          <template #action><VButton size="sm">Try it</VButton></template>
        </VBanner>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: { docs: { description: { story: '`sm` (36px), `md` (44px, padrão) e `lg` (52px).' } } },
  render: () => ({
    components: { VBanner },
    setup: () => ({ page: PAGE }),
    template: `
      <div :style="page + 'display:grid;gap:16px;padding-block:16px'">
        <VBanner size="sm" title="Small banner" description="Compact, for dense app chrome." closable />
        <VBanner size="md" title="Medium banner" description="Default height." closable />
        <VBanner size="lg" title="Large banner" description="More presence for important notices." closable />
      </div>
    `,
  }),
}

export const States: Story = {
  parameters: { docs: { description: { story: 'Carregando (`loading`), desabilitado (`disabled`) e o marcador exibido depois de dispensar (`dismissedText`).' } } },
  render: () => ({
    components: { VBanner },
    setup: () => ({ page: PAGE }),
    template: `
      <div :style="page + 'display:grid;gap:16px;padding-block:16px'">
        <VBanner title="Publishing your changes" description="This usually takes a few seconds." loading />
        <VBanner title="Disabled banner" description="Actions are unavailable." disabled closable />
        <VBanner :model-value="false" dismissed-text="Banner dismissed" />
      </div>
    `,
  }),
}

export const CloseOnEscape: Story = { parameters: { docs: { description: { story: 'Com foco no banner, `Esc` o dispensa (`closeOnEscape=true`, padrão).' } } }, args: { closable: true, closeOnEscape: true } }

export const ControlledVModel: Story = {
  parameters: { docs: { description: { story: 'Visibilidade controlada com `v-model`.' } } },
  render: () => ({
    components: { VBanner, VButton },
    setup() {
      const open = ref(true)
      return { open, page: PAGE }
    },
    template: `
      <div :style="page">
        <VBanner v-model="open" closable title="Controlled banner" description="Dismiss it and bring it back with the button." />
        <div style="padding:24px"><VButton v-if="!open" size="sm" variant="outline" @click="open = true">Show banner again</VButton></div>
      </div>
    `,
  }),
}
