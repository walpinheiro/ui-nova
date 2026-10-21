/**
 * `recording`: live capture. `paused`: capture on hold. `ready`: a take exists and can be played.
 * `playing`: the take is playing back.
 */
export type VAudioRecorderState = 'recording' | 'paused' | 'ready' | 'playing'
export type VAudioRecorderSize = 'sm' | 'md'

export interface VAudioRecorderProps {
  state?: VAudioRecorderState
  /** Seconds captured (recording/paused) or played (ready/playing). */
  elapsed?: number
  /** Total take length in seconds; drives playback progress. */
  duration?: number
  /** Waveform amplitudes between 0 and 1, oldest first. */
  levels?: number[]
  /** Number of waveform slots. */
  bars?: number
  size?: VAudioRecorderSize
  /** Trailing close button. */
  closable?: boolean
  disabled?: boolean
  ariaLabel?: string
  dataTestId?: string
}

export type VAudioRecorderEmits = {
  discard: []
  pause: []
  resume: []
  save: []
  play: []
  stop: []
  close: []
}
