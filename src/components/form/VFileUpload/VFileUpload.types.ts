export type VFileUploadSize = 'sm' | 'md' | 'lg'
export type VFileUploadVariant = 'dropzone' | 'button' | 'compact' | 'image'
export type VFileUploadState =
  | 'idle'
  | 'hover'
  | 'drag-over'
  | 'uploading'
  | 'success'
  | 'error'
  | 'disabled'

export type VFileUploadItemStatus = 'pending' | 'uploading' | 'complete' | 'error'

export interface VFileUploadFile {
  id: string
  file: File
  name: string
  size: number
  progress: number
  status: VFileUploadItemStatus
  errorMessage?: string
}

export interface VFileUploadProps {
  modelValue?: File[]
  variant?: VFileUploadVariant
  size?: VFileUploadSize
  accept?: string
  multiple?: boolean
  disabled?: boolean
  maxSize?: number
  helperText?: string
  label?: string
  buttonLabel?: string
  dropzoneTitle?: string
  dropzoneHint?: string
  autoUpload?: boolean
  simulateUpload?: boolean
}
