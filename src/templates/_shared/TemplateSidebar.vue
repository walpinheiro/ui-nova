<script setup lang="ts">
import { computed } from 'vue'
import VSidebar from '../../components/navigation/VSidebar/VSidebar.vue'
import {
  buildCategorizedSidebarItems,
  getTemplateCategoryForItem,
  getTemplateMenuKindLabel,
  TEMPLATE_SIDEBAR_EXPANDED,
} from './templateNavigation'

const activeItem = defineModel<string>('activeItem', { default: 'dashboard' })
const collapsed = defineModel<boolean>('collapsed', { default: false })

const emit = defineEmits<{ select: [value: string] }>()

const props = withDefaults(
  defineProps<{
    brandName?: string
    searchPlaceholder?: string
  }>(),
  {
    brandName: 'VueUI Nova',
    searchPlaceholder: 'Buscar no menu…',
  },
)

const sidebarItems = buildCategorizedSidebarItems()
const category = computed(() => getTemplateCategoryForItem(activeItem.value))
const menuKindLabel = computed(() =>
  category.value ? getTemplateMenuKindLabel(category.value.menuKind) : 'Menu lateral',
)
</script>

<template>
  <VSidebar
    v-model:active-item="activeItem"
    v-model:collapsed="collapsed"
    :items="sidebarItems"
    :expanded-sections="TEMPLATE_SIDEBAR_EXPANDED"
    :brand-name="brandName"
    :search-placeholder="searchPlaceholder"
    user-name="Alex Chen"
    user-email="alex@nova.dev"
    class="template-sidebar"
    @select="emit('select', $event)"
  />
</template>

<style scoped lang="scss">
.template-sidebar {
  flex-shrink: 0;
  height: 100%;
}
</style>
