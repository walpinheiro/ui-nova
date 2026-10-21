import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'
import { ref, watch } from 'vue'
import VCheckbox from './VCheckbox.vue'

const meta = {
  title: 'form/VCheckbox',
  component: VCheckbox,
  args: {
    size: 'md',
    label: 'Product updates',
    modelValue: false,
  },
  argTypes: {
    modelValue: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  render: (args) => {
    const [, updateArgs] = useArgs<typeof args>()

    return {
      components: { VCheckbox },
      setup() {
        const model = ref(args.modelValue ?? false)

        watch(
          () => args.modelValue,
          (value) => {
            model.value = value ?? false
          },
        )

        watch(model, (value) => {
          updateArgs({ modelValue: value })
        })

        return { args, model }
      },
      template: '<VCheckbox v-bind="args" v-model="model" />',
    }
  },
  decorators: [
    () => ({
      template: '<div style="width:100%;max-width:420px;padding:8px;overflow:visible;box-sizing:border-box;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `label="Product updates"`, `description="Get the latest feature rele…"`.' } },
  },
  args: {
    label: 'Product updates',
    description: 'Get the latest feature releases and improvements.',
  },
}

export const Checked: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Marcado**. Props: `modelValue=true`, `label="Security alerts"`, `description="Important updates about you…"`.' } },
  },
  args: {
    modelValue: true,
    label: 'Security alerts',
    description: 'Important updates about your account security.',
  },
}

export const Indeterminate: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Indeterminado**. Props: `indeterminate=true`, `label="Weekly digest"`, `description="A summary of what\'s new, se…"`.' } },
  },
  args: {
    indeterminate: true,
    label: 'Weekly digest',
    description: "A summary of what's new, sent every Monday.",
  },
}

export const WithLink: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com link**. Props: `label="I agree to the"`, `linkLabel="Terms of Service"`, `linkHref="#terms"`. Slots usados: `#terms`.' } },
  },
  args: {
    label: 'I agree to the',
    linkLabel: 'Terms of Service',
    linkHref: '#terms',
  },
}

export const WithHelper: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com texto de apoio**. Props: `modelValue=true`, `label="Enable two-factor authentic…"`, `description="Add an extra layer of secur…"`, `helperText="We\'ll only use this for acc…"`.' } },
  },
  args: {
    modelValue: true,
    label: 'Enable two-factor authentication',
    description: 'Add an extra layer of security to your account.',
    helperText: "We'll only use this for account security.",
  },
}

export const Error: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Erro**. Props: `label="I agree to the Terms of Ser…"`, `errorMessage="You must accept the terms t…"`.' } },
  },
  args: {
    label: 'I agree to the Terms of Service',
    errorMessage: 'You must accept the terms to continue.',
  },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `modelValue=true`, `disabled=true`, `label="Marketing emails"`, `description="Receive tips, stories and p…"`.' } },
  },
  args: {
    modelValue: true,
    disabled: true,
    label: 'Marketing emails',
    description: 'Receive tips, stories and product news.',
  },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VCheckbox },
    setup() {
      const sm = ref(true)
      const md = ref(true)
      const lg = ref(true)
      return { sm, md, lg }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:420px">
        <VCheckbox v-model="sm" size="sm" label="Small checkbox" />
        <VCheckbox v-model="md" size="md" label="Medium checkbox" />
        <VCheckbox v-model="lg" size="lg" label="Large checkbox" />
      </div>
    `,
  }),
}

export const NotificationPreferences: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Notification Preferences**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VCheckbox },
    setup() {
      const product = ref(true)
      const marketing = ref(false)
      const security = ref(true)
      const digest = ref(false)
      const digestMixed = ref(true)
      return { product, marketing, security, digest, digestMixed }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:420px;padding:16px;border:1px solid var(--v-color-border);border-radius:12px;background:var(--v-color-surface)">
        <strong style="font-size:14px">Notification preferences</strong>
        <VCheckbox v-model="product" label="Product updates" description="Get the latest feature releases and improvements." />
        <VCheckbox v-model="marketing" label="Marketing emails" description="Receive tips, stories and product news." />
        <VCheckbox v-model="security" label="Security alerts" description="Important updates about your account security." />
        <VCheckbox v-model="digest" :indeterminate="digestMixed && !digest" label="Weekly digest" description="A summary of what's new, sent every Monday." />
      </div>
    `,
  }),
}

export const Required: Story = { parameters: { docs: { description: { story: 'Variação **Obrigatório**. Props: `required=true`, `label="Aceito os termos"`.' } } }, args: { required: true, label: 'Aceito os termos' } }

export const StrikeThroughExpressive: Story = { parameters: { docs: { description: { story: 'Variação **Strike Through Expressive**. Props: `motion="expressive"`, `strikeThrough=true`, `doneOpacity=0.4`, `label="Tarefa concluída"`, `modelValue=true`.' } } }, args: { motion: 'expressive', strikeThrough: true, doneOpacity: 0.4, label: 'Tarefa concluída', modelValue: true } }
