<script lang="ts">
let kanbanSeq = 0
</script>

<script setup lang="ts">
import './VKanbanBoard.scss'
import plusIcon from '@iconify-icons/keyline-icons/plus'
import moreIcon from '@iconify-icons/keyline-icons/more-horizontal'
import calendarIcon from '@iconify-icons/keyline-icons/calendar'
import listIcon from '@iconify-icons/keyline-icons/list'
import { VIcon } from '../../primitives/VIcon'
import { VAvatar } from '../../images/VAvatar'
import { useVKanbanBoard } from './useVKanbanBoard'
import type { VKanbanBoardEmits, VKanbanBoardProps } from './VKanbanBoard.types'

const props = withDefaults(defineProps<VKanbanBoardProps>(), {
  draggable: true,
  addable: true,
  addLabel: 'Add task',
  size: 'md',
})

const emit = defineEmits<VKanbanBoardEmits>()
const vm = useVKanbanBoard(props, emit)
const uid = `v-kanban-${++kanbanSeq}`
</script>

<template>
  <div v-bind="vm.rootAttrs.value" role="region" :aria-label="ariaLabel ?? 'Board'">
    <section
      v-for="column in vm.columns.value"
      :key="column.id"
      class="v-kanban__column"
      :aria-labelledby="`${uid}-col-${column.id}`"
      data-test-id="v-kanban-column"
      :data-column="column.id"
    >
      <header class="v-kanban__column-header">
        <span v-if="column.icon" class="v-kanban__column-icon" :style="{ color: column.color }" aria-hidden="true">
          <VIcon :icon="column.icon" size="sm" />
        </span>
        <h3 :id="`${uid}-col-${column.id}`" class="v-kanban__column-title">{{ column.title }}</h3>
        <span class="v-kanban__column-count" :aria-label="`${column.items.length} items`">{{ column.items.length }}</span>
        <span class="v-kanban__column-actions">
          <button
            v-if="addable"
            type="button"
            class="v-kanban__icon-btn"
            :aria-label="`${addLabel} to ${column.title}`"
            @click="emit('add', column.id)"
          >
            <VIcon :icon="plusIcon" size="sm" />
          </button>
          <button
            type="button"
            class="v-kanban__icon-btn"
            :aria-label="`${column.title} options`"
            @click="emit('column-menu', column.id)"
          >
            <VIcon :icon="moreIcon" size="sm" />
          </button>
        </span>
      </header>

      <ul
        class="v-kanban__list"
        :class="{ 'v-kanban__list--over': vm.dropTarget.value?.columnId === column.id }"
        @dragover="vm.onDragOver($event, column.id)"
        @drop="vm.onDrop($event, column.id)"
      >
        <template v-for="item in column.items" :key="item.id">
          <li v-if="vm.dropLineBefore(column, item)" class="v-kanban__drop-line" aria-hidden="true" />
          <li
            class="v-kanban__card"
            :class="{ 'v-kanban__card--dragging': vm.draggingId.value === item.id }"
            :draggable="draggable"
            tabindex="0"
            :data-kanban-card="String(item.id)"
            :aria-describedby="draggable ? `${uid}-hint` : undefined"
            data-test-id="v-kanban-card"
            @dragstart="vm.onDragStart($event, item)"
            @dragend="vm.onDragEnd"
            @click="emit('item-click', item, column)"
            @keydown="vm.onCardKeydown($event, item, column)"
          >
            <slot name="card" :item="item" :column="column">
              <div v-if="item.tags?.length" class="v-kanban__tags">
                <span v-for="tag in item.tags" :key="tag.label" class="v-kanban__tag">
                  <span class="v-kanban__tag-dot" :style="{ background: tag.color }" aria-hidden="true" />
                  {{ tag.label }}
                </span>
              </div>
              <p class="v-kanban__card-title">{{ item.title }}</p>
              <div v-if="item.progress" class="v-kanban__progress">
                <VIcon :icon="listIcon" size="sm" aria-hidden="true" />
                <span>{{ item.progress.done }}/{{ item.progress.total }}</span>
                <span class="v-kanban__progress-track" aria-hidden="true">
                  <span
                    class="v-kanban__progress-fill"
                    :style="{ width: `${item.progress.total ? (item.progress.done / item.progress.total) * 100 : 0}%` }"
                  />
                </span>
              </div>
              <div class="v-kanban__card-footer">
                <span v-if="item.code" class="v-kanban__code">{{ item.code }}</span>
                <span
                  v-if="item.priority !== undefined"
                  class="v-kanban__priority"
                  :data-level="item.priority"
                  role="img"
                  :aria-label="`Priority ${item.priority} of 3`"
                >
                  <span v-for="bar in 3" :key="bar" class="v-kanban__priority-bar" :class="{ 'is-on': bar <= item.priority }" />
                </span>
                <span v-if="item.due" class="v-kanban__due" :class="`v-kanban__due--${item.dueTone ?? 'default'}`">
                  <VIcon :icon="calendarIcon" size="sm" aria-hidden="true" />
                  {{ item.due }}
                </span>
                <VAvatar
                  v-if="item.assignee"
                  class="v-kanban__assignee"
                  size="xs"
                  :src="item.assignee.src"
                  :initials="item.assignee.initials"
                  :alt="item.assignee.name"
                  :aria-label="item.assignee.name"
                />
              </div>
            </slot>
          </li>
        </template>
        <li v-if="vm.dropLineBefore(column, null)" class="v-kanban__drop-line" aria-hidden="true" />
        <li v-if="addable" class="v-kanban__add-row">
          <button type="button" class="v-kanban__add" @click="emit('add', column.id)">
            <VIcon :icon="plusIcon" size="sm" aria-hidden="true" />
            {{ addLabel }}
          </button>
        </li>
      </ul>
    </section>

    <p :id="`${uid}-hint`" class="v-kanban__sr">Use Alt plus arrow keys to move a card between columns or reorder it.</p>
    <p class="v-kanban__sr" aria-live="polite" data-test-id="v-kanban-live">{{ vm.announcement.value }}</p>
  </div>
</template>
