import type { Meta, StoryObj } from '@storybook/vue3-vite'
import arrowLeftIcon from '@iconify-icons/keyline-icons/arrow-left'
import arrowRightIcon from '@iconify-icons/keyline-icons/arrow-right'
import VButton from './VButton.vue'
import { VIcon } from '../../primitives/VIcon'
import type { VButtonVariant } from './VButton.types'

const VARIANT_LABELS: Record<VButtonVariant, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  ghost: 'Ghost',
  outline: 'Outline',
  destructive: 'Destructive',
  inverse: 'Ask AI',
  icon: 'Icon',
  loading: 'Loading',
}

const meta = {
  title: 'form/VButton',
  component: VButton,
  args: {
    size: 'md',
    variant: 'primary',
  },
  render: (args) => ({
    components: { VButton },
    setup() {
      const label = VARIANT_LABELS[args.variant ?? 'primary'] ?? 'Button'
      return { args, label }
    },
    template: '<VButton v-bind="args">{{ label }}</VButton>',
  }),
} satisfies Meta<typeof VButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const Primary: Story = { parameters: { docs: { description: { story: 'Variação **Primária**. Props: `variant="primary"`.' } } }, args: { variant: 'primary' } }

export const Secondary: Story = { parameters: { docs: { description: { story: 'Variação **Secundária**. Props: `variant="secondary"`.' } } }, args: { variant: 'secondary' } }

export const Ghost: Story = { parameters: { docs: { description: { story: 'Variação **Ghost**. Props: `variant="ghost"`.' } } }, args: { variant: 'ghost' } }

export const Outline: Story = { parameters: { docs: { description: { story: 'Variação **Contorno**. Props: `variant="outline"`.' } } }, args: { variant: 'outline' } }

export const Pill: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Pill**. Slots usados: `#icon`.' } },
  },
  render: () => ({
    components: { VButton, VIcon },
    setup: () => ({ arrowLeftIcon, arrowRightIcon }),
    template: `
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
        <VButton variant="outline" shape="pill">
          <template #icon><VIcon :icon="arrowLeftIcon" size="sm" /></template>
          Back to trace
        </VButton>
        <VButton variant="primary" shape="pill">
          <template #icon><VIcon :icon="arrowRightIcon" size="sm" /></template>
          Compare with failed run
        </VButton>
      </div>
    `,
  }),
}

export const Destructive: Story = { parameters: { docs: { description: { story: 'Variação **Destrutiva**. Props: `variant="destructive"`.' } } }, args: { variant: 'destructive' } }

export const Icon: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Ícone**. Props: `variant="icon"`, `ariaLabel="Favorite"`. Slots usados: `#icon`.' } },
  },
  args: { variant: 'icon', ariaLabel: 'Favorite' },
  render: (args) => ({
    components: { VButton },
    setup: () => ({ args }),
    template: '<VButton v-bind="args"><template #icon>♥</template></VButton>',
  }),
}

export const LoadingVariant: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Carregando variante**. Props: `variant="loading"`.' } },
  },
  args: { variant: 'loading' },
  render: (args) => ({
    components: { VButton },
    setup: () => ({ args }),
    template: '<VButton v-bind="args">Loading</VButton>',
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VButton },
    template: `<div style="display:flex;gap:12px;align-items:center"><VButton size="sm">Small</VButton><VButton size="md">Medium</VButton><VButton size="lg">Large</VButton></div>`,
  }),
}

export const States: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Estados**.' } },
  },
  render: () => ({
    components: { VButton },
    template: `<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><VButton>Default</VButton><VButton disabled>Disabled</VButton><VButton loading>Loading</VButton></div>`,
  }),
}

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }

export const Loading: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } },
  },
  args: { loading: true },
  render: (args) => ({
    components: { VButton },
    setup: () => ({ args }),
    template: '<VButton v-bind="args">Loading</VButton>',
  }),
}

export const Inverse: Story = { parameters: { docs: { description: { story: 'Variação **Inversa**. Props: `variant="inverse"`.' } } }, args: { variant: 'inverse' } }

export const InverseWithIcon: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Inversa com ícone**.' } },
  },
  render: () => ({
    components: { VButton, VIcon },
    setup: () => ({ arrowRightIcon }),
    template: '<VButton variant="inverse" shape="pill"><VIcon :icon="arrowRightIcon" size="sm" />Ask AI</VButton>',
  }),
}

export const TypeSubmit: Story = { parameters: { docs: { description: { story: 'Variação **Type Submit**. Props: `type="submit"`, `variant="primary"`.' } } }, args: { type: 'submit', variant: 'primary' } }
