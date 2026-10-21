<script setup lang="ts">
import { computed, inject } from 'vue'
import { VIcon } from '../../primitives/VIcon'
import { VNavItem } from '../VNavItem'
import { SIDEBAR_UI_ICONS } from './mountVSidebar'
import { VSIDEBAR_CONTEXT } from './sidebarContext'
import type { ResolvedVSidebarItem } from './VSidebar.types'

defineOptions({ name: 'VSidebarNode' })

const props = defineProps<{ node: ResolvedVSidebarItem }>()

const ctx = inject(VSIDEBAR_CONTEXT)
if (!ctx) throw new Error('VSidebarNode must be rendered inside VSidebar')

/** Renders a (scoped) parent slot function without re-creating components. */
const SlotRender = (p: { fn?: (args: unknown) => unknown; args?: unknown }) =>
  p.fn ? (p.fn(p.args) as never) : null

const open = computed(() => ctx.isSectionExpanded(props.node.value))
const subId = computed(() => ctx.submenuId(props.node.value))
const showChildren = computed(() => props.node.hasChildren && open.value && ctx.labelsVisible.value)
const trailingSlot = computed(() => ctx.slots['item-trailing'])
const groupActionsSlot = computed(() => ctx.slots['group-actions'])
const isActive = computed(() => ctx.isItemActive(props.node.value))
const itemChevronIcon = computed(() =>
  ctx.config.value.chevron === 'updown'
    ? open.value ? SIDEBAR_UI_ICONS.chevronUp : SIDEBAR_UI_ICONS.chevronDown
    : SIDEBAR_UI_ICONS.expand,
)
const hasIcon = computed(() => Boolean(props.node.iconData || props.node.iconColor))
</script>

