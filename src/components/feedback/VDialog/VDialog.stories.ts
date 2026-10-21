import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VButton from '../../form/VButton/VButton.vue'
import VTextInput from '../../form/VTextInput/VTextInput.vue'
import VTextarea from '../../form/VTextarea/VTextarea.vue'
import VDialog from './VDialog.vue'

const meta = {
  title: 'feedback/VDialog',
  component: VDialog,
  args: {
    modelValue: false,
    title: 'Dialog title',
    description: 'Supporting description goes here.',
    size: 'md',
    variant: 'basic',
  },
  argTypes: {
    modelValue: { control: 'boolean' },
    open: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['basic', 'confirmation', 'alert', 'form', 'fullscreen'] },
    intent: { control: 'inline-radio', options: ['neutral', 'destructive', 'success'] },
  },
  decorators: [
    () => ({
      template: '<div style="min-height: 240px; padding: 24px; overflow: hidden;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof VDialog>

export default meta
type Story = StoryObj<typeof meta>

function dialogActivator(args: Record<string, unknown>, triggerLabel = 'Open Dialog'): Story {
  return {
    args,
    render: (storyArgs) => ({
      components: { VButton, VDialog },
      setup() {
        const isOpen = ref(false)
        return { args: storyArgs, isOpen, triggerLabel }
      },
      template: `
        <VButton data-test-id="dialog-trigger-open" @click="isOpen = true">{{ triggerLabel }}</VButton>
        <VDialog v-bind="args" v-model="isOpen">
          <p>Custom content can include text, forms, or any application surface.</p>
          <template #actions>
            <VButton variant="ghost" data-test-id="dialog-action-cancel" @click="isOpen = false">Cancel</VButton>
            <VButton data-test-id="dialog-action-confirm" @click="isOpen = false">Confirm</VButton>
          </template>
        </VDialog>
      `,
    }),
  }
}

function confirmationActivator(args: Record<string, unknown>, triggerLabel = 'Open confirm dialog'): Story {
  return {
    args: { variant: 'confirmation', ...args },
    render: (storyArgs) => ({
      components: { VButton, VDialog },
      setup() {
        const isOpen = ref(false)
        return { args: storyArgs, isOpen, triggerLabel }
      },
      template: `
        <VButton data-test-id="dialog-trigger-open" @click="isOpen = true">{{ triggerLabel }}</VButton>
        <VDialog v-bind="args" v-model="isOpen" @confirm="isOpen = false" />
      `,
    }),
  }
}

export const Default: Story = dialogActivator({ variant: 'basic' })
export const Confirmation: Story = confirmationActivator({
  title: 'Delete this project?',
  description: 'This action cannot be undone. This will permanently delete “Design System” and all of its data.',
  intent: 'destructive',
  confirmText: 'Delete project',
})
export const ConfirmationNeutral: Story = confirmationActivator({
  title: 'Discard changes?',
  description: 'You have unsaved changes. Are you sure you want to discard them?',
  confirmText: 'Discard',
  intent: 'neutral',
})
export const ConfirmationSuccess: Story = confirmationActivator({
  title: 'Publish changes?',
  description: 'This will make your project visible to everyone on your team.',
  confirmText: 'Publish',
  intent: 'success',
})
export const Alert: Story = {
  parameters: { docs: { description: { story: '`variant="alert"`: avisa algo que já aconteceu. Uma única ação (sem Cancelar), ícone de atenção.' } } },
  ...confirmationActivator(
    {
      variant: 'alert',
      title: 'Connection lost',
      description: 'Your changes are saved locally. Reconnect to keep syncing with your team.',
      confirmText: 'Got it',
    },
    'Open alert dialog',
  ),
}

export const Form: Story = {
  parameters: { docs: { description: { story: '`variant="form"`: conteúdo com campos no corpo e as ações no slot `#actions`.' } } },
  render: () => ({
    components: { VButton, VDialog, VTextInput, VTextarea },
    setup() {
      const isOpen = ref(false)
      const name = ref('Alex Chen')
      const email = ref('alex@nova.dev')
      const bio = ref('')
      return { isOpen, name, email, bio }
    },
    template: `
      <VButton data-test-id="dialog-trigger-open" @click="isOpen = true">Edit profile</VButton>
      <VDialog v-model="isOpen" variant="form" title="Edit profile" description="Update your details before saving.">
        <VTextInput v-model="name" label="Full name" />
        <VTextInput v-model="email" label="Email" type="email" />
        <VTextarea v-model="bio" label="Bio" placeholder="A short introduction" />
        <template #actions>
          <VButton variant="ghost" data-test-id="dialog-action-cancel" @click="isOpen = false">Cancel</VButton>
          <VButton data-test-id="dialog-action-confirm" @click="isOpen = false">Save changes</VButton>
        </template>
      </VDialog>
    `,
  }),
}
export const Fullscreen: Story = dialogActivator({
  variant: 'fullscreen',
  title: 'Workspace',
  description: 'Immersive content for complex tasks.',
})

export const Small: Story = dialogActivator({ size: 'sm' })
export const Large: Story = dialogActivator({ size: 'lg' })
export const Closed: Story = { parameters: { docs: { description: { story: 'Variação **Fechado**. Props: `modelValue=false`.' } } }, args: { modelValue: false } }

export const ConfirmationWithBody: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Confirmation com Body**. Interativo: o estado é mantido na própria story (`v-model`).' } },
  },
  render: (args) => ({
    components: { VButton, VDialog },
    setup() {
      const isOpen = ref(false)
      return { args, isOpen }
    },
    template: `
      <VButton @click="isOpen = true">Open confirm dialog</VButton>
      <VDialog
        v-bind="args"
        v-model="isOpen"
        variant="confirmation"
        intent="destructive"
        title="Delete this project?"
        confirm-text="Delete project"
        @confirm="isOpen = false"
      >
        <ul>
          <li>All project files will be removed.</li>
          <li>Team access will be revoked.</li>
        </ul>
      </VDialog>
    `,
  }),
}

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Interativo**. Interativo: o estado é mantido na própria story (`v-model`). Slots usados: `#actions`.' } },
  },
  render: () => ({
    components: { VButton, VDialog },
    setup() {
      const isOpen = ref(false)
      return { isOpen }
    },
    template: `
      <div style="padding: 24px;">
        <VButton data-test-id="dialog-trigger-open" @click="isOpen = true">Open Dialog</VButton>
        <VDialog v-model="isOpen" title="Turn on notifications?" description="Get notified about product updates, new features, and important activity.">
          <template #actions>
            <VButton variant="ghost" data-test-id="dialog-action-cancel" @click="isOpen = false">Not now</VButton>
            <VButton data-test-id="dialog-action-confirm" @click="isOpen = false">Enable notifications</VButton>
          </template>
        </VDialog>
      </div>
    `,
  }),
}

