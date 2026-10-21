import { describe, expect, it } from 'vitest'
import { nextSortDirection } from '../internal/mountVSortableHeader'

describe('VTable sortable header helpers', () => {
  it('cycles sort directions', () => {
    expect(nextSortDirection(null)).toBe('asc')
    expect(nextSortDirection('asc')).toBe('desc')
    expect(nextSortDirection('desc')).toBe(null)
  })
})
