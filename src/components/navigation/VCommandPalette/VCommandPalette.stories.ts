import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VButton from '../../form/VButton/VButton.vue'
import VCommandPalette from './VCommandPalette.vue'

const meta = {
  title: 'navigation/VCommandPalette',
  component: VCommandPalette,
  args: {
    modelValue: true,
    size: 'md',
    variant: 'global-search',
    placeholder: 'Search for anything…',
  },
  argTypes: {
    modelValue: { control: 'boolean' },
    open: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: ['global-search', 'quick-actions', 'file-switcher', 'settings-palette'],
    },
  },
} satisfies Meta<typeof VCommandPalette>

export default meta
type Story = StoryObj<typeof meta>

const paletteStory = (args: Partial<Story['args']> = {}): Story => ({
  args,
  render: (storyArgs) => ({
    components: { VCommandPalette },
    setup: () => ({ args: storyArgs }),
    template: `<div class="stage" style="position:relative;min-height:520px;"><VCommandPalette v-bind="args" /></div>`,
  }),
})

export const Default: Story = paletteStory()
export const QuickActions: Story = paletteStory({ variant: 'quick-actions' })
export const FileSwitcher: Story = paletteStory({ variant: 'file-switcher' })
export const SettingsPalette: Story = paletteStory({ variant: 'settings-palette' })
export const Small: Story = paletteStory({ size: 'sm' })
export const Large: Story = paletteStory({ size: 'lg' })
export const Closed: Story = paletteStory({ modelValue: false })
export const Loading: Story = paletteStory({ loading: true })
export const Empty: Story = paletteStory({ query: 'zzzz-no-match' })
export const Disabled: Story = paletteStory({ disabled: true })

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: () => ({
    components: { VCommandPalette },
    template: `
      <div style="display:grid;gap:24px;">
        <div class="stage" style="position:relative;min-height:420px;"><VCommandPalette data-variant="global-search" model-value /></div>
        <div class="stage" style="position:relative;min-height:420px;"><VCommandPalette data-variant="quick-actions" variant="quick-actions" model-value /></div>
        <div class="stage" style="position:relative;min-height:420px;"><VCommandPalette data-variant="file-switcher" variant="file-switcher" model-value /></div>
        <div class="stage" style="position:relative;min-height:420px;"><VCommandPalette data-variant="settings-palette" variant="settings-palette" model-value /></div>
      </div>
    `,
  }),
}

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Interativo**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VButton, VCommandPalette },
    setup() {
      const isOpen = ref(false)
      const lastSelection = ref('')
      return { isOpen, lastSelection }
    },
    template: `
      <VButton data-test-id="command-palette-trigger-open" @click="isOpen = true">Open palette</VButton>
      <p v-if="lastSelection">Selected: {{ lastSelection }}</p>
      <div class="stage" style="position:relative;min-height:520px;margin-top:16px;">
        <VCommandPalette
          v-model="isOpen"
          @select="(item) => { lastSelection = item.label; isOpen = false }"
        />
      </div>
    `,
  }),
}

export const EmptyStateTexts: Story = { parameters: { docs: { description: { story: 'Variação **Vazio estado Texts**. Props: `modelValue=true`, `query="zzzz"`, `emptyTitle="Nada encontrado"`, `emptyHint="Tente outro termo"`.' } } }, args: { modelValue: true, query: 'zzzz', emptyTitle: 'Nada encontrado', emptyHint: 'Tente outro termo', items: [] } }

export const NotDismissible: Story = { parameters: { docs: { description: { story: 'Variação **Not Dismissible**. Props: `modelValue=true`, `dismissible=false`.' } } }, args: { modelValue: true, dismissible: false } }

export const ShortcutLabel: Story = { parameters: { docs: { description: { story: 'Variação **Shortcut rótulo**. Props: `modelValue=true`, `shortcutLabel="Ctrl K"`.' } } }, args: { modelValue: true, shortcutLabel: 'Ctrl K' } }