export const Persistent: Story = { parameters: { docs: { description: { story: 'Variação **Persistent**. Props: `open=true`, `variant="confirmation"`, `persistent=true`, `title="Persistente"`, `description="Backdrop e Esc não fecham."`.' } } }, args: { open: true, variant: 'confirmation', persistent: true, title: 'Persistente', description: 'Backdrop e Esc não fecham.' } }

export const NoCloseButton: Story = { parameters: { docs: { description: { story: 'Variação **Sem Close Button**. Props: `open=true`, `showClose=false`, `title="Sem botão de fechar"`.' } } }, args: { open: true, showClose: false, title: 'Sem botão de fechar' } }

export const NotDismissible: Story = { parameters: { docs: { description: { story: 'Variação **Not Dismissible**. Props: `open=true`, `dismissible=false`, `title="Não dispensável"`.' } } }, args: { open: true, dismissible: false, title: 'Não dispensável' } }

export const CustomActionTexts: Story = { parameters: { docs: { description: { story: 'Variação **Personalizado Action Texts**. Props: `open=true`, `variant="confirmation"`, `cancelText="Voltar"`, `confirmText="Publicar"`, `title="Publicar alterações?"`.' } } }, args: { open: true, variant: 'confirmation', cancelText: 'Voltar', confirmText: 'Publicar', title: 'Publicar alterações?' } }
