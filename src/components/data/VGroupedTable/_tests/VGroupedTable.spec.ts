/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VGroupedTable from '../VGroupedTable.vue'
import { resolveColumns } from '../mountVGroupedTable'

const columns = [
  { key: 'name', label: 'Deal' },
  { key: 'amount', label: 'Amount', minWidth: 560, collapseInto: 'name' },
  { key: 'date', label: 'Close date' },
]

const groups = [
  { id: 'proposal', label: 'Proposal', rows: [{ id: 1, name: 'Tideline', amount: '$450', date: '27 Aug' }] },
  { id: 'won', label: 'Closed Won', rows: [{ id: 2, name: 'Halden', amount: '$28k', date: '21 Sept' }] },
]

describe('resolveColumns', () => {
  it('hides columns below their minWidth and collapses them inline', () => {
    const narrow = resolveColumns(columns, 400)
    expect(narrow.visible.map((column) => column.key)).toEqual(['name', 'date'])
    expect(narrow.collapsed.get('name')?.map((column) => column.key)).toEqual(['amount'])
    const wide = resolveColumns(columns, 800)
    expect(wide.visible).toHaveLength(3)
    expect(wide.collapsed.size).toBe(0)
  })
})

describe('VGroupedTable', () => {
  it('renders groups and rows; narrow widths inline the hidden column', () => {
    const wrapper = mount(VGroupedTable, { props: { columns, groups, containerWidth: 400 } })
    expect(wrapper.findAll('[data-test-id="v-grouped-table-group"]')).toHaveLength(2)
    expect(wrapper.findAll('td[data-col="amount"]')).toHaveLength(0)
    expect(wrapper.get('[data-inline-col="amount"]').text()).toBe('$450')
  })

  it('shows the column when wide enough', () => {
    const wrapper = mount(VGroupedTable, { props: { columns, groups, containerWidth: 900 } })
    expect(wrapper.findAll('td[data-col="amount"]')).toHaveLength(2)
    expect(wrapper.find('[data-inline-col]').exists()).toBe(false)
  })

  it('toggles groups through update:collapsed', async () => {
    const wrapper = mount(VGroupedTable, { props: { columns, groups, collapsed: ['won'] } })
    expect(wrapper.findAll('[data-test-id="v-grouped-table-row"]')).toHaveLength(1)
    const toggles = wrapper.findAll('[data-test-id="v-grouped-table-group-toggle"]')
    expect(toggles[1].attributes('aria-expanded')).toBe('false')
    await toggles[0].trigger('click')
    expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([['won', 'proposal']])
    expect(wrapper.emitted('group-toggle')?.[0]).toEqual(['proposal', true])
  })

  it('emits row-click only when interactive', async () => {
    const wrapper = mount(VGroupedTable, { props: { columns, groups, interactive: true } })
    await wrapper.get('[data-test-id="v-grouped-table-row"]').trigger('click')
    expect(wrapper.emitted('row-click')?.[0]?.[0]).toMatchObject({ id: 1 })
  })
})
