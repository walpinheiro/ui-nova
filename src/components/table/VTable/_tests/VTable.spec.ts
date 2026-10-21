// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VTable from '../VTable.vue'
import { mountVTable } from '../mountVTable'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'lastActive', label: 'Last Active' },
]

const rows = [
  { id: 1, name: 'Alex Carter', role: 'Product Designer', status: 'active', lastActive: '2 hours ago' },
  { id: 2, name: 'Priya Shah', role: 'Frontend Engineer', status: 'in-review', lastActive: '1 day ago' },
  { id: 3, name: 'Marcus Lee', role: 'Product Manager', status: 'active', lastActive: '5 hours ago' },
]

describe('VTable mount helpers', () => {
  it('normalizes defaults and empty state', () => {
    expect(mountVTable({ rows }).variant).toBe('default')
    expect(mountVTable({ rows: [] }).isEmpty).toBe(true)
  })
})

describe('VTable', () => {
  it('renders toolbar, headers and rows', () => {
    const wrapper = mount(VTable, { props: { columns, rows } })
    expect(wrapper.get('[data-test-id="table"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="table-toolbar"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="table-header-cell--name"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="table-row"]').exists()).toBe(true)
  })

  it('filters rows via search', async () => {
    const wrapper = mount(VTable, { props: { columns, rows, search: 'Priya' } })
    expect(wrapper.text()).toContain('Priya Shah')
    expect(wrapper.text()).not.toContain('Alex Carter')
  })

  it('selects rows and shows status badges', async () => {
    const wrapper = mount(VTable, { props: { columns, rows, selectable: true } })
    const checkbox = wrapper.findAll('[data-test-id="table-checkbox"]')[0]
    await checkbox.setValue(true)
    expect(wrapper.emitted('update:selected')?.[0]).toEqual([[rows[0].id]])
    expect(wrapper.get('[data-test-id="table-status-badge--active"]').exists()).toBe(true)
  })

  it('renders loading skeleton and empty state', () => {
    const loading = mount(VTable, { props: { columns, rows, loading: true } })
    expect(loading.get('[data-test-id="table-loading-skeleton"]').exists()).toBe(true)

    const empty = mount(VTable, { props: { columns, rows: [] } })
    expect(empty.get('[data-test-id="table-empty-state"]').text()).toContain('No results found')
  })

  it('renders sortable headers automatically for sortable columns', () => {
    const wrapper = mount(VTable, { props: { columns, rows } })
    expect(wrapper.get('[data-test-id="table-header-sort--name"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="table-header-sort--role"]').exists()).toBe(true)
    expect(wrapper.find('[data-test-id="table-header-sort--status"]').exists()).toBe(false)
    expect(wrapper.get('[data-test-id="table-header-cell--status"]').text()).toContain('Status')
  })

  it('sorts rows when clicking a sortable header', async () => {
    const wrapper = mount(VTable, { props: { columns, rows } })
    await wrapper.get('[data-test-id="table-header-sort--name"]').trigger('click')
    expect(wrapper.emitted('update:sort')?.[0]).toEqual([[{ key: 'name', direction: 'asc', priority: 1 }]])
    expect(wrapper.get('[data-test-id="table-header-sort--name"]').attributes('aria-sort')).toBe('ascending')
  })

  it('shows multi-sort priority badge', async () => {
    const wrapper = mount(VTable, {
      props: {
        columns,
        rows,
        sort: [
          { key: 'name', direction: 'asc', priority: 1 },
          { key: 'role', direction: 'desc', priority: 2 },
        ],
      },
    })
    expect(wrapper.get('[data-test-id="table-header-sort-priority"]').text()).toBe('2')
  })

  it('renders a comparison table without toolbar, selection or pagination', () => {
    const wrapper = mount(VTable, {
      props: {
        variant: 'comparison',
        columns: [
          { key: 'field', label: 'Context field' },
          { key: 'sent', label: 'Sent', cell: 'mark' },
          { key: 'status', label: 'Status', cell: 'status' },
        ],
        rows: [
          {
            id: 'customer_id',
            field: 'customer_id',
            tone: 'match',
            sent: { ok: true, label: 'present' },
            status: 'match',
          },
        ],
      },
    })
    expect(wrapper.get('[data-test-id="table"]').classes()).toContain('v-table--comparison')
    expect(wrapper.find('[data-test-id="table-toolbar"]').exists()).toBe(false)
    expect(wrapper.find('[data-test-id="table-pagination"]').exists()).toBe(false)
    expect(wrapper.find('[data-test-id="table-header-cell--actions"]').exists()).toBe(false)
    expect(wrapper.get('.v-table__row--match').exists()).toBe(true)
    expect(wrapper.text()).toContain('present')
    expect(wrapper.get('[data-test-id="table-status-badge--match"]').text()).toContain('Match')
  })
})

describe('VTable cell and header slots', () => {
  it('renders #cell-<key> with row, value, column and index', () => {
    const wrapper = mount(VTable, {
      props: { columns, rows },
      slots: {
        'cell-role': `<template #cell-role="{ row, value, column, index }"><b class="custom">{{ row.name }}|{{ value }}|{{ column.key }}|{{ index }}</b></template>`,
      },
    })
    const first = wrapper.findAll('.custom')[0]
    expect(first.text()).toBe('Alex Carter|Product Designer|role|0')
  })

  it('renders #header-<key> in place of the default header', () => {
    const wrapper = mount(VTable, {
      props: { columns, rows },
      slots: { 'header-role': `<template #header-role="{ column }"><i class="hdr">Custom {{ column.label }}</i></template>` },
    })
    const cell = wrapper.get('[data-test-id="table-header-cell--role"]')
    expect(cell.get('.hdr').text()).toBe('Custom Role')
    expect(cell.find('button').exists()).toBe(false)
  })
})
