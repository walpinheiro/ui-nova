import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import arrowUpRightIcon from '@iconify-icons/keyline-icons/arrow-up-right'
import checkIcon from '@iconify-icons/keyline-icons/check'
import chevronLeftIcon from '@iconify-icons/keyline-icons/chevron-left'
import chevronRightIcon from '@iconify-icons/keyline-icons/chevron-right'
import copyIcon from '@iconify-icons/keyline-icons/copy'
import fileIcon from '@iconify-icons/keyline-icons/file'
import fileTextIcon from '@iconify-icons/keyline-icons/file-text'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import walletIcon from '@iconify-icons/keyline-icons/wallet'
import VBadge from '../../feedback/VBadge/VBadge.vue'
import VButton from '../../form/VButton/VButton.vue'
import VSwitch from '../../form/VSwitch/VSwitch.vue'
import VAvatar from '../../images/VAvatar/VAvatar.vue'
import VGroupAvatar from '../../images/VAvatar/VGroupAvatar.vue'
import { VIcon } from '../../primitives/VIcon'
import { VTag, V_TAG_PLUS_ICON } from '../../primitives/VTag'
import VCard from './VCard.vue'

const alpineSrc =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=480&fit=crop'
const portraitSrc =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=720&h=900&fit=crop'
const portraitAltSrc =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=720&h=900&fit=crop'
const attorneySrc =
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop'

const meta = {
  title: 'containment/VCard',
  component: VCard,
  args: { size: 'md', variant: 'elevated' },
  argTypes: {
    variant: { control: 'select', options: ['elevated', 'outlined', 'filled', 'interactive'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    mediaPlacement: { control: 'select', options: ['top', 'start', 'end', 'bottom'] },
  },
} satisfies Meta<typeof VCard>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Padrão**. Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo. Props: `title="Alpine Pro"`, `description="A modern workspace for brig…"`.' } },
  },
  args: { title: 'Alpine Pro', description: 'A modern workspace for brighter ideas.' },
  render: (args) => ({
    components: { VCard },
    setup: () => ({ args }),
    template: `<VCard v-bind="args"><p>Card content goes here.</p></VCard>`,
  }),
}

export const Elevated: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Elevated**. Props: `variant="elevated"`, `title="Alpine Pro"`, `description="Robustest with shadow and d…"`.' } },
  },
  args: { variant: 'elevated', title: 'Alpine Pro', description: 'Robustest with shadow and depth.' },
  render: (args) => ({
    components: { VCard },
    setup: () => ({ args }),
    template: `<VCard v-bind="args"><p>Content.</p></VCard>`,
  }),
}

export const Outlined: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Outlined**. Props: `variant="outlined"`, `title="Alpine Pro"`, `description="Subtle border for minimal c…"`.' } },
  },
  args: { variant: 'outlined', title: 'Alpine Pro', description: 'Subtle border for minimal contexts.' },
  render: (args) => ({
    components: { VCard },
    setup: () => ({ args }),
    template: `<VCard v-bind="args"><p>Content.</p></VCard>`,
  }),
}

export const Filled: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Preenchido**. Props: `variant="filled"`, `title="Alpine Pro"`, `description="Soft background for grouped…"`.' } },
  },
  args: { variant: 'filled', title: 'Alpine Pro', description: 'Soft background for grouped content.' },
  render: (args) => ({
    components: { VCard },
    setup: () => ({ args }),
    template: `<VCard v-bind="args"><p>Content.</p></VCard>`,
  }),
}

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Interativo**. Props: `variant="interactive"`, `interactive=true`, `title="Project Alpha"`, `description="Build what’s next."`.' } },
  },
  args: { variant: 'interactive', interactive: true, title: 'Project Alpha', description: 'Build what\u2019s next.' },
  render: (args) => ({
    components: { VCard },
    setup: () => ({ args }),
    template: `<VCard v-bind="args"><p>Clickable card.</p></VCard>`,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Tamanhos**.' } },
  },
  render: () => ({
    components: { VCard },
    template: `
      <div style="display:flex;gap:16px;align-items:flex-start">
        <VCard size="sm" title="Small"><p>Compact for dense layouts.</p></VCard>
        <VCard size="md" title="Medium"><p>Balanced for most use cases.</p></VCard>
        <VCard size="lg" title="Large"><p>Spacious for rich content.</p></VCard>
      </div>`,
  }),
}

