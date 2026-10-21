import { computed, ref, useId } from 'vue'
import { formatFileSize, mountVFileUpload, resolveFileTypeIcon } from './mountVFileUpload'
import type { VFileUploadFile, VFileUploadItemStatus, VFileUploadProps, VFileUploadState } from './VFileUpload.types'

type VFileUploadEmit = {
  (event: 'update:modelValue', value: File[]): void
  (event: 'change', value: File[]): void
  (event: 'upload', item: VFileUploadFile): void
  (event: 'error', payload: { file: File; message: string }): void
  (event: 'remove', file: File): void
}

let fileCounter = 0

function createId() {
  fileCounter += 1
  return `v-file-upload-${fileCounter}`
}

function validateFile(file: File, accept: string, maxSize?: number): string | null {
  if (maxSize && file.size > maxSize) {
    return `File exceeds max size of ${formatFileSize(maxSize)}`
  }
  if (!accept) return null

  const tokens = accept.split(',').map((token) => token.trim()).filter(Boolean)
  if (!tokens.length) return null

  const matches = tokens.some((token) => {
    if (token.startsWith('.')) return file.name.toLowerCase().endsWith(token.toLowerCase())
    if (token.endsWith('/*')) return file.type.startsWith(token.slice(0, -1))
    return file.type === token
  })

  return matches ? null : 'File type not supported'
}

export function useVFileUpload(props: VFileUploadProps, emit: VFileUploadEmit) {
  const config = computed(() => mountVFileUpload(props))
  const generatedId = useId()
  const inputId = computed(() => `v-file-upload-input-${generatedId}`)
  const helperId = computed(() => `${inputId.value}-helper`)
  const inputRef = ref<HTMLInputElement | null>(null)
  const dragOver = ref(false)
  const items = ref<VFileUploadFile[]>([])

  const files = computed(() => props.modelValue ?? [])

  const syncItemsFromModel = () => {
    const existing = new Map(items.value.map((item) => [item.file, item]))
    items.value = files.value.map((file) => {
      const found = existing.get(file)
      if (found) return found
      return {
        id: createId(),
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'pending' as VFileUploadItemStatus,
      }
    })
  }

  syncItemsFromModel()

  const updateModel = (nextFiles: File[]) => {
    emit('update:modelValue', nextFiles)
    emit('change', nextFiles)
    syncItemsFromModel()
  }

  const zoneState = computed<VFileUploadState>(() => {
    if (config.value.disabled) return 'disabled'
    if (items.value.some((item) => item.status === 'uploading')) return 'uploading'
    if (items.value.some((item) => item.status === 'error')) return 'error'
    if (items.value.length && items.value.every((item) => item.status === 'complete')) return 'success'
    if (dragOver.value) return 'drag-over'
    return 'idle'
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-file-upload',
      `v-file-upload--${config.value.variant}`,
      `v-file-upload--${config.value.size}`,
      `v-file-upload--${zoneState.value}`,
      { 'v-file-upload--disabled': config.value.disabled },
    ],
    'data-test-id': 'file-upload',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': zoneState.value,
  }))

  const describedBy = computed(() => (config.value.helperText ? helperId.value : undefined))

  const openPicker = () => {
    if (config.value.disabled) return
    inputRef.value?.click()
  }

  const startUpload = (item: VFileUploadFile) => {
    if (!config.value.autoUpload) return
    item.status = 'uploading'
    emit('upload', item)

    if (!config.value.simulateUpload) return

    const timer = window.setInterval(() => {
      item.progress = Math.min(100, item.progress + 18)
      if (item.progress >= 100) {
        window.clearInterval(timer)
        item.status = 'complete'
      }
    }, 120)
  }

  const addFiles = (fileList: FileList | File[]) => {
    if (config.value.disabled) return
    const incoming = Array.from(fileList)
    const nextFiles = config.value.multiple ? [...files.value] : []

    for (const file of incoming) {
      const errorMessage = validateFile(file, config.value.accept, config.value.maxSize)
      if (errorMessage) {
        emit('error', { file, message: errorMessage })
        if (!config.value.multiple) {
          const rejected: VFileUploadFile = {
            id: createId(),
            file,
            name: file.name,
            size: file.size,
            progress: 0,
            status: 'error',
            errorMessage,
          }
          items.value = [rejected]
          updateModel([])
          return
        }
        continue
      }

      if (!config.value.multiple) nextFiles.length = 0
      nextFiles.push(file)
    }

    updateModel(nextFiles)
    items.value.forEach((item) => {
      if (item.status === 'pending') startUpload(item)
    })
  }

  const onInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files?.length) addFiles(target.files)
    target.value = ''
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    dragOver.value = false
    if (event.dataTransfer?.files?.length) addFiles(event.dataTransfer.files)
  }

  const onDragOver = (event: DragEvent) => {
    event.preventDefault()
    if (!config.value.disabled) dragOver.value = true
  }

  const onDragLeave = () => {
    dragOver.value = false
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (config.value.disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openPicker()
    }
  }

  const removeItem = (item: VFileUploadFile) => {
    items.value = items.value.filter((entry) => entry.id !== item.id)
    const nextFiles = files.value.filter((file) => file !== item.file)
    updateModel(nextFiles)
    emit('remove', item.file)
  }

  const resolveIcon = (type: string) => resolveFileTypeIcon(type)

  return {
    config,
    inputId,
    helperId,
    inputRef,
    items,
    rootAttrs,
    describedBy,
    zoneState,
    openPicker,
    onInputChange,
    onDrop,
    onDragOver,
    onDragLeave,
    onKeydown,
    removeItem,
    resolveIcon,
    formatFileSize,
  }
}
