<script setup lang="ts">
import './VPagination.scss'
import { VIcon } from '../../primitives/VIcon'
import VDropdownMenu from '../VDropdownMenu/VDropdownMenu.vue'
import { PAGINATION_UI_ICONS } from './mountVPagination'
import { useVPagination } from './useVPagination'
import type { VPaginationProps } from './VPagination.types'

const props = withDefaults(defineProps<VPaginationProps>(), {
  total: 0,
  pageSize: 10,
  size: 'md',
  variant: 'default',
  disabled: false,
  loading: false,
  showPageSize: false,
  showResultCount: false,
})

const emit = defineEmits<{
  'update:modelValue': [page: number]
  'update:page': [page: number]
  'update:pageSize': [size: number]
}>()

const vm = useVPagination(props, ((event: 'update:modelValue' | 'update:page' | 'update:pageSize', value: number) => (emit as (e: string, v: number) => void)(event, value)) as Parameters<typeof useVPagination>[1])
</script>

<template>
  <nav v-bind="vm.rootAttrs.value">
    <div
      class="v-pagination__toolbar"
      :class="{ 'v-pagination__toolbar--with-meta': vm.hasMeta.value }"
    >
      <div
        class="v-pagination__controls"
        :class="{ 'v-pagination__controls--loading': loading }"
        data-test-id="v-pagination-controls"
        role="presentation"
      >
        <div
          v-if="loading"
          class="v-pagination__controls-busy"
          role="status"
          aria-live="polite"
          aria-label="Loading pagination"
          data-test-id="v-pagination-loader"
        >
          <span class="v-pagination__loader" aria-hidden="true" />
        </div>

        <button
          type="button"
          class="v-pagination__btn v-pagination__btn--nav"
          :class="{ 'v-pagination__btn--compact': vm.config.value.variant === 'compact' }"
          :disabled="vm.config.value.interactionDisabled || vm.config.value.isFirstPage || undefined"
          :aria-label="vm.config.value.variant === 'compact' ? vm.config.value.prevLabel : 'Previous page'"
          data-test-id="v-pagination-prev"
          @click="vm.goPrev()"
          @keydown="vm.onKeydown($event)"
        >
          <VIcon :icon="PAGINATION_UI_ICONS.chevronLeft" size="sm" class="v-pagination__chevron" aria-hidden="true" />
          <span
            v-if="vm.config.value.variant === 'compact'"
            class="v-pagination__nav-label"
          >
            {{ vm.config.value.prevLabel }}
          </span>
        </button>

        <template v-if="vm.config.value.variant !== 'compact'">
          <template
            v-for="item in vm.config.value.items"
            :key="item.kind === 'page' ? `page-${item.page}` : `ellipsis-${item.id}`"
          >
            <span
              v-if="item.kind === 'ellipsis'"
              class="v-pagination__ellipsis"
              aria-hidden="true"
              data-test-id="v-pagination-ellipsis"
            >
              &hellip;
            </span>
            <button
              v-else
              type="button"
              class="v-pagination__btn v-pagination__btn--page"
              :class="{ 'v-pagination__btn--active': item.page === vm.config.value.currentPage }"
              :disabled="vm.config.value.interactionDisabled || undefined"
              :aria-label="`Go to page ${item.page}`"
              :aria-current="item.page === vm.config.value.currentPage ? 'page' : undefined"
              :data-test-id="`v-pagination-page-${item.page}`"
              @click="vm.goToPage(item.page)"
              @keydown="vm.onKeydown($event, item.page)"
            >
              {{ item.page }}
            </button>
          </template>
        </template>

        <button
          type="button"
          class="v-pagination__btn v-pagination__btn--nav"
          :class="{ 'v-pagination__btn--compact': vm.config.value.variant === 'compact' }"
          :disabled="vm.config.value.interactionDisabled || vm.config.value.isLastPage || undefined"
          :aria-label="vm.config.value.variant === 'compact' ? vm.config.value.nextLabel : 'Next page'"
          data-test-id="v-pagination-next"
          @click="vm.goNext()"
          @keydown="vm.onKeydown($event)"
        >
          <span
            v-if="vm.config.value.variant === 'compact'"
            class="v-pagination__nav-label"
          >
            {{ vm.config.value.nextLabel }}
          </span>
          <VIcon :icon="PAGINATION_UI_ICONS.chevronRight" size="sm" class="v-pagination__chevron" aria-hidden="true" />
        </button>
      </div>

      <div
        v-if="vm.hasMeta.value"
        class="v-pagination__meta"
        data-test-id="v-pagination-meta"
      >
        <div
          v-if="vm.config.value.showPageSize"
          class="v-pagination__page-size"
          data-test-id="v-pagination-page-size"
        >
          <span class="v-pagination__page-size-label">{{ vm.config.value.pageSizeLabel }}</span>
          <VDropdownMenu
            class="v-pagination__page-size-dropdown"
            trigger-style="field"
            variant="secondary"
            :size="vm.pageSizeDropdownSize.value"
            menu-align="end"
            :show-trigger-icon="false"
            :disabled="vm.config.value.interactionDisabled"
            :loading="vm.config.value.loading"
            :label="String(vm.config.value.pageSize)"
            :value="String(vm.config.value.pageSize)"
            :items="vm.config.value.pageSizeDropdownItems"
            :aria-label="vm.config.value.pageSizeLabel"
            data-test-id="v-pagination-page-size-dropdown"
            @update:value="vm.onPageSizeSelect"
          />
        </div>
        <p
          v-if="vm.config.value.showResultCount"
          class="v-pagination__result-count"
          data-test-id="v-pagination-result-count"
        >
          {{ vm.config.value.resultCount }}
        </p>
      </div>
    </div>
  </nav>
</template>
