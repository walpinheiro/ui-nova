import type { VFlowEdge, VFlowNode, VFlowPathProps, VFlowStatus } from './VFlowPath.types'

const STATUSES: VFlowStatus[] = ['success', 'warning', 'error', 'neutral', 'active']

export type VFlowSegment =
  | { kind: 'node'; key: string; node: VFlowNode; index: number }
  | { kind: 'edge'; key: string; edge: Required<Pick<VFlowEdge, 'status'>> & VFlowEdge; from: VFlowNode; to: VFlowNode; index: number }

export function mountVFlowPath(props: VFlowPathProps) {
  const nodes = props.nodes ?? []
  const edges = props.edges ?? []
  const segments: VFlowSegment[] = []

  nodes.forEach((node, index) => {
    segments.push({ kind: 'node', key: `node-${node.id}`, node, index })
    const next = nodes[index + 1]
    if (!next) return
    const edge = edges[index] ?? {}
    const status = STATUSES.includes(edge.status as VFlowStatus) ? (edge.status as VFlowStatus) : 'success'
    segments.push({ kind: 'edge', key: `edge-${node.id}-${next.id}`, edge: { ...edge, status }, from: node, to: next, index })
  })

  return { segments } as const
}
