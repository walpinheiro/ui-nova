import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { VImageGalleryProps } from './VImageGallery.types'
import { mountVImageGallery } from './mountVImageGallery'

type VImageGalleryEmit = {
  (event: 'select', payload: { indices: number[]; image: { src: string; alt: string } }): void
  (event: 'update:modelValue', payload: number[]): void
  (event: 'open', index: number): void
  (event: 'close'): void
}

export function useVImageGallery(props: VImageGalleryProps, emit: VImageGalleryEmit) {
  const config = computed(() => mountVImageGallery(props))
  const selected = ref<number[]>([...(props.modelValue ?? [])])
  const lightboxOpen = ref(false)
  const lightboxIndex = ref(0)
  const focusedThumb = ref(0)
  const loadedImages = ref<Record<number, boolean>>({})
  const lastTrigger = ref<HTMLElement | null>(null)
  const lightboxRef = ref<HTMLElement | null>(null)

  watch(
    () => props.modelValue,
    (value) => {
      if (value) selected.value = [...value]
    },
  )

  const rootAttrs = computed(() => ({
    class: [
      'v-image-gallery',
      `v-image-gallery--${config.value.layout}`,
      `v-image-gallery--${config.value.size}`,
      { 'v-image-gallery--selectable': config.value.selectable },
    ],
    role: 'list',
    'data-test-id': config.value.testId,
    'data-layout': config.value.layout,
    'data-selectable': config.value.selectable ? 'true' : 'false',
    'data-multiple': config.value.multiple ? 'true' : 'false',
    'aria-multiselectable': config.value.selectable && config.value.multiple ? 'true' : undefined,
    style: config.value.columns ? { '--v-gallery-columns': String(config.value.columns) } : undefined,
  }))

  function isSelected(index: number) {
    return selected.value.includes(index)
  }

  function toggleSelection(index: number) {
    if (!config.value.selectable) return
    if (!config.value.multiple) {
      selected.value = isSelected(index) ? [] : [index]
    } else if (isSelected(index)) {
      selected.value = selected.value.filter((item) => item !== index)
    } else {
      selected.value = [...selected.value, index]
    }
    const image = config.value.images[index]
    emit('update:modelValue', [...selected.value])
    if (image) emit('select', { indices: [...selected.value], image })
  }

  function openLightbox(index: number, trigger?: HTMLElement) {
    lightboxIndex.value = index
    lightboxOpen.value = true
    lastTrigger.value = trigger ?? null
    emit('open', index)
    nextTick(() => lightboxRef.value?.querySelector<HTMLElement>('[data-test-id="v-image-gallery-close"]')?.focus())
  }

  function closeLightbox() {
    lightboxOpen.value = false
    emit('close')
    nextTick(() => lastTrigger.value?.focus())
  }

  function goPrev() {
    if (!config.value.images.length) return
    lightboxIndex.value = (lightboxIndex.value - 1 + config.value.images.length) % config.value.images.length
  }

  function goNext() {
    if (!config.value.images.length) return
    lightboxIndex.value = (lightboxIndex.value + 1) % config.value.images.length
  }

  function onThumbClick(index: number, event: MouseEvent) {
    const target = event.currentTarget as HTMLElement
    if (config.value.selectable && (event.metaKey || event.ctrlKey || event.shiftKey)) {
      toggleSelection(index)
      return
    }
    if (config.value.selectable) toggleSelection(index)
    lightboxIndex.value = index
    openLightbox(index, target)
  }

  function onThumbKeydown(index: number, event: KeyboardEvent) {
    const columns = config.value.columns ?? 3
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusedThumb.value = Math.min(config.value.images.length - 1, index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusedThumb.value = Math.max(0, index - 1)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusedThumb.value = Math.min(config.value.images.length - 1, index + columns)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusedThumb.value = Math.max(0, index - columns)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onThumbClick(index, event as unknown as MouseEvent)
    }
  }

  function onLightboxKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeLightbox()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    } else if (event.key === 'Tab' && lightboxRef.value) {
      const focusable = Array.from(
        lightboxRef.value.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  function markLoaded(index: number) {
    loadedImages.value = { ...loadedImages.value, [index]: true }
  }

  onMounted(() => {
    document.addEventListener('keydown', onDocumentKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', onDocumentKeydown)
  })

  function onDocumentKeydown(event: KeyboardEvent) {
    if (!lightboxOpen.value) return
    onLightboxKeydown(event)
  }

  return {
    config,
    selected,
    lightboxOpen,
    lightboxIndex,
    focusedThumb,
    loadedImages,
    lightboxRef,
    rootAttrs,
    isSelected,
    toggleSelection,
    openLightbox,
    closeLightbox,
    goPrev,
    goNext,
    onThumbClick,
    onThumbKeydown,
    onLightboxKeydown,
    markLoaded,
  }
}
