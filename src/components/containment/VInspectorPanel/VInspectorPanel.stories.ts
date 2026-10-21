import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, h, ref } from 'vue'
import VDropdownMenu from '../../navigation/VDropdownMenu/VDropdownMenu.vue'
import VInspectorPanel from './VInspectorPanel.vue'

const VInspectorPanelDemoFields = defineComponent({
  name: 'VInspectorPanelDemoFields',
  setup() {
    const variant = ref('primary')
    const size = ref('large')

    const variantItems = [
      { value: 'primary', label: 'Primary' },
      { value: 'secondary', label: 'Secondary' },
    ]
    const sizeItems = [
      { value: 'large', label: 'Large' },
      { value: 'medium', label: 'Medium' },
    ]

    return () => [
      h('div', { class: 'v-inspector-panel__field', 'data-test-id': 'v-inspector-panel-field-label' }, [
        h('label', { class: 'v-inspector-panel__field-label', for: 'story-label' }, 'Label'),
        h('div', { class: 'v-inspector-panel__field-control' }, [
          h('input', { id: 'story-label', value: 'Get Started' }),
        ]),
      ]),
      h('div', { class: 'v-inspector-panel__field', 'data-test-id': 'v-inspector-panel-field-variant' }, [
        h('span', { class: 'v-inspector-panel__field-label' }, 'Variant'),
        h('div', { class: 'v-inspector-panel__field-control' }, [
          h(VDropdownMenu, {
            size: 'sm',
            variant: 'secondary',
            triggerStyle: 'field',
            menuAlign: 'end',
            showTriggerIcon: false,
            value: variant.value,
            'onUpdate:value': (value: string) => { variant.value = value },
            items: variantItems.map((item) => ({ ...item, selected: item.value === variant.value })),
          }),
        ]),
      ]),
      h('div', { class: 'v-inspector-panel__field', 'data-test-id': 'v-inspector-panel-field-size' }, [
        h('span', { class: 'v-inspector-panel__field-label' }, 'Size'),
        h('div', { class: 'v-inspector-panel__field-control' }, [
          h(VDropdownMenu, {
            size: 'sm',
            variant: 'secondary',
            triggerStyle: 'field',
            menuAlign: 'end',
            showTriggerIcon: false,
            value: size.value,
            'onUpdate:value': (value: string) => { size.value = value },
            items: sizeItems.map((item) => ({ ...item, selected: item.value === size.value })),
          }),
        ]),
      ]),
    ]
  },
})

const meta = {
  title: 'containment/VInspectorPanel',
  component: VInspectorPanel,
  args: { size: 'default', variant: 'default', title: 'Inspector', open: true },
  argTypes: {
    size: { control: 'select', options: ['compact', 'default', 'wide'] },
    variant: { control: 'select', options: ['default', 'minimal', 'tabs', 'floating'] },
  },
} satisfies Meta<typeof VInspectorPanel>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
  render: (args) => ({
    setup: () => ({ args }),
    render: () => h(VInspectorPanel, args, { general: () => h(VInspectorPanelDemoFields) }),
  }),
}
export const Minimal: Story = { parameters: { docs: { description: { story: 'Variação **Minimal**. Props: `variant="minimal"`.' } } }, args: { variant: 'minimal' } }
export const Tabs: Story = { parameters: { docs: { description: { story: 'Variação **Tabs**. Props: `variant="tabs"`.' } } }, args: { variant: 'tabs' } }
export const Floating: Story = { parameters: { docs: { description: { story: 'Variação **Flutuante**. Props: `variant="floating"`.' } } }, args: { variant: 'floating' } }
export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: (args) => ({
    components: { VInspectorPanel },
    setup: () => ({ args }),
    template: `
      <div style="display: grid; gap: 16px; justify-items: end;">
        <VInspectorPanel v-bind="args" size="compact" title="Compact — 320px" />
        <VInspectorPanel v-bind="args" size="default" title="Default — 360px" />
        <VInspectorPanel v-bind="args" size="wide" title="Wide — 440px" />
      </div>
    `,
  }),
}
export const Collapsed: Story = { parameters: { docs: { description: { story: 'Variação **Recolhido**.' } } }, args: { expandedSections: [] } }
export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }
export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } } }, args: { loading: true } }
export const Closed: Story = { parameters: { docs: { description: { story: 'Variação **Fechado**. Props: `open=false`.' } } }, args: { open: false } }

export const NoCloseButton: Story = { parameters: { docs: { description: { story: 'Variação **Sem Close Button**. Props: `showClose=false`.' } } }, args: { showClose: false } }

export const NotDismissible: Story = { parameters: { docs: { description: { story: 'Variação **Not Dismissible**. Props: `dismissible=false`.' } } }, args: { dismissible: false } }
