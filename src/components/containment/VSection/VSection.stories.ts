import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VSection from './VSection.vue'

const meta = {
  title: 'containment/VSection',
  component: VSection,
  args: {
    size: 'md',
    variant: 'default',
    title: 'Personal Information',
    description: 'Manage your public profile and personal details.',
  },
} satisfies Meta<typeof VSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
  render: (args) => ({
    components: { VSection },
    setup: () => ({ args }),
    template: `
      <VSection v-bind="args">
        <div>Full name · Location · Email · Bio</div>
      </VSection>
    `,
  }),
}

export const WithIconAndActions: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com ícone e ações**. Props: `icon="user"`. Slots usados: `#actions`, `#footer`.' } },
  },
  args: { icon: 'user' },
  render: (args) => ({
    components: { VSection },
    setup: () => ({ args }),
    template: `
      <VSection v-bind="args">
        <template #actions><button type="button">Edit</button></template>
        <div>Profile fields go here.</div>
        <template #footer>ⓘ Your profile information is visible to your team members.</template>
      </VSection>
    `,
  }),
}

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: () => ({
    components: { VSection },
    template: `
      <div style="display:grid;gap:16px;">
        <VSection data-test-id="docs-section-variant-default" title="Team" description="Manage team members and permissions." variant="default">Default</VSection>
        <VSection data-test-id="docs-section-variant-elevated" title="Settings" description="Adds subtle shadow." variant="elevated">Elevated</VSection>
        <VSection data-test-id="docs-section-variant-bordered" title="Documentation" description="Uses a clear border." variant="bordered">Bordered</VSection>
        <VSection data-test-id="docs-section-variant-borderless" title="Integrations" description="No border for a cleaner look." variant="borderless">Borderless</VSection>
        <VSection data-test-id="docs-section-variant-tinted" title="Upgrade" description="Subtle background tint." variant="tinted">Tinted</VSection>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VSection },
    template: `
      <div style="display:grid;gap:16px;">
        <VSection data-test-id="docs-section-size-sm" size="sm" title="Small title" description="A compact section.">Small</VSection>
        <VSection data-test-id="docs-section-size-md" size="md" title="Medium title" description="A balanced section.">Medium</VSection>
        <VSection data-test-id="docs-section-size-lg" size="lg" title="Large title" description="A spacious section with more room.">Large</VSection>
      </div>
    `,
  }),
}

export const HeadingLevel3: Story = { parameters: { docs: { description: { story: 'Variação **Heading Level3**. Props: `headingLevel="3"`, `title="Seção com h3"`.' } } }, args: { headingLevel: '3', title: 'Seção com h3' } }
