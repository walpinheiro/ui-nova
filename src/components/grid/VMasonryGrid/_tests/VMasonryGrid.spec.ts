/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VMasonryGrid from '../VMasonryGrid.vue'
import VMasonryItem from '../VMasonryItem.vue'

describe('VMasonryGrid', () => {
  it('renders masonry root', () => {
    const w = mount(VMasonryGrid)
    expect(w.find('[data-test-id="masonry-grid"]').exists()).toBe(true)
  })

  it('shows loading skeletons', () => {
    const w = mount(VMasonryGrid, { props: { loading: true, cols: 2 } })
    expect(w.find('[data-test-id="masonry-state-loading"]').exists()).toBe(true)
    expect(w.findAll('[data-test-id="masonry-skeleton"]').length).toBeGreaterThan(0)
  })

  it('shows empty state', () => {
    const w = mount(VMasonryGrid, { props: { empty: true } })
    expect(w.find('[data-test-id="masonry-state-empty"]').exists()).toBe(true)
    expect(w.text()).toContain('No items yet')
  })

  it('renders items in slot', () => {
    const w = mount(VMasonryGrid, {
      slots: { default: '<div data-test-id="tile">Tile</div>' },
    })
    expect(w.find('[data-test-id="tile"]').exists()).toBe(true)
  })
})

describe('VMasonryItem', () => {
  it('renders title and like count with icons', () => {
    const w = mount(VMasonryItem, {
      props: { id: 'a', title: 'Serene mountains', category: 'Nature', likes: 342 },
    })
    expect(w.find('[data-test-id="masonry-tile-a"]').exists()).toBe(true)
    expect(w.find('[data-test-id="masonry-tile-title"]').text()).toBe('Serene mountains')
    expect(w.find('[data-test-id="masonry-like-count"]').text()).toBe('342')
    expect(w.find('[data-test-id="v-icon"]').exists()).toBe(true)
  })

  it('shows selected badge', () => {
    const w = mount(VMasonryItem, { props: { id: 'x', title: 'X', selected: true } })
    expect(w.find('[data-test-id="masonry-tile-selected"]').exists()).toBe(true)
  })
})
