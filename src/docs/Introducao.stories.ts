import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VButton from '../components/form/VButton/VButton.vue'
import VTextInput from '../components/form/VTextInput/VTextInput.vue'
import VAlert from '../components/feedback/VAlert/VAlert.vue'
import VBadge from '../components/feedback/VBadge/VBadge.vue'

const meta = {
  title: 'Docs/Introdução',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const UsoBasico: Story = {
  name: 'Uso básico',
  parameters: {
    docs: {
      description: { story: 'Formulário mínimo com `VTextInput`, `VButton` e `VAlert`, ligado por `v-model`.' },
      source: {
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { VButton, VTextInput, VAlert } from 'vueui-nova-kit'
const email = ref('')
const sent = ref(false)
</script>

<template>
  <VTextInput v-model="email" label="E-mail" placeholder="voce@empresa.com" />
  <VButton variant="primary" @click="sent = true">Enviar</VButton>
  <VAlert v-if="sent" variant="success" title="Enviado" />
</template>`,
      },
    },
  },
  render: () => ({
    components: { VButton, VTextInput, VAlert, VBadge },
    setup() {
      const email = ref('')
      const sent = ref(false)
      return { email, sent }
    },
    template: `<div style="display:grid;gap:12px;max-width:380px">
      <VTextInput v-model="email" label="E-mail" placeholder="voce@empresa.com" />
      <div style="display:flex;gap:8px;align-items:center"><VButton variant="primary" @click="sent = true">Enviar</VButton><VBadge v-if="email">{{ email }}</VBadge></div>
      <VAlert v-if="sent" variant="success" title="Enviado" description="Obrigado!" />
    </div>`,
  }),
}
