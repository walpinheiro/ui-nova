/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { computeDropdownMenuPosition } from '../positionDropdownMenu'

describe('computeDropdownMenuPosition', () => {
  it('opens below and aligns to start when space allows', () => {
    const result = computeDropdownMenuPosition(
      { top: 100, bottom: 140, left: 200, right: 320, width: 120, height: 40, x: 200, y: 100, toJSON: () => ({}) },
      { top: 0, bottom: 120, left: 0, right: 200, width: 200, height: 120, x: 0, y: 0, toJSON: () => ({}) },
      'start',
    )
    expect(result.placement).toBe('bottom-start')
    expect(result.top).toBe(144)
    expect(result.left).toBe(200)
  })

  it('flips above when below does not fit but above does', () => {
    const result = computeDropdownMenuPosition(
      { top: 620, bottom: 660, left: 40, right: 160, width: 120, height: 40, x: 40, y: 620, toJSON: () => ({}) },
      { top: 0, bottom: 200, left: 0, right: 200, width: 200, height: 200, x: 0, y: 0, toJSON: () => ({}) },
      'start',
      4,
      8,
      680,
    )
    expect(result.placement.startsWith('top-')).toBe(true)
    expect(result.top).toBeLessThan(620)
  })

  it('stays below when neither side fully fits', () => {
    const result = computeDropdownMenuPosition(
      { top: 340, bottom: 380, left: 40, right: 160, width: 120, height: 40, x: 40, y: 340, toJSON: () => ({}) },
      { top: 0, bottom: 400, left: 0, right: 200, width: 200, height: 400, x: 0, y: 0, toJSON: () => ({}) },
      'start',
      4,
      8,
      700,
    )
    expect(result.placement.startsWith('bottom-')).toBe(true)
    expect(result.top).toBe(384)
  })

  it('aligns to end when preferred', () => {
    const result = computeDropdownMenuPosition(
      { top: 80, bottom: 112, left: 300, right: 420, width: 120, height: 32, x: 300, y: 80, toJSON: () => ({}) },
      { top: 0, bottom: 72, left: 0, right: 120, width: 120, height: 72, x: 0, y: 0, toJSON: () => ({}) },
      'end',
    )
    expect(result.placement).toBe('bottom-end')
    expect(result.left).toBe(300)
  })
})