export const WithMedia: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Com Media**. Props: `title="Alpine Pro"`, `description="A modern workspace for brig…"`, `badge="Product"`. Slots usados: `#media`, `#avatar-group`, `#actions`.' } },
  },
  args: { title: 'Alpine Pro', description: 'A modern workspace for brighter ideas.', badge: 'Product' },
  render: (args) => ({
    components: { VCard, VButton, VIcon, VGroupAvatar },
    setup: () => ({
      args,
      alpineSrc,
      arrowUpRightIcon,
      members: [
        { initials: 'AL', alt: 'Alex' },
        { initials: 'JM', alt: 'Jamie' },
        { initials: 'RK', alt: 'Riley' },
        { initials: 'SA', alt: 'Sam' },
      ],
    }),
    template: `
      <VCard v-bind="args" style="max-width:360px">
        <template #media><img :src="alpineSrc" alt="Alpine Pro" /></template>
        <template #avatar-group>
          <VGroupAvatar :members="members" :max="3" size="sm" />
        </template>
        <template #actions>
          <VButton variant="icon" aria-label="Open">
            <VIcon :icon="arrowUpRightIcon" size="sm" />
          </VButton>
        </template>
      </VCard>`,
  }),
}

export const Loading: Story = { parameters: { docs: { description: { story: 'Variação **Carregando**. Props: `loading=true`, `title="Loading card"`.' } } }, args: { loading: true, title: 'Loading card' } }

export const MediaPlacement: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Media Placement**. Slots usados: `#media`, `#icon`.' } },
  },
  render: () => ({
    components: { VCard, VTag, VIcon },
    setup: () => ({ alpineSrc, portraitSrc, V_TAG_PLUS_ICON }),
    template: `
      <div style="display:grid;gap:24px">
        <VCard title="Top media" description="Default anatomy." badge="Product" data-test-id="docs-card-media-top" style="max-width:360px">
          <template #media><img :src="alpineSrc" alt="Lake in the Alps" /></template>
        </VCard>
        <VCard title="Media at the end" description="Quote or summary stays on the left." media-placement="end" data-test-id="docs-card-media-end" style="max-width:720px">
          <template #media><img :src="portraitSrc" alt="Portrait" /></template>
          <p>Use this layout for testimonials and editorials.</p>
        </VCard>
        <VCard title="Media at the bottom" description="Supporting visual under the copy." variant="filled" media-placement="bottom" data-test-id="docs-card-media-bottom" style="max-width:420px">
          <template #media>
            <div style="display:flex;gap:8px;padding:16px;align-items:center">
              <span style="width:36px;height:36px;border-radius:var(--v-radius-circle);background:var(--v-color-elevated)"></span>
              <span style="width:36px;height:36px;border-radius:var(--v-radius-circle);background:var(--v-color-success-soft)"></span>
              <VTag size="sm">
                <template #icon><VIcon :icon="V_TAG_PLUS_ICON" size="sm" /></template>
                Add Goals
              </VTag>
            </div>
          </template>
        </VCard>
      </div>`,
  }),
}

export const Selected: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Selected**. Props: `title="PDF"`, `description="Print ready"`, `selected=true`, `variant="filled"`, `size="sm"`. Slots usados: `#icon`.' } },
  },
  args: { title: 'PDF', description: 'Print ready', selected: true, variant: 'filled', size: 'sm' },
  render: (args) => ({
    components: { VCard, VIcon },
    setup: () => ({ args, fileIcon }),
    template: `
      <VCard v-bind="args" style="max-width:140px">
        <template #icon>
          <span style="width:36px;height:36px;border-radius:var(--v-radius-circle);background:var(--v-color-surface);display:inline-flex;align-items:center;justify-content:center">
            <VIcon :icon="fileIcon" size="sm" />
          </span>
        </template>
      </VCard>`,
  }),
}

