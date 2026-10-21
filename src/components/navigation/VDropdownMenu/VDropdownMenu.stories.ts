import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VDropdownMenu from './VDropdownMenu.vue'
import { DEFAULT_DROPDOWN_ITEMS } from './mountVDropdownMenu'

const meta = {
  title: 'navigation/VDropdownMenu',
  component: VDropdownMenu,
  args: {
    size: 'md',
    variant: 'secondary',
    label: 'More options',
    items: DEFAULT_DROPDOWN_ITEMS,
  },
} satisfies Meta<typeof VDropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.' } },
  },
}

export const Primary: Story = { parameters: { docs: { description: { story: 'Variação **Primária**. Props: `variant="primary"`.' } } }, args: { variant: 'primary' } }

export const Ghost: Story = { parameters: { docs: { description: { story: 'Variação **Ghost**. Props: `variant="ghost"`.' } } }, args: { variant: 'ghost' } }

export const Destructive: Story = { parameters: { docs: { description: { story: 'Variação **Destrutiva**. Props: `variant="destructive"`.' } } }, args: { variant: 'destructive' } }

export const Small: Story = { parameters: { docs: { description: { story: 'Variação **Pequeno**. Props: `size="sm"`.' } } }, args: { size: 'sm' } }

export const Large: Story = { parameters: { docs: { description: { story: 'Variação **Grande**. Props: `size="lg"`.' } } }, args: { size: 'lg' } }

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } } }, args: { disabled: true } }

export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`.' } } }, args: { loading: true } }

export const TriggerStyleField: Story = { parameters: { docs: { description: { story: 'Variação **Trigger Style Field**. Props: `triggerStyle="field"`, `label="Selecione…"`, `value="edit"`.' } } }, args: { triggerStyle: 'field', label: 'Selecione…', value: 'edit' } }

export const MenuAlignEnd: Story = { parameters: { docs: { description: { story: 'Variação **Menu Align End**. Props: `menuAlign="end"`, `label="Alinhado ao fim"`.' } } }, args: { menuAlign: 'end', label: 'Alinhado ao fim' } }

export const NoChevron: Story = { parameters: { docs: { description: { story: 'Variação **Sem chevron**. Props: `showChevron=false`, `label="Sem chevron"`.' } } }, args: { showChevron: false, label: 'Sem chevron' } }

export const NoTriggerIcon: Story = { parameters: { docs: { description: { story: 'Variação **Sem Trigger ícone**. Props: `showTriggerIcon=false`, `label="Sem ícone"`.' } } }, args: { showTriggerIcon: false, label: 'Sem ícone' } }

const SPACER = 'min-height:300px;padding:8px'

export const AccountMenu: Story = {
  parameters: {
    docs: { description: { story: 'Menu de conta com ícones, divisor e item destrutivo ao final. Use `variant="ghost"` para gatilhos discretos em barras de navegação.' } },
  },
  args: {
    label: 'Walder Filho',
    variant: 'ghost',
    showTriggerIcon: false,
    items: [
      { value: 'profile', label: 'Meu perfil', icon: 'eye' },
      { value: 'edit', label: 'Editar conta', icon: 'edit' },
      { value: 'invite', label: 'Convidar por e-mail', icon: 'email' },
      { value: 'billing', label: 'Cobrança', icon: 'link', disabled: true },
      { value: 'div', label: '', divider: true },
      { value: 'logout', label: 'Excluir conta', icon: 'trash', destructive: true },
    ],
  },
  render: (args) => ({ components: { VDropdownMenu }, setup: () => ({ args }), template: `<div style="${SPACER}"><VDropdownMenu v-bind="args" /></div>` }),
}

export const RowActions: Story = {
  parameters: {
    docs: { description: { story: 'Ações de linha de tabela: gatilho apenas com ícone (`triggerStyle="icon"`), submenu em "Compartilhar" e exclusão destrutiva separada por divisor.' } },
  },
  args: { triggerStyle: 'icon', variant: 'ghost', label: 'Ações da linha', ariaLabel: 'Ações da linha', menuAlign: 'end' },
  render: (args) => ({ components: { VDropdownMenu }, setup: () => ({ args }), template: `<div style="${SPACER};display:flex;justify-content:flex-end;width:320px"><VDropdownMenu v-bind="args" /></div>` }),
}

export const SelectionMenu: Story = {
  parameters: {
    docs: { description: { story: 'Menu de seleção única: o item escolhido recebe destaque e marca de check; `v-model:value` mantém o valor atual.' } },
  },
  render: (args) => ({
    components: { VDropdownMenu },
    setup() {
      const value = ref('recent')
      const items = [
        { value: 'recent', label: 'Mais recentes' },
        { value: 'oldest', label: 'Mais antigos' },
        { value: 'name', label: 'Nome (A-Z)' },
        { value: 'size', label: 'Tamanho' },
      ]
      return { args, value, items }
    },
    template: `<div style="${SPACER}"><VDropdownMenu v-bind="args" label="Ordenar por" v-model:value="value" :items="items" :show-trigger-icon="false" /></div>`,
  }),
}

export const ControlledOpenAndValue: Story = {
  parameters: { docs: { description: { story: 'Abertura e valor controlados: `v-model` (aberto) e `v-model:value` (item escolhido). O estado atual é exibido abaixo apenas para demonstração.' } } },
  render: (args) => ({
    components: { VDropdownMenu },
    setup() {
      const open = ref(false)
      const value = ref('')
      return { args, open, value }
    },
    template: '<div style="min-height:300px;padding:8px"><VDropdownMenu v-bind="args" v-model="open" v-model:value="value" label="Ações" /></div>',
  }),
}
