import type { Meta, StoryObj } from '@storybook/vue3-vite'
import homeIcon from '@iconify-icons/keyline-icons/home'
import searchIcon from '@iconify-icons/keyline-icons/search'
import settingsIcon from '@iconify-icons/keyline-icons/settings'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import VIcon from './VIcon.vue'

const meta = {
  title: 'primitives/VIcon',
  component: VIcon,
  tags: ['autodocs'],
  args: { icon: homeIcon, size: 'md' },
  argTypes: {
    icon: { description: 'Objeto `IconifyIcon` (`{ body, width?, height? }`), ex.: import de `@iconify-icons/keyline-icons/home`.', control: false },
    size: { description: 'Tamanho do ícone: `sm`, `md` ou `lg`.', control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Renderiza um ícone SVG a partir de um objeto **Iconify** (`IconifyIcon`). O ícone herda `currentColor`, então acompanha a cor do texto e o tema.',
          '',
          '```vue',
          '<script setup lang="ts">',
          "import homeIcon from '@iconify-icons/keyline-icons/home'",
          "import { VIcon } from 'vueui-nova-kit'",
          '</script>',
          '',
          '<template>',
          '  <VIcon :icon="homeIcon" size="md" />',
          '</template>',
          '```',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof VIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VIcon },
    setup: () => ({ homeIcon }),
    template: `<div style="display:flex;gap:16px;align-items:center;">
      <VIcon :icon="homeIcon" size="sm" /><VIcon :icon="homeIcon" size="md" /><VIcon :icon="homeIcon" size="lg" />
    </div>`,
  }),
}

export const InheritsColor: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Inherits Color**.' } },
  },
  render: () => ({
    components: { VIcon },
    setup: () => ({ searchIcon, settingsIcon, sparklesIcon }),
    template: `<div style="display:flex;gap:16px;align-items:center;">
      <span style="color:var(--v-color-primary)"><VIcon :icon="searchIcon" size="lg" /></span>
      <span style="color:var(--v-color-success-base, green)"><VIcon :icon="settingsIcon" size="lg" /></span>
      <span style="color:var(--v-color-text-muted)"><VIcon :icon="sparklesIcon" size="lg" /></span>
    </div>`,
  }),
}
