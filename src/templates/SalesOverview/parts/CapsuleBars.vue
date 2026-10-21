<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ bars: { day: string; value: number; label: string }[]; height?: number }>()
const max = computed(() => Math.max(...props.bars.map((b) => b.value)))
const peak = computed(() => props.bars.findIndex((b) => b.value === max.value))
</script>

<template>
  <ul class="caps" :style="{ '--caps-base': `${height ?? 150}px` }" aria-label="Pipeline value by day">
    <li v-for="(b, i) in bars" :key="b.day" class="caps__col">
      <span class="caps__track">
        <span class="caps__value" :class="{ 'caps__value--peak': i === peak }">{{ b.label }}</span>
        <span class="caps__bar" :class="{ 'caps__bar--peak': i === peak }" :style="{ height: `calc((100% - 28px) * ${b.value / max})` }" />
      </span>
      <span class="caps__day">{{ b.day }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.caps {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;

  &__col {
    display: grid;
    justify-items: center;
    gap: 8px;
  }

  &__value {
    font-size: 11px;
    font-weight: 600;
    color: var(--v-color-text-muted);

    &--peak {
      color: var(--so-accent);
    }
  }

  &__track {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    width: 100%;
    height: var(--caps-h, var(--caps-base));
  }

  &__bar {
    width: min(100%, 38px);
    min-height: 22px;
    flex: none;
    border-radius: 999px;
    background:
      repeating-linear-gradient(-45deg, var(--so-accent) 0 3px, transparent 3px 7px),
      color-mix(in srgb, var(--so-accent) 22%, var(--v-color-surface));
    box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--so-accent) 70%, transparent);
    opacity: 0.55;
    transition: opacity 0.15s;

    &--peak {
      opacity: 1;
    }
  }

  &__col:hover &__bar {
    opacity: 1;
  }

  &__day {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--v-color-text-muted);
  }
}
</style>