<template>
  <!-- flat caption (backward compatible `type: 'heading'`) -->
  <li
    v-if="node.type === 'heading'"
    class="v-sidebar__heading"
    :data-test-id="`v-sidebar-heading-${node.value}`"
  >
    {{ node.label }}
  </li>

  <!-- group, expanded sidebar -->
  <li
    v-else-if="node.type === 'group' && ctx.labelsVisible.value"
    class="v-sidebar__group"
    :class="{
      'v-sidebar__group--open': open || !node.collapsible,
      'v-sidebar__group--collapsible': node.collapsible,
    }"
    :data-test-id="`v-sidebar-group-${node.value}`"
  >
    <div
      v-if="node.collapsible"
      class="v-sidebar__group-head"
      :class="{ 'v-sidebar__group-head--has-actions': Boolean(groupActionsSlot) }"
    >
      <button
        type="button"
        class="v-sidebar__group-header"
        :data-sidebar-key="node.value"
        :data-test-id="`v-sidebar-group-header-${node.value}`"
        :aria-expanded="open"
        :aria-controls="subId"
        :disabled="node.disabled || undefined"
        @click="ctx.toggleSection(node.value)"
        @keydown="ctx.onItemKeydown($event, node)"
      >
        <span class="v-sidebar__group-label"><template v-for="(p, i) in ctx.labelParts(node.label)" :key="i"><mark v-if="p.match" class="v-sidebar__mark">{{ p.text }}</mark><template v-else>{{ p.text }}</template></template></span>
        <SlotRender v-if="trailingSlot" :fn="trailingSlot" :args="{ item: node }" />
        <VIcon
          :icon="SIDEBAR_UI_ICONS.chevronDown"
          size="sm"
          class="v-sidebar__group-chevron"
          aria-hidden="true"
        />
      </button>
      <div
        v-if="groupActionsSlot"
        class="v-sidebar__group-actions"
        :data-test-id="`v-sidebar-group-actions-${node.value}`"
        @click.stop
        @keydown.stop
      >
        <SlotRender :fn="groupActionsSlot" :args="{ group: node }" />
      </div>
    </div>
    <div v-else class="v-sidebar__group-head" :class="{ 'v-sidebar__group-head--has-actions': Boolean(groupActionsSlot) }">
      <div class="v-sidebar__group-header v-sidebar__group-header--static">
        <span class="v-sidebar__group-label"><template v-for="(p, i) in ctx.labelParts(node.label)" :key="i"><mark v-if="p.match" class="v-sidebar__mark">{{ p.text }}</mark><template v-else>{{ p.text }}</template></template></span>
      </div>
      <div
        v-if="groupActionsSlot"
        class="v-sidebar__group-actions"
        :data-test-id="`v-sidebar-group-actions-${node.value}`"
        @click.stop
        @keydown.stop
      >
        <SlotRender :fn="groupActionsSlot" :args="{ group: node }" />
      </div>
    </div>

    <Transition v-if="node.collapsible" name="v-sidebar-collapse" @after-enter="ctx.onSectionEntered">
      <div v-if="open" :id="subId" class="v-sidebar__sub">
        <div class="v-sidebar__sub-inner">
          <ul class="v-sidebar__sublist v-sidebar__sublist--group" role="list">
            <VSidebarNode v-for="child in node.children" :key="child.value" :node="child" />
          </ul>
        </div>
      </div>
    </Transition>
    <ul v-else class="v-sidebar__sublist v-sidebar__sublist--group" role="list">
      <VSidebarNode v-for="child in node.children" :key="child.value" :node="child" />
    </ul>
  </li>

  <!-- group, collapsed rail: thin divider + flat children -->
  <template v-else-if="node.type === 'group'">
    <li class="v-sidebar__divider" role="separator" :data-test-id="`v-sidebar-group-${node.value}`" />
    <VSidebarNode v-for="child in node.children" :key="child.value" :node="child" />
  </template>

  <!-- item (any depth) -->
  <li
    v-else
    class="v-sidebar__item"
    :class="{
      'v-sidebar__item--active': isActive,
      'v-sidebar__item--disabled': node.disabled,
      'v-sidebar__item--nested-parent': node.hasChildren,
      'v-sidebar__item--child': node.depth > 0,
      'v-sidebar__item--open': showChildren,
      'v-sidebar__item--contains-active': ctx.containsActive(node.value),
      'v-sidebar__item--no-icon': !hasIcon,
    }"
    :style="{ '--v-sidebar-depth': node.depth }"
    :data-test-id="node.depth > 0 ? `v-sidebar-nested-child-${node.value}` : undefined"
  >
    <VNavItem
      :label="node.label"
      :value="node.value"
      :icon="node.icon"
      :href="node.href"
      :badge="node.badge"
      :badge-tone="node.badgeTone"
      :tag="node.tag"
      :icon-color="node.iconColor"
      :active="isActive"
      :disabled="node.disabled"
      :collapsed="!ctx.labelsVisible.value"
      :size="ctx.config.value.size"
      :variant="ctx.itemVariant.value"
      :expandable="node.hasChildren && ctx.labelsVisible.value"
      :expanded="node.hasChildren && ctx.labelsVisible.value ? open : undefined"
      :aria-controls="subId"
      :title="ctx.labelsVisible.value ? undefined : node.label"
      :data-sidebar-key="node.value"
      :data-test-id="ctx.itemTestId(node.value)"
      @select="ctx.selectItem(node)"
      @keydown="ctx.onItemKeydown($event, node)"
    >
      <template v-if="ctx.searching.value" #default>
        <template v-for="(p, i) in ctx.labelParts(node.label)" :key="i"><mark v-if="p.match" class="v-sidebar__mark">{{ p.text }}</mark><template v-else>{{ p.text }}</template></template>
      </template>

      <template v-if="node.iconData" #icon>
        <VIcon :icon="node.iconData" size="sm" />
      </template>

      <template v-if="ctx.labelsVisible.value && (node.hasChildren || trailingSlot)" #trailing>
        <SlotRender v-if="trailingSlot" :fn="trailingSlot" :args="{ item: node }" />
        <VIcon
          v-if="node.hasChildren"
          :icon="itemChevronIcon"
          size="sm"
          class="v-sidebar__item-chevron"
          :class="{ 'v-sidebar__item-chevron--updown': ctx.config.value.chevron === 'updown' }"
          aria-hidden="true"
          data-test-id="v-sidebar-nav-item-chevron"
        />
      </template>
    </VNavItem>

    <Transition name="v-sidebar-collapse" @after-enter="ctx.onSectionEntered">
      <div v-if="showChildren" :id="subId" class="v-sidebar__sub">
        <div class="v-sidebar__sub-inner">
          <ul class="v-sidebar__sublist" role="list">
            <VSidebarNode v-for="child in node.children" :key="child.value" :node="child" />
          </ul>
        </div>
      </div>
    </Transition>
  </li>
</template>
