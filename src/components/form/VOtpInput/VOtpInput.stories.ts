import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VOtpInput from './VOtpInput.vue'

const meta = {
  title: 'form/VOtpInput',
  component: VOtpInput,
  args: {
    length: 6,
    size: 'md',
    ariaLabel: 'Verification code',
  },
  decorators: [
    () => ({
      template: '<div style="padding:8px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VOtpInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `modelValue="240186"`.' } },
  },
  args: { modelValue: '240186' },
}

export const FourDigits: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Four Digits**. Props: `length=4`, `modelValue="1234"`.' } },
  },
  args: { length: 4, modelValue: '1234' },
}

export const Masked: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Masked**. Props: `masked=true`, `modelValue="123456"`.' } },
  },
  args: { masked: true, modelValue: '123456' },
}

export const Error: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Erro**. Props: `modelValue="123"`, `errorMessage="Invalid verification code"`.' } },
  },
  args: { modelValue: '123', errorMessage: 'Invalid verification code' },
}

export const Success: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Sucesso**. Props: `modelValue="240186"`, `success=true`.' } },
  },
  args: { modelValue: '240186', success: true },
}

export const WithResend: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Resend**. Props: `helperText="Didn\'t receive the code?"`, `resendLabel="Resend code"`, `resendCooldown=23`.' } },
  },
  args: {
    helperText: "Didn't receive the code?",
    resendLabel: 'Resend code',
    resendCooldown: 23,
  },
}

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Interativo**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VOtpInput },
    setup() {
      const code = ref('')
      const onComplete = (value: string) => {
        console.log('complete', value)
      }
      return { code, onComplete }
    },
    template: `
      <VOtpInput
        v-model="code"
        auto-submit
        helper-text="We've sent a 6-digit code to alex@company.com."
        resend-label="Resend code"
        :resend-cooldown="23"
        @complete="onComplete"
      />
    `,
  }),
}

export const AutoSubmit: Story = { parameters: { docs: { description: { story: 'Variação **Auto Submit**. Props: `length=6`, `autoSubmit=true`, `helperText="Envia ao completar os 6 díg…"`.' } } }, args: { length: 6, autoSubmit: true, helperText: 'Envia ao completar os 6 dígitos' } }

export const SeparatorIndex: Story = { parameters: { docs: { description: { story: 'Variação **Separator Index**. Props: `length=6`, `separatorIndex=3`.' } } }, args: { length: 6, separatorIndex: 3 } }

export const Disabled: Story = { parameters: { docs: { description: { story: 'Variação **Desabilitado**. Props: `length=6`, `disabled=true`, `modelValue="123"`.' } } }, args: { length: 6, disabled: true, modelValue: '123' } }
