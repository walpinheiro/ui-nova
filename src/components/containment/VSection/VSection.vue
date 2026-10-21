<script setup lang="ts">

import './VSection.scss'

import { VIcon } from '../../primitives/VIcon'

import { useVSection } from './useVSection'

import type { VSectionProps } from './VSection.types'



const props = withDefaults(defineProps<VSectionProps>(), {

  size: 'md',

  variant: 'default',

  headingLevel: '2',

})

const vm = useVSection(props)

</script>



<template>

  <section v-bind="vm.rootAttrs.value">

    <header

      v-if="title || $slots.header || $slots.actions || icon || $slots.icon"

      class="v-section__header"

      data-test-id="v-section-header"

    >

      <span

        v-if="icon || $slots.icon"

        class="v-section__icon"

        data-test-id="v-section-icon"

        aria-hidden="true"

      >

        <slot v-if="$slots.icon" name="icon" />

        <VIcon v-else-if="vm.config.value.iconData" :icon="vm.config.value.iconData" size="md" />

      </span>

      <span class="v-section__titles">

        <component

          :is="`h${vm.config.value.headingLevel}`"

          v-if="title"

          :id="vm.headingId"

          class="v-section__heading"

          data-test-id="v-section-heading"

        >

          {{ title }}

        </component>

        <component

          :is="`h${vm.config.value.headingLevel}`"

          v-else-if="$slots.title"

          :id="vm.headingId"

          class="v-section__heading"

          data-test-id="v-section-heading"

        >

          <slot name="title" />

        </component>

        <p v-if="description" class="v-section__description" data-test-id="v-section-description">

          {{ description }}

        </p>

        <p v-else-if="$slots.description" class="v-section__description" data-test-id="v-section-description">

          <slot name="description" />

        </p>

      </span>

      <span v-if="$slots.header || $slots.actions" class="v-section__actions" data-test-id="v-section-actions">

        <slot name="header" />

        <slot name="actions" />

      </span>

    </header>

    <div class="v-section__content" data-test-id="v-section-content">

      <slot />

    </div>

    <footer v-if="$slots.footer" class="v-section__footer" data-test-id="v-section-footer">

      <slot name="footer" />

    </footer>

  </section>

</template>

