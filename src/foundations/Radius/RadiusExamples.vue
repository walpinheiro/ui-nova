<script setup lang="ts">
import VCard from '../../components/containment/VCard/VCard.vue'
import VTag from '../../components/primitives/VTag/VTag.vue'

const scale = [
  { label: 'sm / 8px', class: 'rounded-sm', token: '--v-radius-sm' },
  { label: 'md / 12px', class: 'rounded-md', token: '--v-radius-md' },
  { label: 'lg / 16px', class: 'rounded-lg', token: '--v-radius-lg' },
  { label: '16', class: 'rounded-16', token: '--v-radius-16' },
  { label: '24', class: 'rounded-24', token: '--v-radius-24' },
]
</script>

<template>
  <div class="radius-examples">
    <section class="radius-examples__section">
      <h4 class="radius-examples__heading">Escala Tailwind → token</h4>
      <div class="radius-examples__row">
        <div v-for="item in scale" :key="item.token" class="radius-examples__item">
          <div class="radius-examples__box bg-primary-100 border border-primary-200" :class="item.class" />
          <code class="radius-examples__label">{{ item.class }}</code>
          <span class="radius-examples__meta">{{ item.token }}</span>
        </div>
      </div>
    </section>

    <section class="radius-examples__section">
      <h4 class="radius-examples__heading">Circle vs Pill</h4>
      <div class="radius-examples__compare">
        <div>
          <p class="radius-examples__caption">--v-radius-circle (oval em retângulo)</p>
          <div class="radius-examples__chip radius-examples__chip--circle" />
        </div>
        <div>
          <p class="radius-examples__caption">--v-radius-pill (cápsula)</p>
          <div class="radius-examples__chip radius-examples__chip--pill" />
        </div>
      </div>
    </section>

    <section class="radius-examples__section">
      <h4 class="radius-examples__heading">Nos componentes</h4>
      <div class="radius-examples__components">
        <VTag variant="soft">Tag pill</VTag>
        <VCard title="Card md" style="padding: var(--v-space-4); max-width: 220px">
          <p style="margin:0;color:var(--v-color-text-muted);font-size:var(--v-font-size-text-small)">
            Usa --v-card-radius / rounded-lg
          </p>
        </VCard>
        <div class="radius-examples__avatar" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.radius-examples {
  display: grid;
  gap: var(--v-space-8);
  font-family: var(--v-font-family-sans);

  &__section {
    display: grid;
    gap: var(--v-space-3);
  }

  &__heading {
    margin: 0;
    font-size: var(--v-font-size-text-medium);
    font-weight: var(--v-font-weight-semibold);
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v-space-4);
  }

  &__item {
    display: grid;
    gap: var(--v-space-1);
    justify-items: center;
    width: 5.5rem;
  }

  &__box {
    width: var(--v-space-12);
    height: var(--v-space-8);
  }

  &__label {
    font-size: var(--v-font-size-caption);
  }

  &__meta {
    font-size: var(--v-font-size-caption);
    color: var(--v-color-text-muted);
    text-align: center;
  }

  &__compare {
    display: grid;
    gap: var(--v-space-4);
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  &__caption {
    margin: 0 0 var(--v-space-2);
    font-size: var(--v-font-size-text-small);
    color: var(--v-color-text-muted);
  }

  &__chip {
    width: 7.5rem;
    height: var(--v-space-8);
    background: var(--v-color-primary-100);
    border: var(--v-border-width) solid var(--v-color-primary-200);

    &--circle {
      border-radius: var(--v-radius-circle);
    }

    &--pill {
      border-radius: var(--v-radius-pill);
    }
  }

  &__components {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--v-space-4);
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--v-radius-circle);
    background: var(--v-color-neutral-200);
  }
}
</style>
