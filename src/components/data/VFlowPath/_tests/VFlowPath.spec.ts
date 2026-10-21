/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VFlowPath from '../VFlowPath.vue'
import { mountVFlowPath } from '../mountVFlowPath'

const nodes = [
  { id: 'router', title: 'Router Agent' },
  { id: 'billing', title: 'Billing Agent' },
  { id: 'ledger', title: 'Ledger' },
]

describe('mountVFlowPath', () => {
  it('interleaves nodes and edges, defaulting edge status to success', () => {
    const { segments } = mountVFlowPath({ nodes, edges: [{ status: 'error' }] })
    expect(segments.map((segment) => segment.kind)).toEqual(['node', 'edge', 'node', 'edge', 'node'])
    const edges = segments.filter((segment) => segment.kind === 'edge')
    expect(edges.map((edge) => edge.kind === 'edge' && edge.edge.status)).toEqual(['error', 'success'])
  })
})

describe('VFlowPath', () => {
  it('renders metrics in the connector chip', () => {
    const wrapper = mount(VFlowPath, {
      props: { nodes: nodes.slice(0, 2), edges: [{ metrics: [{ value: '9.1 KB', label: 'context' }] }] },
    })
    expect(wrapper.findAll('[data-test-id="v-flow-path-node"]')).toHaveLength(2)
    const edge = wrapper.get('[data-test-id="v-flow-path-edge"]')
    expect(edge.text()).toContain('9.1 KB')
    expect(edge.attributes('aria-label')).toContain('Router Agent to Billing Agent')
  })
})
