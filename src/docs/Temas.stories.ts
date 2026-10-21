import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, onBeforeUnmount, ref } from 'vue'
import { useTheme } from '../composables/useTheme'
import { KNOWN_TOKENS, listTokens, resetTokens, setToken } from '../tokens/live'
import VButton from '../components/form/VButton/VButton.vue'
import VBadge from '../components/feedback/VBadge/VBadge.vue'
import VAlert from '../components/feedback/VAlert/VAlert.vue'
import VTextInput from '../components/form/VTextInput/VTextInput.vue'
import SemanticTokenTable from './_shared/SemanticTokenTable.vue'

const meta = {
  title: 'Docs/Temas',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Temas light/dark/system, `useTheme()` e a API de tokens ao vivo (`setToken`, `resetTokens`, `listTokens`).',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const Sample = defineComponent({
  components: { VButton, VBadge, VAlert, VTextInput },
  template: `<div style="display:grid;gap:12px;max-width:420px;">
    <VAlert variant="info" title="Componentes seguem o tema" description="Cores vêm dos tokens --v-*." />
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <VButton variant="primary">Primary</VButton><VButton variant="outline">Outline</VButton><VBadge>Badge</VBadge>
    </div>
  </div>`,
})

/** README: useTheme() — `target` local para não brigar com a toolbar do Storybook. */
export const UseThemeDemo: Story = {
  name: 'useTheme() ao vivo',
  parameters: {
    docs: {
      description: {
        story:
          'Demo de `useTheme()`. Aqui `target` aponta para o contêiner da demo (e `storageKey: false`) para não alterar o tema global da toolbar; no app real o padrão é `<html>` com persistência em `localStorage`.',
      },
      source: {
        code: `const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme({
  // target: elemento que recebe data-theme (default: <html>)
  // storageKey: 'v-theme' (false desativa a persistência)
  // default: 'system'
})
setTheme('dark')   // 'light' | 'dark' | 'system'
toggleTheme()      // alterna com base em resolvedTheme`,
      },
    },
  },
  render: () => ({
    components: { VButton, Sample },
    setup() {
      const el = ref<HTMLElement | null>(null)
      const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme({ target: () => el.value, storageKey: false, default: 'light' })
      return { el, theme, resolvedTheme, setTheme, toggleTheme }
    },
    template: `<div ref="el" style="padding:20px;border:1px solid var(--v-color-border);border-radius:12px;display:grid;gap:16px;">
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <VButton v-for="t in ['light','dark','system']" :key="t" :variant="theme === t ? 'primary' : 'outline'" size="sm" @click="setTheme(t)">{{ t }}</VButton>
        <VButton variant="ghost" size="sm" @click="toggleTheme">toggleTheme()</VButton>
      </div>
      <p style="margin:0;font-size:13px;">theme = <code>{{ theme }}</code> · resolvedTheme = <code>{{ resolvedTheme }}</code></p>
      <Sample />
    </div>`,
  }),
}

/** README: `.v-theme-dark` / `.v-theme-light` numa subárvore. */
export const SubtreeThemes: Story = {
  name: 'Subárvore (.v-theme-dark / .v-theme-light)',
  parameters: {
    docs: {
      description: { story: 'Tematize só um trecho da página com `.v-theme-dark` ou `.v-theme-light`, independentemente do tema global.' },
      source: { code: '<div class="v-theme-dark">…componentes escuros…</div>\n<div class="v-theme-light">…componentes claros…</div>' },
    },
  },
  render: () => ({
    components: { Sample },
    template: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;">
      <div class="v-theme-light" style="padding:20px;border-radius:12px;border:1px solid var(--v-color-border)"><p style="margin-top:0"><code>.v-theme-light</code></p><Sample /></div>
      <div class="v-theme-dark" style="padding:20px;border-radius:12px;border:1px solid var(--v-color-border)"><p style="margin-top:0"><code>.v-theme-dark</code></p><Sample /></div>
    </div>`,
  }),
}

export const SemanticTokens: Story = {
  name: 'Tokens semânticos (light × dark)',
  parameters: {
    docs: { description: { story: 'Tabela gerada ao vivo a partir das CSS vars: cada coluna é um escopo `.v-theme-light` / `.v-theme-dark`, com o valor computado do token.' } },
  },
  render: () => ({ components: { SemanticTokenTable }, template: '<SemanticTokenTable />' }),
}

/** API de tokens ao vivo. */
export const TokenApi: Story = {
  name: 'API de tokens (setToken / resetTokens / listTokens)',
  parameters: {
    docs: {
      description: { story: 'Edição ao vivo de tokens no `:root`: `setToken(name, value)` altera, `listTokens()` lista os alterados e `resetTokens()` restaura. `KNOWN_TOKENS` traz todos os nomes válidos.' },
      source: {
        code: `import { setToken, resetTokens, listTokens, KNOWN_TOKENS } from 'vueui-nova-kit/tokens'

setToken('--v-color-primary', '#16a34a')
listTokens()   // tokens alterados
resetTokens()  // restaura tudo`,
      },
    },
  },
  render: () => ({
    components: { VButton, VBadge },
    setup() {
      const color = ref('#16a34a')
      const changed = ref<unknown>([])
      const apply = () => {
        setToken('--v-color-primary', color.value)
        changed.value = listTokens()
      }
      const reset = () => {
        resetTokens()
        changed.value = listTokens()
      }
      onBeforeUnmount(() => resetTokens())
      return { color, apply, reset, changed, total: KNOWN_TOKENS.length }
    },
    template: `<div style="display:grid;gap:12px;max-width:480px;">
      <label>--v-color-primary <input type="color" v-model="color" /></label>
      <div style="display:flex;gap:8px;"><VButton variant="primary" @click="apply">setToken</VButton><VButton variant="outline" @click="reset">resetTokens</VButton></div>
      <p style="margin:0;font-size:13px;">{{ total }} tokens conhecidos · alterados: <code>{{ JSON.stringify(changed) }}</code></p>
    </div>`,
  }),
}
