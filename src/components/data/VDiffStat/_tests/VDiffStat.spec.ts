/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VDiffStat from '../VDiffStat.vue'
import { diffBlocks } from '../mountVDiffStat'

describe('diffBlocks', () => {
  it('splits blocks proportionally and keeps tiny sides visible', () => {
    expect(diffBlocks(193, 130, 5)).toEqual(['add', 'add', 'add', 'del', 'del'])
    expect(diffBlocks(500, 1, 5)).toEqual(['add', 'add', 'add', 'add', 'del'])
    expect(diffBlocks(0, 0, 3)).toEqual(['neutral', 'neutral', 'neutral'])
  })
})

describe('VDiffStat', () => {
  it('formats counts and exposes an accessible label', () => {
    const wrapper = mount(VDiffStat, { props: { additions: 1930, deletions: 130, blocks: true } })
    expect(wrapper.get('[data-test-id="v-diff-stat-add"]').text()).toBe('+1,930')
    expect(wrapper.get('[data-test-id="v-diff-stat-del"]').text()).toBe('−130')
    expect(wrapper.attributes('aria-label')).toBe('1930 additions, 130 deletions')
    expect(wrapper.findAll('.v-diff-stat__block')).toHaveLength(5)
  })
})
