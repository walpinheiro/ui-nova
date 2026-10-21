import type { VMotionLevel } from '../../../motion/types'

export interface VPromptBarProps {
  modelValue?: string
  busy?: boolean
  placeholder?: string
  motion?: VMotionLevel
  disabled?: boolean
  sendLabel?: string
  stopLabel?: string
  attachLabel?: string
  ariaLabel?: string
  /** Voice Pill: show dictation mic control (on by default). */
  dictation?: boolean
  dictationLabel?: string
  /** BCP-47 language for speech recognition. */
  dictationLang?: string
}

export type VPromptBarEmit = {
  (event: 'update:modelValue', value: string): void
  (event: 'send'): void
  (event: 'stop'): void
  (event: 'dictation-start'): void
  (event: 'dictation-stop'): void
  (event: 'dictation-error', message: string): void
}
