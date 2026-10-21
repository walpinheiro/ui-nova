<script setup lang="ts">
import './VImageGallery.scss'
import { VIcon } from '../../primitives/VIcon'
import { V_IMAGE_GALLERY_ICONS } from './mountVImageGallery'
import { useVImageGallery } from './useVImageGallery'
import type { VImageGalleryProps } from './VImageGallery.types'

const props = withDefaults(defineProps<VImageGalleryProps>(), {
  images: () => [],
  layout: 'grid',
  size: 'md',
  selectable: false,
  multiple: false,
  loading: false,
})

const emit = defineEmits<{
  select: [{ indices: number[]; image: { src: string; alt: string } }]
  'update:modelValue': [number[]]
  open: [number]
  close: []
}>()

const vm = useVImageGallery(props, emit)
</script>

<template>
  <div v-bind="(vm.rootAttrs.value as Record<string, unknown>)">
    <div
      v-if="vm.config.value.isEmpty"
      class="v-image-gallery__empty"
      data-test-id="v-image-gallery-empty"
      role="status"
    >
      <VIcon :icon="V_IMAGE_GALLERY_ICONS.empty" size="lg" />
      <span>No images</span>
    </div>

    <template v-else>
      <div
        v-for="(image, index) in vm.config.value.images"
        :key="image.id ?? `${image.src}-${index}`"
        class="v-image-gallery__thumb"
        :class="{
          'v-image-gallery__thumb--selected': vm.isSelected(index),
          'v-image-gallery__thumb--loading': !vm.loadedImages.value[index] && !loading,
        }"
        role="listitem"
        :data-test-id="`v-image-gallery-thumb-${index}`"
        :aria-selected="vm.config.value.selectable ? (String(vm.isSelected(index)) as 'true' | 'false') : undefined"
        tabindex="0"
        @click="vm.onThumbClick(index, $event)"
        @keydown="vm.onThumbKeydown(index, $event)"
      >
        <img
          class="v-image-gallery__image"
          :src="image.src"
          :alt="image.alt"
          @load="vm.markLoaded(index)"
        />

        <span
          v-if="!vm.loadedImages.value[index] && !loading"
          class="v-image-gallery__loading"
          data-test-id="v-image-gallery-loading"
          aria-hidden="true"
        />

        <span class="v-image-gallery__overlay" data-test-id="v-image-gallery-overlay">
          View
        </span>

        <span
          v-if="vm.config.value.selectable && vm.isSelected(index)"
          class="v-image-gallery__selection"
          :data-test-id="`v-image-gallery-selection-${index}`"
          aria-hidden="true"
        >
          <VIcon :icon="V_IMAGE_GALLERY_ICONS.check" size="sm" />
        </span>
      </div>
    </template>

    <Teleport to="body">
      <div
        v-if="vm.lightboxOpen.value"
        :ref="(el) => vm.lightboxRef.value = el as HTMLElement"
        class="v-image-gallery-lightbox"
        data-test-id="v-image-gallery-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="`Image ${vm.lightboxIndex.value + 1} of ${vm.config.value.images.length}`"
        @keydown="vm.onLightboxKeydown"
      >
        <div class="v-image-gallery-lightbox__backdrop" @click="vm.closeLightbox()" />

        <div class="v-image-gallery-lightbox__panel">
          <header class="v-image-gallery-lightbox__header">
            <span data-test-id="v-image-gallery-counter">
              {{ vm.lightboxIndex.value + 1 }} / {{ vm.config.value.images.length }}
            </span>
            <button
              type="button"
              class="v-image-gallery-lightbox__close"
              data-test-id="v-image-gallery-close"
              aria-label="Close preview"
              @click="vm.closeLightbox()"
            >
              <VIcon :icon="V_IMAGE_GALLERY_ICONS.close" size="sm" />
            </button>
          </header>

          <div class="v-image-gallery-lightbox__stage">
            <button
              type="button"
              class="v-image-gallery-lightbox__nav"
              data-test-id="v-image-gallery-prev"
              aria-label="Previous image"
              @click="vm.goPrev()"
            >
              <VIcon :icon="V_IMAGE_GALLERY_ICONS.prev" size="md" />
            </button>

            <img
              v-if="vm.config.value.images[vm.lightboxIndex.value]"
              class="v-image-gallery-lightbox__image"
              :src="vm.config.value.images[vm.lightboxIndex.value].src"
              :alt="vm.config.value.images[vm.lightboxIndex.value].alt"
            />

            <button
              type="button"
              class="v-image-gallery-lightbox__nav"
              data-test-id="v-image-gallery-next"
              aria-label="Next image"
              @click="vm.goNext()"
            >
              <VIcon :icon="V_IMAGE_GALLERY_ICONS.next" size="md" />
            </button>
          </div>

          <footer class="v-image-gallery-lightbox__filmstrip" data-test-id="v-image-gallery-filmstrip">
            <button
              v-for="(image, index) in vm.config.value.images.slice(0, 5)"
              :key="`film-${image.id ?? index}`"
              type="button"
              class="v-image-gallery-lightbox__filmstrip-thumb"
              :class="{ 'v-image-gallery-lightbox__filmstrip-thumb--active': index === vm.lightboxIndex.value }"
              :data-test-id="`v-image-gallery-filmstrip-thumb-${index}`"
              :aria-label="`Go to image ${index + 1}`"
              @click="vm.lightboxIndex.value = index"
            >
              <img :src="image.src" :alt="image.alt" />
            </button>
          </footer>
        </div>
      </div>
    </Teleport>

    <slot name="lightbox" :image="vm.config.value.images[vm.lightboxIndex.value]" />
  </div>
</template>
