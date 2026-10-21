import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VAccordion from './VAccordion.vue'
import VAccordionItem from './VAccordionItem.vue'
import VButton from '../../form/VButton/VButton.vue'

const meta = {
  title: 'feedback/VAccordion',
  component: VAccordion,
  subcomponents: { VAccordionItem },
  args: { size: 'md', variant: 'default', multiple: false },
} satisfies Meta<typeof VAccordion>

export default meta
type Story = StoryObj<typeof meta>

const faqItems = [
  {
    id: 'what-is',
    title: 'What is VueUI Nova?',
    body: 'VueUI Nova is a modern UI library for Vue 3, designed for speed and clarity.',
  },
  {
    id: 'pricing',
    title: 'How does pricing work?',
    body: 'VueUI Nova is open source and free for personal use. We also offer a Pro plan with advanced components, team collaboration, and priority support.',
  },
  {
    id: 'commercial',
    title: 'Can I use it in commercial projects?',
    body: 'Yes. Use VueUI Nova in commercial projects under the project license.',
  },
  {
    id: 'help',
    title: 'Where can I get help?',
    body: 'Read the documentation or open an issue in the project repository.',
  },
] as const

function renderFaq(args: Record<string, unknown>, initialOpen: string | string[] | null = null) {
  return {
    components: { VAccordion, VAccordionItem, VButton },
    setup() {
      const open = ref<string | string[] | null>(initialOpen)
      return { args, open, faqItems }
    },
    template: `
      <VAccordion v-bind="args" v-model="open" aria-label="Frequently asked questions">
        <VAccordionItem v-for="item in faqItems" :key="item.id" :id="item.id" :title="item.title">
          <p>{{ item.body }}</p>
          <div v-if="item.id === 'pricing'" class="v-accordion__actions">
            <VButton size="sm" data-test-id="accordion-button-learn-more">Learn more ›</VButton>
            <VButton size="sm" variant="outline" data-test-id="accordion-button-view-pricing">View pricing</VButton>
          </div>
        </VAccordionItem>
      </VAccordion>
    `,
  }
}

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
  render: (args) => renderFaq(args, 'pricing'),
}

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**. Slots usados: `#icon`.' } },
  },
  render: (args) => ({
    components: { VAccordion, VAccordionItem },
    setup: () => ({ args }),
    template: `
      <div class="grid gap-6">
        <VAccordion v-bind="args" variant="default" aria-label="Default variant">
          <VAccordionItem id="general" title="General">General settings</VAccordionItem>
          <VAccordionItem id="account" title="Account">Account settings</VAccordionItem>
        </VAccordion>
        <VAccordion v-bind="args" variant="divided" aria-label="Divided variant">
          <VAccordionItem id="profile" title="Profile">Profile details</VAccordionItem>
          <VAccordionItem id="notifications" title="Notifications">Notification preferences</VAccordionItem>
        </VAccordion>
        <VAccordion v-bind="args" variant="bordered" aria-label="Bordered variant">
          <VAccordionItem id="appearance" title="Appearance">Appearance settings</VAccordionItem>
          <VAccordionItem id="integrations" title="Integrations">Integration settings</VAccordionItem>
        </VAccordion>
        <VAccordion v-bind="args" variant="leading-icon" aria-label="Leading icon variant">
          <VAccordionItem id="settings" title="Settings"><template #icon>⚙</template>Manage settings</VAccordionItem>
          <VAccordionItem id="members" title="Members"><template #icon>♙</template>Manage members</VAccordionItem>
        </VAccordion>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: (args) => ({
    components: { VAccordion, VAccordionItem },
    setup: () => ({ args }),
    template: `
      <div class="grid gap-4">
        <VAccordion v-bind="args" size="sm" aria-label="Small accordion"><VAccordionItem title="Small">Compact density</VAccordionItem></VAccordion>
        <VAccordion v-bind="args" size="md" aria-label="Medium accordion"><VAccordionItem title="Medium (default)">Default density</VAccordionItem></VAccordion>
        <VAccordion v-bind="args" size="lg" aria-label="Large accordion"><VAccordionItem title="Large">Spacious density</VAccordionItem></VAccordion>
      </div>
    `,
  }),
}

export const States: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Estados**.' } },
  },
  render: (args) => ({
    components: { VAccordion, VAccordionItem },
    setup: () => ({ args }),
    template: `
      <div class="grid gap-3">
        <VAccordion v-bind="args" aria-label="Collapsed"><VAccordionItem id="collapsed" title="Collapsed">Content</VAccordionItem></VAccordion>
        <VAccordion v-bind="args" model-value="expanded" aria-label="Expanded"><VAccordionItem id="expanded" title="Expanded">Content</VAccordionItem></VAccordion>
      </div>
    `,
  }),
}

export const Multiple: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Múltiplo**.' } },
  },
  render: (args) => renderFaq({ ...args, multiple: true }, ['pricing', 'help']),
}