export const Hero: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Hero**. Slots usados: `#media`, `#avatar-group`, `#actions`, `#footer`.' } },
  },
  render: () => ({
    components: { VCard, VButton, VIcon, VGroupAvatar },
    setup: () => ({
      alpineSrc,
      arrowUpRightIcon,
      members: [
        { initials: 'AL', alt: 'Alex' },
        { initials: 'JM', alt: 'Jamie' },
        { initials: 'RK', alt: 'Riley' },
        { initials: 'SA', alt: 'Sam' },
      ],
    }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:stretch">
        <VCard title="Alpine Pro" description="A modern workspace for brighter ideas." badge="Product">
          <template #media><img :src="alpineSrc" alt="Alpine Pro" /></template>
          <template #avatar-group>
            <VGroupAvatar :members="members" :max="3" size="sm" />
          </template>
          <template #actions>
            <VButton variant="icon" aria-label="Open">
              <VIcon :icon="arrowUpRightIcon" size="sm" />
            </VButton>
          </template>
        </VCard>
        <VCard title="Active Users" description="↑ 12% vs last month">
          <p style="margin:0;font-size:32px;font-weight:700;letter-spacing:-0.04em">12,480</p>
        </VCard>
        <VCard
          aria-label="Turn ideas into impact"
          style="background:linear-gradient(160deg, var(--v-color-primary), color-mix(in srgb, var(--v-color-primary) 55%, #0f172a)); color:#fff; border-color:transparent"
        >
          <strong style="font-size:22px;line-height:1.25">Turn ideas into impact.</strong>
          <p style="margin:0;color:rgba(255,255,255,.82)">Build faster with AI powered workflows.</p>
          <template #footer>
            <VButton>Get Started</VButton>
          </template>
        </VCard>
      </div>`,
  }),
}

export const ExportPanel: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Export Panel**. Interativo: o estado é mantido na própria story (`v-model`). Slots usados: `#footer`, `#icon`, `#caption`.' } },
  },
  name: 'Export panel',
  render: () => ({
    components: { VCard, VButton, VSwitch, VIcon },
    setup() {
      const format = ref<'pdf' | 'docx' | 'copy'>('pdf')
      const exhibitIndex = ref(true)
      const citationAppendix = ref(true)
      const formats = [
        { id: 'pdf' as const, title: 'PDF', description: 'Print ready', icon: fileIcon },
        { id: 'docx' as const, title: 'DOCX', description: 'Editable copy', icon: fileTextIcon },
        { id: 'copy' as const, title: 'Copy', description: 'To clipboard', icon: copyIcon },
      ]
      return { format, exhibitIndex, citationAppendix, formats, checkIcon }
    },
    template: `
      <div style="display:flex;justify-content:center;padding:40px 16px;background:var(--v-color-neutral-200);border-radius:24px">
        <VCard title="Export" size="md" style="width:min(100%,420px)">
          <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">
            <VCard
              v-for="item in formats"
              :key="item.id"
              size="sm"
              :variant="format === item.id ? 'filled' : 'outlined'"
              :selected="format === item.id"
              interactive
              :aria-label="item.title"
              @click="format = item.id"
            >
              <div style="display:flex;flex-direction:column;gap:8px;padding-right:12px">
                <span style="width:32px;height:32px;border-radius:var(--v-radius-circle);background:var(--v-color-surface);display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--v-color-border)">
                  <VIcon :icon="item.icon" size="sm" />
                </span>
                <strong>{{ item.title }}</strong>
                <span style="color:var(--v-color-text-muted);font-size:var(--v-font-size-text-small)">{{ item.description }}</span>
              </div>
            </VCard>
          </div>
          <div style="display:flex;flex-direction:column;gap:2px">
            <VSwitch v-model="exhibitIndex" size="sm" label="Include exhibit index" />
            <VSwitch v-model="citationAppendix" size="sm" label="Add citation appendix" />
          </div>
          <template #footer>
            <VButton>
              <template #icon><VIcon :icon="checkIcon" size="sm" /></template>
              Finalize Demand Letter
            </VButton>
          </template>
          <template #caption>Locks draft v3 and saves it to the case history.</template>
        </VCard>
      </div>`,
  }),
}

export const FinalReview: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Final Review**. Slots usados: `#header-trailing`, `#icon`.' } },
  },
  name: 'Final review',
  render: () => ({
    components: { VCard, VButton, VBadge, VAvatar, VIcon },
    setup: () => ({
      checkIcon,
      folderIcon,
      fileTextIcon,
      arrowUpRightIcon,
      attorneySrc,
    }),
    template: `
      <div style="display:flex;justify-content:center;padding:40px 16px;background:var(--v-color-neutral-200);border-radius:24px">
        <VCard title="Final Review" size="md" style="width:min(100%,460px)">
          <template #header-trailing>
            <VBadge variant="success" size="sm">
              <template #icon><VIcon :icon="checkIcon" size="sm" /></template>
              Ready
            </VBadge>
          </template>
          <VCard
            variant="filled"
            size="sm"
            style="background:color-mix(in srgb, var(--v-color-success-base) 22%, var(--v-color-surface));border-color:transparent"
          >
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
              <div>
                <div style="font-size:12px;color:var(--v-color-text-muted)">Demand</div>
                <div style="font-size:28px;font-weight:700;letter-spacing:-0.03em;line-height:1.1">$125,000</div>
              </div>
              <VButton variant="icon" aria-label="Open demand">
                <VIcon :icon="arrowUpRightIcon" size="sm" />
              </VButton>
            </div>
          </VCard>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div style="display:flex;align-items:center;gap:12px">
              <VAvatar initials="JJ" size="md" />
              <div>
                <div style="color:var(--v-color-text-muted);font-size:12px">Client</div>
                <div style="font-weight:600">James Johnson</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px">
              <span style="width:40px;height:40px;border-radius:var(--v-radius-circle);border:1px solid var(--v-color-border);display:inline-flex;align-items:center;justify-content:center">
                <VIcon :icon="folderIcon" size="sm" />
              </span>
              <div>
                <div style="color:var(--v-color-text-muted);font-size:12px">Supporting Evidence</div>
                <div style="font-weight:600">18 documents</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px">
              <span style="width:40px;height:40px;border-radius:var(--v-radius-circle);border:1px solid var(--v-color-border);display:inline-flex;align-items:center;justify-content:center">
                <VIcon :icon="fileTextIcon" size="sm" />
              </span>
              <div>
                <div style="color:var(--v-color-text-muted);font-size:12px">Citations</div>
                <div style="font-weight:600">24, all verified</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px">
              <VAvatar :src="attorneySrc" alt="Sarah Williams" size="md" />
              <div style="flex:1;min-width:0">
                <div style="color:var(--v-color-text-muted);font-size:12px">Attorney Review</div>
                <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Completed by Sarah Williams</div>
              </div>
              <span style="flex-shrink:0">
                <VBadge variant="success" size="sm">
                  <template #icon><VIcon :icon="checkIcon" size="sm" /></template>
                  Completed
                </VBadge>
              </span>
            </div>
          </div>
        </VCard>
      </div>`,
  }),
}

