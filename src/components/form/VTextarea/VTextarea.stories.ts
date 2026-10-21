import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VTextarea from './VTextarea.vue'

const meta = {
  title: 'form/VTextarea',
  component: VTextarea,
  args: {
    size: 'md',
    placeholder: 'Enter your text...',
    label: 'Your message',
  },
  decorators: [
    () => ({
      template: '<div style="width:100%;max-width:420px;padding:8px;overflow:visible;box-sizing:border-box;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VTextarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `label="Your message"`, `placeholder="Enter your text..."`.' } },
  },
  args: {
    label: 'Your message',
    placeholder: 'Enter your text...',
    helperText: 'We usually reply within one business day.',
  },
}

export const AutoResize: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Auto Resize**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VTextarea },
    setup() {
      const message = ref('This textarea grows automatically as you type...')
      return { message }
    },
    template: `
      <VTextarea
        v-model="message"
        label="Notes or feedback"
        placeholder="Share your thoughts..."
        :auto-resize="true"
        helper-text="Use auto-resize for a better writing experience."
      />
    `,
  }),
}

export const WithCounter: Story = {
  parameters: {
    docs: { description: { story: 'Character counter with helper text; the count updates as you type.' } },
  },
  render: (args) => ({
    components: { VTextarea },
    setup() {
      const bio = ref('Product designer based in Lisbon. I care about accessible, well-crafted interfaces.')
      return { args, bio }
    },
    template: '<VTextarea v-bind="args" v-model="bio" />',
  }),
  args: {
    label: 'Short bio',
    placeholder: 'Write a short bio...',
    counter: 160,
    helperText: 'Shown on your public profile.',
  },
}

export const OverLimit: Story = {
  parameters: {
    docs: { description: { story: 'Counter turns to the error color when the limit is exceeded.' } },
  },
  render: (args) => ({
    components: { VTextarea },
    setup() {
      const text = ref('This text is intentionally longer than the allowed limit for this field.')
      return { args, text }
    },
    template: '<VTextarea v-bind="args" v-model="text" />',
  }),
  args: {
    label: 'Tagline',
    counter: 40,
    errorMessage: 'Tagline must be 40 characters or fewer.',
  },
}

export const Error: Story = {
  parameters: {
    docs: { description: { story: 'Required field with a validation message.' } },
  },
  args: {
    label: 'Your message',
    placeholder: 'Share your thoughts...',
    errorMessage: 'Please enter a message.',
    required: true,
  },
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `label="Your message"`, `placeholder="Your message..."`, `disabled=true`.' } },
  },
  args: {
    label: 'Your message',
    modelValue: 'Comments are closed for this thread.',
    helperText: 'You no longer have permission to edit this field.',
    disabled: true,
  },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VTextarea },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <VTextarea size="sm" label="Small" placeholder="Your message..." />
        <VTextarea size="md" label="Medium" placeholder="Your message..." />
        <VTextarea size="lg" label="Large" placeholder="Your message..." />
      </div>
    `,
  }),
}

export const Readonly: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Somente leitura**. Props: `label="Read only"`, `modelValue="Read only content."`, `readonly=true`.' } },
  },
  args: {
    label: 'Read only',
    modelValue: 'Read only content.',
    readonly: true,
  },
}

export const RowsRequired: Story = { parameters: { docs: { description: { story: 'Variação **Rows obrigatório**. Props: `rows=6`, `required=true`, `label="Descrição"`.' } } }, args: { rows: 6, required: true, label: 'Descrição' } }


export const FeedbackForm: Story = {
  parameters: {
    docs: { description: { story: 'Realistic usage: required field with helper, counter and auto-resize.' } },
  },
  render: () => ({
    components: { VTextarea },
    setup() {
      const feedback = ref('')
      return { feedback }
    },
    template: `
      <VTextarea
        v-model="feedback"
        label="What could we improve?"
        placeholder="Describe your experience..."
        helper-text="Be as specific as you like."
        :counter="300"
        :auto-resize="true"
        :rows="3"
        required
      />
    `,
  }),
}

export const Resize: Story = {
  parameters: {
    docs: { description: { story: 'Resize behavior: none, vertical (default) and auto-resize.' } },
  },
  render: () => ({
    components: { VTextarea },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <VTextarea label="No resize" resize="none" placeholder="Fixed size" />
        <VTextarea label="Vertical" resize="vertical" placeholder="Drag the corner" />
        <VTextarea label="Auto resize" :auto-resize="true" placeholder="Grows as you type" />
      </div>
    `,
  }),
}
