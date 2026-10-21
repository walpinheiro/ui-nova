import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import fileIcon from '@iconify-icons/keyline-icons/file'
import imageIcon from '@iconify-icons/keyline-icons/image'
import uploadIcon from '@iconify-icons/keyline-icons/upload'
import videoIcon from '@iconify-icons/keyline-icons/video'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VFileUploadProps, VFileUploadSize, VFileUploadVariant } from './VFileUpload.types'

export const V_FILE_UPLOAD_ICON: IconifyIcon = uploadIcon
export const V_FILE_UPLOAD_REMOVE_ICON: IconifyIcon = xIcon
export const V_FILE_UPLOAD_SUCCESS_ICON: IconifyIcon = checkIcon
export const V_FILE_UPLOAD_ERROR_ICON: IconifyIcon = circleAlertIcon

const SIZES: VFileUploadSize[] = ['sm', 'md', 'lg']
const VARIANTS: VFileUploadVariant[] = ['dropzone', 'button', 'compact', 'image']

export function resolveFileTypeIcon(type: string): IconifyIcon {
  if (type.startsWith('image/')) return imageIcon
  if (type.startsWith('video/')) return videoIcon
  return fileIcon
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function mountVFileUpload(props: VFileUploadProps) {
  const size: VFileUploadSize = SIZES.includes(props.size as VFileUploadSize) ? (props.size as VFileUploadSize) : 'md'
  const variant: VFileUploadVariant = VARIANTS.includes(props.variant as VFileUploadVariant)
    ? (props.variant as VFileUploadVariant)
    : 'dropzone'
  const disabled = Boolean(props.disabled)
  const multiple = props.multiple !== false
  const autoUpload = props.autoUpload !== false
  const simulateUpload = props.simulateUpload !== false

  return {
    size,
    variant,
    disabled,
    multiple,
    autoUpload,
    simulateUpload,
    accept: props.accept ?? '',
    maxSize: props.maxSize,
    helperText: props.helperText ?? 'Max 10 MB per file.',
    label: props.label,
    buttonLabel: props.buttonLabel ?? 'Choose files',
    dropzoneTitle: props.dropzoneTitle ?? 'Drag and drop files here or click to browse',
    dropzoneHint: props.dropzoneHint ?? 'Supports images, documents and more.',
    uploadIcon: V_FILE_UPLOAD_ICON,
    removeIcon: V_FILE_UPLOAD_REMOVE_ICON,
    successIcon: V_FILE_UPLOAD_SUCCESS_ICON,
    errorIcon: V_FILE_UPLOAD_ERROR_ICON,
  } as const
}
