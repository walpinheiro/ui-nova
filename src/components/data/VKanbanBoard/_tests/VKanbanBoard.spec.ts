/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VKanbanBoard from '../VKanbanBoard.vue'
import { keyboardKanbanMove, moveKanbanItem } from '../mountVKanbanBoard'
import type { VKanbanColumn } from '../VKanbanBoard.types'

const columns = (): VKanbanColumn[] => [
  { id: 'todo', title: 'To Do', items: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] },
  { id: 'doing', title: 'In Progress', items: [{ id: 'c', title: 'C' }] },
]

describe('moveKanbanItem', () => {
  it('moves across columns without mutating the input', () => {
    const input = columns()
    const next = moveKanbanItem(input, { itemId: 'a', from: 'todo', to: 'doing', index: 1 })!
    expect(next[0].items.map((item) => item.id)).toEqual(['b'])
    expect(next[1].items.map((item) => item.id)).toEqual(['c', 'a'])
    expect(input[0].items).toHaveLength(2)
  })

  it('reorders inside a column and rejects unknown ids', () => {
    const next = moveKanbanItem(columns(), { itemId: 'a', from: 'todo', to: 'todo', index: 1 })!
    expect(next[0].items.map((item) => item.id)).toEqual(['b', 'a'])
    expect(moveKanbanItem(columns(), { itemId: 'zz', from: 'todo', to: 'doing', index: 0 })).toBeNull()
  })

  it('maps Alt+Arrow keys to moves', () => {
    expect(keyboardKanbanMove(columns(), 'b', 'ArrowRight')).toEqual({ itemId: 'b', from: 'todo', to: 'doing', index: 1 })
    expect(keyboardKanbanMove(columns(), 'a', 'ArrowLeft')).toBeNull()
    expect(keyboardKanbanMove(columns(), 'a', 'ArrowDown')).toEqual({ itemId: 'a', from: 'todo', to: 'todo', index: 1 })
  })
})

describe('VKanbanBoard', () => {
  it('renders columns, counts and cards', () => {
    const wrapper = mount(VKanbanBoard, { props: { columns: columns() } })
    expect(wrapper.findAll('[data-test-id="v-kanban-column"]')).toHaveLength(2)
    expect(wrapper.findAll('[data-test-id="v-kanban-card"]')).toHaveLength(3)
  })

  it('moves a card with Alt+ArrowRight and announces it', async () => {
    const wrapper = mount(VKanbanBoard, { props: { columns: columns() }, attachTo: document.body })
    await wrapper.findAll('[data-test-id="v-kanban-card"]')[0].trigger('keydown', { key: 'ArrowRight', altKey: true })
    expect(wrapper.emitted('move')?.[0]?.[0]).toEqual({ itemId: 'a', from: 'todo', to: 'doing', index: 0 })
    const updated = wrapper.emitted('update:columns')?.[0]?.[0] as VKanbanColumn[]
    expect(updated[1].items.map((item) => item.id)).toEqual(['a', 'c'])
    expect(wrapper.get('[data-test-id="v-kanban-live"]').text()).toContain('moved to In Progress')
    wrapper.unmount()
  })

  it('emits add and item-click', async () => {
    const wrapper = mount(VKanbanBoard, { props: { columns: columns() } })
    await wrapper.get('.v-kanban__add').trigger('click')
    expect(wrapper.emitted('add')?.[0]).toEqual(['todo'])
    await wrapper.get('[data-test-id="v-kanban-card"]').trigger('click')
    expect(wrapper.emitted('item-click')?.[0]?.[0]).toMatchObject({ id: 'a' })
  })
})
