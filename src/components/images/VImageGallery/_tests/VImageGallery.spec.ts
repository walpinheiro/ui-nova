// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import VImageGallery from '../VImageGallery.vue'
import { mountVImageGallery } from '../mountVImageGallery'

const images = [
  { src: 'https://example.com/1.jpg', alt: 'Mountain lake' },
  { src: 'https://example.com/2.jpg', alt: 'Santorini' },
  { src: 'https://example.com/3.jpg', alt: 'Forest' },
]

afterEach(() => {
  document.body.innerHTML = ''
})

describe('VImageGallery mount helpers', () => {
  it('normalizes layout and empty state', () => {
    expect(mountVImageGallery({ layout: 'grid' }).layout).toBe('grid')
    expect(mountVImageGallery({ images: [] }).isEmpty).toBe(true)
  })
})

describe('VImageGallery', () => {
  it('renders grid thumbnails with anatomy ids', () => {
    const wrapper = mount(VImageGallery, { props: { images, layout: 'grid', selectable: true, multiple: true } })
    expect(wrapper.get('[data-test-id="v-image-gallery"]').attributes('data-layout')).toBe('grid')
    expect(wrapper.get('[data-test-id="v-image-gallery-thumb-0"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-image-gallery-overlay"]').exists()).toBe(true)
  })

  it('toggles selection and emits select', async () => {
    const wrapper = mount(VImageGallery, { props: { images, selectable: true, multiple: true } })
    await wrapper.get('[data-test-id="v-image-gallery-thumb-0"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[0]])
    expect(wrapper.get('[data-test-id="v-image-gallery-selection-0"]').exists()).toBe(true)
  })

  it('renders empty state', () => {
    const wrapper = mount(VImageGallery, { props: { images: [] } })
    expect(wrapper.get('[data-test-id="v-image-gallery-empty"]').text()).toContain('No images')
  })

  it('opens lightbox with counter and navigation controls', async () => {
    const wrapper = mount(VImageGallery, { props: { images } })
    await wrapper.get('[data-test-id="v-image-gallery-thumb-1"]').trigger('click')
    await flushPromises()
    expect(document.querySelector('[data-test-id="v-image-gallery-lightbox"]')).toBeTruthy()
    expect(document.querySelector('[data-test-id="v-image-gallery-counter"]')?.textContent).toContain('2 / 3')
    expect(document.querySelector('[data-test-id="v-image-gallery-prev"]')).toBeTruthy()
    expect(document.querySelector('[data-test-id="v-image-gallery-next"]')).toBeTruthy()
    expect(document.querySelector('[data-test-id="v-image-gallery-filmstrip"]')).toBeTruthy()
  })
})
