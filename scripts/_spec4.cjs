module.exports = [
  ['navigation/VTabs/VTabs.stories.ts', 'ControlledVModel', `{
  parameters: { docs: { description: { story: 'Estado controlado: \`v-model\` ligado a um \`ref\` e exibido abaixo; as abas também podem ser trocadas por código.' } } },
  render: (args) => ({
    components: { VTabs },
    setup() {
      const tab = ref('features')
      return { args, tab }
    },
    template: '<div style="display:grid;gap:12px"><VTabs v-bind="args" v-model="tab" /><code>v-model = {{ tab }}</code><button type="button" @click="tab = \\'pricing\\'">Ir para Pricing</button></div>',
  }),
}`],
  ['navigation/VSegmentedControl/VSegmentedControl.stories.ts', 'ControlledVModel', `{
  parameters: { docs: { description: { story: 'Estado controlado: \`v-model\` ligado a um \`ref\`.' } } },
  render: (args) => ({
    components: { VSegmentedControl },
    setup() {
      const value = ref('b')
      return { args, value }
    },
    template: '<div style="display:grid;gap:12px"><VSegmentedControl v-bind="args" v-model="value" :options="[{ value: \\'a\\', label: \\'Dia\\' }, { value: \\'b\\', label: \\'Semana\\' }, { value: \\'c\\', label: \\'Mês\\' }]" /><code>v-model = {{ value }}</code></div>',
  }),
}`],
  ['table/VTable/VTable.stories.ts', 'ControlledSelectionSortSearch', `{
  parameters: { docs: { description: { story: 'Estado controlado: \`v-model:selected\`, \`v-model:sort\`, \`v-model:search\` e \`v-model:page\` ligados a refs; o estado atual é exibido abaixo da tabela.' } } },
  render: (args) => ({
    components: { VTable },
    setup() {
      const selected = ref<Array<string | number>>([1])
      const sort = ref<Array<{ key: string; direction: 'asc' | 'desc' }>>([{ key: 'name', direction: 'asc' }])
      const search = ref('')
      const page = ref(1)
      return { args, selected, sort, search, page }
    },
    template: '<div style="display:grid;gap:12px"><VTable v-bind="args" v-model:selected="selected" v-model:sort="sort" v-model:search="search" v-model:page="page" /><code>selected = {{ JSON.stringify(selected) }} · sort = {{ JSON.stringify(sort) }} · search = "{{ search }}" · page = {{ page }}</code></div>',
  }),
}`],
  ['feedback/VAlert/VAlert.stories.ts', 'ControlledVModel', `{
  parameters: { docs: { description: { story: 'Visibilidade controlada com \`v-model\` (\`modelValue\`): fechar o alerta atualiza o \`ref\`, e o botão o reabre.' } } },
  render: () => ({
    components: { VAlert },
    setup() {
      const open = ref(true)
      return { open }
    },
    template: '<div style="display:grid;gap:12px;max-width:480px"><VAlert v-model="open" dismissible title="Alerta controlado" description="Feche e reabra pelo botão." /><button type="button" @click="open = true">Reabrir (open = {{ open }})</button></div>',
  }),
}`],
  ['feedback/VBanner/VBanner.stories.ts', 'ControlledVModel', `{
  parameters: { docs: { description: { story: 'Visibilidade controlada com \`v-model\`.' } } },
  render: () => ({
    components: { VBanner },
    setup() {
      const open = ref(true)
      return { open }
    },
    template: '<div style="display:grid;gap:12px"><VBanner v-model="open" closable title="Banner controlado" /><button type="button" @click="open = true">Reabrir (open = {{ open }})</button></div>',
  }),
}`],
  ['navigation/VPopover/VPopover.stories.ts', 'ControlledOpen', `{
  parameters: { docs: { description: { story: 'Abertura controlada com \`v-model:open\` ligado a um \`ref\`.' } } },
  render: (args) => ({
    components: { VPopover },
    setup() {
      const open = ref(false)
      return { args, open }
    },
    template: '<div style="display:grid;gap:12px;padding:8px 0 140px"><VPopover v-bind="args" v-model:open="open"><template #trigger><button type="button">Gatilho</button></template>Conteúdo do popover</VPopover><code>open = {{ open }}</code><button type="button" @click="open = !open">Alternar por código</button></div>',
  }),
}`],
  ['navigation/VDropdownMenu/VDropdownMenu.stories.ts', 'ControlledOpenAndValue', `{
  parameters: { docs: { description: { story: 'Abertura e valor controlados: \`v-model\` (aberto) e \`v-model:value\` (item escolhido).' } } },
  render: (args) => ({
    components: { VDropdownMenu },
    setup() {
      const open = ref(false)
      const value = ref('')
      return { args, open, value }
    },
    template: '<div style="display:grid;gap:12px;padding-bottom:200px"><VDropdownMenu v-bind="args" v-model="open" v-model:value="value" /><code>open = {{ open }} · value = "{{ value }}"</code></div>',
  }),
}`],
  ['containment/VSheet/VSheet.stories.ts', 'ControlledOpen', `{
  parameters: { docs: { description: { story: 'Abertura controlada com \`v-model:open\`; botão abre e o sheet fecha por Esc/backdrop/botão.' } } },
  render: (args) => ({
    components: { VSheet },
    setup() {
      const open = ref(false)
      return { args, open }
    },
    template: '<div><button type="button" @click="open = true">Abrir sheet</button> <code>open = {{ open }}</code><VSheet v-bind="args" v-model:open="open" title="Sheet controlado" description="Fecha por Esc, backdrop ou botão." /></div>',
  }),
}`],
  ['containment/VWindow/VWindow.stories.ts', 'ControlledOpen', `{
  parameters: { docs: { description: { story: 'Visibilidade controlada com \`v-model\`: o botão fechar da janela atualiza o \`ref\`.' } } },
  render: (args) => ({
    components: { VWindow },
    setup() {
      const open = ref(true)
      return { args, open }
    },
    template: '<div style="display:grid;gap:12px"><VWindow v-bind="args" v-model="open">Conteúdo da janela</VWindow><button type="button" @click="open = true">Reabrir (open = {{ open }})</button></div>',
  }),
}`],
  ['containment/VPanel/VPanel.stories.ts', 'ControlledOpen', `{
  parameters: { docs: { description: { story: 'Visibilidade controlada com \`v-model:open\`.' } } },
  render: (args) => ({
    components: { VPanel },
    setup() {
      const open = ref(true)
      return { args, open }
    },
    template: '<div style="display:grid;gap:12px"><VPanel v-bind="args" v-model:open="open" title="Painel controlado">Conteúdo</VPanel><button type="button" @click="open = !open">Alternar (open = {{ open }})</button></div>',
  }),
}`],
]
