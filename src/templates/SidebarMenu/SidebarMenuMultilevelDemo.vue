<script setup lang="ts">
import { ref } from 'vue'
import VSidebar from '../../components/navigation/VSidebar/VSidebar.vue'
import type { VSidebarItem } from '../../components/navigation/VSidebar/VSidebar.types'

const activeItem = ref('cohorts')

/** 3 níveis, categorias (heading) dentro de submenus e grupos colapsáveis. */
const items: VSidebarItem[] = [
  {
    value: 'g-geral',
    label: 'Geral',
    type: 'group',
    children: [
      { value: 'dashboard', label: 'Painel', icon: 'home' },
      {
        value: 'analytics',
        label: 'Análises',
        icon: 'analytics',
        children: [
          { value: 'h-rel', label: 'Relatórios', type: 'heading' },
          { value: 'receita', label: 'Receita' },
          { value: 'retencao', label: 'Retenção' },
          { value: 'h-seg', label: 'Segmentação', type: 'heading' },
          {
            value: 'coortes',
            label: 'Coortes',
            children: [
              { value: 'cohorts', label: 'Mensais' },
              { value: 'semanais', label: 'Semanais' },
            ],
          },
        ],
      },
      {
        value: 'projetos',
        label: 'Projetos',
        icon: 'projects',
        children: [
          { value: 'atlas', label: 'Atlas', badge: 12 },
          { value: 'nova', label: 'Nova' },
        ],
      },
    ],
  },
  {
    value: 'g-sistema',
    label: 'Sistema',
    type: 'group',
    children: [
      { value: 'faturacao', label: 'Faturação', icon: 'billing' },
      { value: 'definicoes', label: 'Definições', icon: 'settings', tag: 'Novo' },
    ],
  },
]
</script>

<template>
  <div class="sidebar-multilevel-demo">
    <VSidebar
      v-model:active-item="activeItem"
      :items="items"
      brand-name="VueUI Nova"
      search-placeholder="Buscar no menu…"
      search-shortcut="/"
      class="sidebar-multilevel-demo__sidebar"
    />
    <main class="sidebar-multilevel-demo__main">
      <h1 class="sidebar-multilevel-demo__heading">Menu multi-nível</h1>
      <p class="sidebar-multilevel-demo__lead">
        Acordeão por nível, grupos colapsáveis, filtro na busca e scroll apenas no menu. Item activo:
        <code>{{ activeItem }}</code>.
      </p>
    </main>
  </div>
</template>

<style scoped lang="scss">
.sidebar-multilevel-demo {
  display: flex;
  height: 100%;
  min-height: 100%;

  &__sidebar {
    flex-shrink: 0;
  }

  &__main {
    flex: 1;
    min-width: 0;
    padding: var(--v-space-6);
    background: var(--v-color-bg);
    color: var(--v-color-text);
  }

  &__heading {
    margin: 0 0 var(--v-space-2);
    font-size: var(--v-font-size-h3);
    font-weight: var(--v-font-weight-bold);
  }

  &__lead {
    margin: 0;
    max-width: 36rem;
    color: var(--v-color-text-muted);

    code {
      font-family: ui-monospace, monospace;
    }
  }
}
</style>