export const FeatureSplit: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Feature Split**. Slots usados: `#media`, `#icon`.' } },
  },
  name: 'Feature split',
  render: () => ({
    components: { VCard, VTag, VIcon },
    setup: () => ({ walletIcon, V_TAG_PLUS_ICON }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px">
        <VCard
          variant="filled"
          size="lg"
          media-placement="bottom"
          style="min-height:280px"
        >
          <strong style="font-size:22px;line-height:1.25;letter-spacing:-0.02em">Track, plan, and manage your finances effortlessly</strong>
          <p style="margin:0;color:var(--v-color-text-muted)">Stay on top of your goals with easy-to-use tools that help you create budgets and stick to them.</p>
          <template #media>
            <div style="display:flex;align-items:center;gap:10px;padding:20px 24px 24px">
              <span style="width:44px;height:44px;border-radius:var(--v-radius-circle);background:var(--v-color-surface);display:inline-flex;align-items:center;justify-content:center">
                <VIcon :icon="walletIcon" size="md" />
              </span>
              <span style="width:44px;height:44px;border-radius:var(--v-radius-circle);background:var(--v-color-success-soft);color:var(--v-color-success-strong);display:inline-flex;align-items:center;justify-content:center">
                <VIcon :icon="walletIcon" size="md" />
              </span>
              <VTag size="sm">
                <template #icon><VIcon :icon="V_TAG_PLUS_ICON" size="sm" /></template>
                Add Goals
              </VTag>
            </div>
          </template>
        </VCard>
        <VCard
          variant="filled"
          size="lg"
          media-placement="bottom"
          style="min-height:280px"
        >
          <strong style="font-size:22px;line-height:1.25;letter-spacing:-0.02em">Personalized analytics to optimize your spending</strong>
          <p style="margin:0;color:var(--v-color-text-muted)">Gain valuable insights into your financial habits and uncover opportunities to save and invest smarter.</p>
          <template #media>
            <div style="padding:8px 24px 20px;display:grid;gap:8px">
              <div style="display:flex;justify-content:space-between;align-items:flex-end;font-size:12px;color:var(--v-color-text-muted)">
                <span>Total bill<br /><strong style="color:var(--v-color-text);font-size:18px">$13,245.00</strong></span>
                <span>$789.00</span>
              </div>
              <div style="display:flex;align-items:flex-end;gap:8px;height:96px">
                <span style="flex:1;height:28%;background:var(--v-color-primary);border-radius:6px 6px 0 0;opacity:.45"></span>
                <span style="flex:1;height:46%;background:var(--v-color-primary);border-radius:6px 6px 0 0;opacity:.55"></span>
                <span style="flex:1;height:38%;background:var(--v-color-primary);border-radius:6px 6px 0 0;opacity:.4"></span>
                <span style="flex:1;height:100%;background:var(--v-color-warning-base);border-radius:6px 6px 0 0"></span>
              </div>
            </div>
          </template>
        </VCard>
      </div>`,
  }),
}

export const GradientCta: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Gradient Cta**. Slots usados: `#footer`.' } },
  },
  name: 'Gradient CTA',
  render: () => ({
    components: { VCard, VButton, VIcon },
    setup: () => ({ sparklesIcon }),
    template: `
      <VCard
        size="lg"
        aria-label="Get the Payer Mobile App"
        style="text-align:center;background:linear-gradient(90deg,var(--v-color-warning-soft) 0%,var(--v-color-surface) 42%,var(--v-color-primary-100) 100%);border-color:transparent;box-shadow:none"
      >
        <div style="display:grid;gap:12px;justify-items:center">
          <span style="width:48px;height:48px;border-radius:14px;background:var(--v-color-primary);color:#fff;display:inline-flex;align-items:center;justify-content:center">
            <VIcon :icon="sparklesIcon" size="md" />
          </span>
          <strong style="font-size:28px;line-height:1.2;letter-spacing:-0.03em">Get the Payer Mobile App</strong>
          <p style="margin:0;max-width:32rem;color:var(--v-color-text-muted)">
            With this platform, you can access your account anywhere, anytime for balance and so much more
          </p>
        </div>
        <template #footer>
          <div style="display:flex;justify-content:center;width:100%">
            <VButton variant="secondary">Download app</VButton>
          </div>
        </template>
      </VCard>`,
  }),
}

export const TestimonialSlider: Story = {
  parameters: {
    docs: { description: { story: 'Variação **Testimonial Slider**. Interativo: o estado é mantido na própria story (`v-model`). Slots usados: `#media`, `#media-overlay`.' } },
  },
  name: 'Testimonial slider',
  render: () => ({
    components: { VCard, VButton, VIcon },
    setup() {
      const index = ref(0)
      const slides = [
        {
          heading: '10 Million People Trust Us to Protect and Grow Their Finance!',
          quote:
            'As an investor, tracking my portfolio was tough—until this platform. Its detailed analytics provide the insights I need for smarter decisions.',
          name: 'Aryan Malhotra',
          role: 'Business Development Executive',
          photo: portraitSrc,
        },
        {
          heading: 'Clarity for every financial decision you make.',
          quote:
            'Budgets, goals, and analytics live in one place. I finally spend less time switching tools and more time acting on the numbers.',
          name: 'Maya Chen',
          role: 'Product Lead',
          photo: portraitAltSrc,
        },
      ]
      const prev = () => {
        index.value = (index.value - 1 + slides.length) % slides.length
      }
      const next = () => {
        index.value = (index.value + 1) % slides.length
      }
      return { index, slides, prev, next, chevronLeftIcon, chevronRightIcon }
    },
    template: `
      <div style="display:grid;gap:28px;max-width:960px;padding:8px;background:var(--v-color-surface);border-radius:16px">
        <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,40%);gap:28px;align-items:start">
          <div>
            <h2 style="margin:0 0 16px;font-size:28px;line-height:1.2;letter-spacing:-0.03em">
              {{ slides[index].heading }}
            </h2>
            <p style="margin:0 0 20px;color:var(--v-color-text-muted);font-size:15px;line-height:1.6">
              “ {{ slides[index].quote }} ”
            </p>
            <div style="display:flex;gap:8px">
              <VButton variant="icon" aria-label="Previous testimonial" @click="prev">
                <VIcon :icon="chevronLeftIcon" size="sm" />
              </VButton>
              <VButton variant="icon" aria-label="Next testimonial" @click="next">
                <VIcon :icon="chevronRightIcon" size="sm" />
              </VButton>
            </div>
          </div>
          <VCard size="sm">
            <template #media>
              <img :src="slides[index].photo" :alt="slides[index].name" style="height:280px;object-fit:cover" />
            </template>
            <template #media-overlay>
              <VCard size="sm">
                <div style="font-weight:600">{{ slides[index].name }}</div>
                <div style="color:var(--v-color-text-muted);font-size:12px">{{ slides[index].role }}</div>
              </VCard>
            </template>
          </VCard>
        </div>
      </div>`,
  }),
}

export const RefineFrameQueued: Story = { parameters: { docs: { description: { story: 'Variação **Refine Frame Queued**. Props: `title="Imagem"`, `description="Estágio: queued"`, `refineFrame="queued"`.' } } }, args: { title: 'Imagem', description: 'Estágio: queued', refineFrame: 'queued' } }

export const RefineFrameGenerating: Story = { parameters: { docs: { description: { story: 'Variação **Refine Frame Generating**. Props: `title="Imagem"`, `description="Estágio: generating"`, `refineFrame="generating"`.' } } }, args: { title: 'Imagem', description: 'Estágio: generating', refineFrame: 'generating' } }

export const RefineFrameRefining: Story = { parameters: { docs: { description: { story: 'Variação **Refine Frame Refining**. Props: `title="Imagem"`, `description="Estágio: refining"`, `refineFrame="refining"`.' } } }, args: { title: 'Imagem', description: 'Estágio: refining', refineFrame: 'refining' } }

export const RefineFrameComplete: Story = { parameters: { docs: { description: { story: 'Variação **Refine Frame Complete**. Props: `title="Imagem"`, `description="Estágio: complete"`, `refineFrame="complete"`.' } } }, args: { title: 'Imagem', description: 'Estágio: complete', refineFrame: 'complete' } }
