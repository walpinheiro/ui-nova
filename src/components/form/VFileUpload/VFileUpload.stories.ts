import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VFileUpload from './VFileUpload.vue'

const meta = {
  title: 'form/VFileUpload',
  component: VFileUpload,
  args: {
    size: 'md',
    multiple: true,
    accept: 'image/*,.pdf',
    maxSize: 10 * 1024 * 1024,
  },
  decorators: [
    () => ({
      template: '<div style="padding:24px;max-width:560px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VFileUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Dropzone: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Dropzone**. Props: `variant="dropzone"`.' } },
  },
  args: { variant: 'dropzone' },
}

export const ButtonTrigger: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Button Trigger**. Props: `variant="button"`.' } },
  },
  args: { variant: 'button' },
}

export const CompactList: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Compact List**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: () => ({
    components: { VFileUpload },
    setup() {
      const files = ref<File[]>([])
      return { files }
    },
    template: '<VFileUpload v-model="files" variant="compact" :multiple="false" />',
  }),
}

export const ImageUpload: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Imagem Upload**. Props: `variant="image"`, `accept="image/*"`, `multiple=true`.' } },
  },
  args: { variant: 'image', accept: 'image/*', multiple: true },
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VFileUpload },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <VFileUpload variant="button" size="sm" />
        <VFileUpload variant="button" size="md" />
        <VFileUpload variant="button" size="lg" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Desabilitado**. Props: `disabled=true`.' } },
  },
  args: { disabled: true },
}

export const CustomTexts: Story = { parameters: { docs: { description: { story: 'Variação **Personalizado Texts**. Props: `variant="dropzone"`, `label="Anexos"`, `helperText="PNG ou PDF até 5 MB"`, `dropzoneTitle="Solte seus arquivos aqui"`, `dropzoneHint="ou clique para escolher"`.' } } }, args: { variant: 'dropzone', label: 'Anexos', helperText: 'PNG ou PDF até 5 MB', dropzoneTitle: 'Solte seus arquivos aqui', dropzoneHint: 'ou clique para escolher', buttonLabel: 'Escolher arquivos' } }

export const AutoUploadSimulated: Story = { parameters: { docs: { description: { story: 'Variação **Auto Upload Simulated**. Props: `variant="dropzone"`, `autoUpload=true`, `simulateUpload=true`, `multiple=true`.' } } }, args: { variant: 'dropzone', autoUpload: true, simulateUpload: true, multiple: true } }
