import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VRadioGroup from './VRadioGroup.vue'

const notificationOptions = [
  { value: 'email', label: 'Email notifications', description: 'Get notified via email' },
  { value: 'push', label: 'Push notifications', description: 'Get notified on your device' },
  { value: 'sms', label: 'SMS notifications', description: 'Get text message alerts' },
]

const billingOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'lifetime', label: 'Lifetime' },
]

const planOptions = [
  { value: 'personal', label: 'Personal plan', description: 'For individuals' },
  { value: 'team', label: 'Team plan', description: 'For small teams' },
  { value: 'enterprise', label: 'Enterprise', description: 'For large organizations' },
]

const cardOptions = [
  { value: 'free', label: 'Free', description: 'For getting started' },
  { value: 'pro', label: 'Pro', description: 'More features' },
  { value: 'business', label: 'Business', description: 'Advanced controls' },
]

const meta = {
  title: 'form/VRadioGroup',
  component: VRadioGroup,
  args: {
    size: 'md',
    layout: 'vertical',
    options: notificationOptions,
    label: 'Notification method',
  },
  decorators: [
    () => ({
      template: '<div style="width:100%;max-width:480px;padding:8px;overflow:visible;box-sizing:border-box;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `modelValue="email"`, `label="Notification method"`.' } },
  },
  args: {
    modelValue: 'email',
    label: 'Notification method',
    options: notificationOptions,
  },
}

export const Vertical: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Vertical**. Props: `modelValue="email"`, `label="Choose a notification chann…"`, `layout="vertical"`.' } },
  },
  args: {
    modelValue: 'email',
    label: 'Choose a notification channel',
    options: notificationOptions,
    layout: 'vertical',
  },
}

export const Horizontal: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Horizontal**. Props: `modelValue="monthly"`, `label="Billing cycle"`, `layout="horizontal"`.' } },
  },
  args: {
    modelValue: 'monthly',
    label: 'Billing cycle',
    options: billingOptions,
    layout: 'horizontal',
  },
}

export const Card: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Card**. Props: `modelValue="free"`, `label="Choose a plan"`, `layout="card"`.' } },
  },
  args: {
    modelValue: 'free',
    label: 'Choose a plan',
    options: cardOptions,
    layout: 'card',
  },
}

export const Plans: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Plans**. Props: `modelValue="personal"`, `label="Choose a plan"`.' } },
  },
  args: {
    modelValue: 'personal',
    label: 'Choose a plan',
    options: planOptions,
  },
}

export const Error: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Erro**. Props: `modelValue=""`, `label="Choose a plan"`, `required=true`, `errorMessage="Please select a plan to con…"`.' } },
  },
  args: {
    modelValue: '',
    label: 'Choose a plan',
    options: planOptions,
    required: true,
    errorMessage: 'Please select a plan to continue.',
  },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `modelValue="team"`, `label="Choose a plan"`, `disabled=false`.' } },
  },
  args: {
    modelValue: 'team',
    label: 'Choose a plan',
    options: planOptions.map((option, index) => ({
      ...option,
      disabled: index === 1,
    })),
    disabled: false,
  },
}

export const GroupDisabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Grupo desabilitado**. Props: `modelValue="email"`, `label="Notification method"`, `disabled=true`.' } },
  },
  args: {
    modelValue: 'email',
    label: 'Notification method',
    options: notificationOptions,
    disabled: true,
  },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VRadioGroup },
    setup() {
      const sm = ref('email')
      const md = ref('email')
      const lg = ref('email')
      return { sm, md, lg, notificationOptions }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:20px;max-width:480px">
        <VRadioGroup v-model="sm" size="sm" label="Small" :options="notificationOptions" />
        <VRadioGroup v-model="md" size="md" label="Medium" :options="notificationOptions" />
        <VRadioGroup v-model="lg" size="lg" label="Large" :options="notificationOptions" />
      </div>
    `,
  }),
}
