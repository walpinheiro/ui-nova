import type { VAudioRecorderProps, VAudioRecorderSize, VAudioRecorderState } from './VAudioRecorder.types'

const STATES: VAudioRecorderState[] = ['recording', 'paused', 'ready', 'playing']
const SIZES: VAudioRecorderSize[] = ['sm', 'md']

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds || 0))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function mountVAudioRecorder(props: VAudioRecorderProps) {
  const state = STATES.includes(props.state as VAudioRecorderState) ? (props.state as VAudioRecorderState) : 'ready'
  const size = SIZES.includes(props.size as VAudioRecorderSize) ? (props.size as VAudioRecorderSize) : 'md'
  const slots = Math.max(8, Math.floor(props.bars ?? 32))
  const capturing = state === 'recording' || state === 'paused'
  const levels = props.levels ?? []
  // While capturing, keep the newest samples; for a finished take, resample to fit.
  const source = capturing ? levels.slice(-slots) : resample(levels, slots)
  const elapsed = Math.max(0, props.elapsed ?? 0)
  const duration = Math.max(0, props.duration ?? 0)
  const progress = !capturing && duration > 0 ? Math.min(1, elapsed / duration) : 0
  const playedSlots = Math.round(progress * slots)

  const waveform = Array.from({ length: slots }, (_, index) => {
    const level = source[index]
    return {
      key: index,
      empty: level === undefined,
      height: level === undefined ? 0 : Math.max(0.12, Math.min(1, level)),
      played: !capturing && index < playedSlots,
    }
  })

  return {
    state,
    size,
    capturing,
    time: formatClock(elapsed),
    progress,
    waveform,
  } as const
}

function resample(levels: number[], slots: number): number[] {
  if (levels.length <= slots) return levels
  const bucket = levels.length / slots
  return Array.from({ length: slots }, (_, index) => {
    const start = Math.floor(index * bucket)
    const end = Math.max(start + 1, Math.floor((index + 1) * bucket))
    return Math.max(...levels.slice(start, end))
  })
}
