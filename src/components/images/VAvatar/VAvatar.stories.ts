import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VAvatar from './VAvatar.vue'
import VGroupAvatar from './VGroupAvatar.vue'

const meta = {
  parameters: {
    docs: { description: { component: 'Representar pessoas, times ou entidades: ajuda a reconhecer "quem é quem", mostra presença (online/busy) e dá toque humano ao produto. Hero: "PRIMARY ACTION — Show people, teams, and presence. Avatars bring your product to life." Três atributos: **Recognizable** (pessoas, times e marcas), **Flexible** (imagens, iniciais e ícones), **Expressive** (estados de presença e uso contextual). Anotação: "Real people.' } },
  },
  title: 'images/VAvatar',
  component: VAvatar,
  tags: ['autodocs'],
  args: { size: 'md', shape: 'circle' },
} satisfies Meta<typeof VAvatar>

export default meta
type Story = StoryObj<typeof meta>

const sampleSrc = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop'

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `alt="Jane Doe"`, `status="online"`.' } },
  },
  args: { src: sampleSrc, alt: 'Jane Doe', status: 'online' },
}

export const Hero: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Hero**.' } },
  },
  render: () => ({
    components: { VAvatar, VGroupAvatar },
    template: `
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <VAvatar :src="src" alt="Jane Doe" status="online" />
        <VGroupAvatar :members="group" :max="2" />
        <VAvatar :src="src" alt="Busy user" status="busy" />
        <VAvatar initials="JD" alt="Jane Doe" />
      </div>
    `,
    setup() {
      return {
        src: sampleSrc,
        group: [
          { src: sampleSrc, alt: 'A' },
          { src: sampleSrc, alt: 'B' },
          { src: sampleSrc, alt: 'C' },
          { src: sampleSrc, alt: 'D' },
          { src: sampleSrc, alt: 'E' },
        ],
      }
    },
  }),
}

export const Variants: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Variantes**.' } },
  },
  render: () => ({
    components: { VAvatar, VGroupAvatar },
    template: `
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <VAvatar :src="src" alt="Photo" />
        <VAvatar initials="JD" alt="Jane Doe" />
        <VAvatar alt="Icon fallback" />
        <VGroupAvatar :members="group" :max="2" />
        <VGroupAvatar :members="team" :max="3" />
        <VAvatar :src="src" alt="Pro" badge="pro" />
        <VAvatar :src="src" alt="Square" shape="square" />
      </div>
    `,
    setup() {
      return {
        src: sampleSrc,
        group: [{ src: sampleSrc }, { src: sampleSrc }, { initials: 'C' }, { initials: 'D' }, { initials: 'E' }],
        team: [{ initials: 'A' }, { initials: 'B' }, { initials: 'C' }],
      }
    },
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VAvatar },
    template: `
      <div style="display:flex;gap:12px;align-items:center">
        <VAvatar :src="src" alt="XS" size="xs" status="online" />
        <VAvatar :src="src" alt="SM" size="sm" status="online" />
        <VAvatar :src="src" alt="MD" size="md" status="online" />
        <VAvatar :src="src" alt="LG" size="lg" status="online" />
        <VAvatar :src="src" alt="XL" size="xl" status="online" />
      </div>
    `,
    setup: () => ({ src: sampleSrc }),
  }),
}

export const States: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Estados**.' } },
  },
  render: () => ({
    components: { VAvatar },
    template: `
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <VAvatar :src="src" alt="Default" />
        <VAvatar :src="src" alt="Selectable" selectable />
        <VAvatar :src="src" alt="Selected" selectable selected />
        <VAvatar :src="src" alt="Online" status="online" />
        <VAvatar :src="src" alt="Busy" status="busy" />
        <VAvatar alt="Loading" loading />
        <VAvatar initials="JD" alt="Fallback" />
      </div>
    `,
    setup: () => ({ src: sampleSrc }),
  }),
}

export const Selectable: Story = { parameters: { docs: { description: { story: 'Variação **Selectable**. Props: `initials="AC"`, `selectable=true`, `selected=true`.' } } }, args: { initials: 'AC', selectable: true, selected: true } }

export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `initials="AC"`, `loading=true`.' } } }, args: { initials: 'AC', loading: true } }

export const Decorative: Story = { parameters: { docs: { description: { story: 'Variação **Decorative**. Props: `initials="AC"`, `decorative=true`.' } } }, args: { initials: 'AC', decorative: true } }
