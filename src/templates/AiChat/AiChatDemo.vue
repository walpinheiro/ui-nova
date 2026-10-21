<script setup lang="ts">
import { computed } from 'vue'
import VAgentChip from '../../components/feedback/VAgentChip/VAgentChip.vue'
import VThoughtLine from '../../components/feedback/VThoughtLine/VThoughtLine.vue'
import VSpinner from '../../components/feedback/VSpinner/VSpinner.vue'
import VPromptBar from '../../components/form/VPromptBar/VPromptBar.vue'
import TemplateSidebar from '../_shared/TemplateSidebar.vue'
import {
  getTemplateCategoryForItem,
  getTemplateMenuKindLabel,
} from '../_shared/templateNavigation'
import { useAiChatConversation } from '../_shared/useAiChatConversation'

const activeItem = defineModel<string>('activeItem', { default: 'ai-chat' })

const {
  messages,
  prompt,
  busy,
  chipStatus,
  chipDuration,
  chipLabel,
  thoughtDuration,
  thoughtExpanded,
  showThinking,
  steps,
  onSend,
} = useAiChatConversation()

const category = computed(() => getTemplateCategoryForItem(activeItem.value))
</script>

<template>
  <div class="ai-chat-demo">
    <TemplateSidebar v-model:active-item="activeItem" search-placeholder="Buscar conversas…" />

    <main class="ai-chat-demo__main">
      <header class="ai-chat-demo__header">
        <div>
          <p class="ai-chat-demo__eyebrow">
            {{ category ? getTemplateMenuKindLabel(category.menuKind) : 'Chat' }}
            <span v-if="category"> · {{ category.label }}</span>
          </p>
          <h1 class="ai-chat-demo__title">Assistente IA</h1>
        </div>
        <VSpinner v-if="busy" variant="lattice" verb="Thinking" label="Thinking" />
      </header>

      <div class="ai-chat-demo__thread" role="log" aria-live="polite" aria-relevant="additions">
        <article
          v-for="message in messages"
          :key="message.id"
          class="ai-chat-demo__message"
          :class="`ai-chat-demo__message--${message.role}`"
        >
          <span class="ai-chat-demo__avatar" aria-hidden="true">
            {{ message.role === 'user' ? 'AC' : 'AI' }}
          </span>
          <p class="ai-chat-demo__bubble">{{ message.text }}</p>
        </article>

        <div v-if="showThinking" class="ai-chat-demo__thinking">
          <VAgentChip
            :label="chipLabel"
            :status="chipStatus"
            :duration-ms="chipDuration"
            motion="expressive"
          />
          <VThoughtLine
            label="Raciocínio"
            :steps="steps"
            :duration="thoughtDuration"
            :default-expanded="thoughtExpanded"
            motion="expressive"
          />
        </div>
      </div>

      <footer class="ai-chat-demo__composer">
        <VPromptBar
          v-model="prompt"
          :busy="busy"
          motion="expressive"
          dictation
          dictation-lang="pt-BR"
          placeholder="Pergunte sobre tokens, layouts ou componentes…"
          @send="onSend()"
        />
      </footer>
    </main>
  </div>
</template>

<style scoped lang="scss">
.ai-chat-demo {
  display: flex;
  height: 100%;
  min-height: 100%;
  background: var(--v-color-bg);

  &__main {
    display: grid;
    grid-template-rows: auto 1fr auto;
    flex: 1;
    min-width: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--v-space-4);
    padding: var(--v-space-4) var(--v-space-6);
    border-bottom: var(--v-border-width) solid var(--v-color-border);
    background: var(--v-color-elevated);
  }

  &__eyebrow {
    margin: 0 0 var(--v-space-1);
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--v-color-primary-600);
  }

  &__title {
    margin: 0;
    font-size: var(--v-font-size-h4);
    font-weight: var(--v-font-weight-bold);
    color: var(--v-color-text);
  }

  &__thread {
    display: flex;
    flex-direction: column;
    gap: var(--v-space-4);
    padding: var(--v-space-6);
    overflow: auto;
  }

  &__message {
    display: flex;
    gap: var(--v-space-3);
    max-width: 36rem;
    animation: ai-chat-enter var(--v-motion-normal) var(--v-ease-out);

    &--user {
      align-self: flex-end;
      flex-direction: row-reverse;

      .ai-chat-demo__bubble {
        background: var(--v-color-primary);
        color: var(--v-color-on-primary);
      }

      .ai-chat-demo__avatar {
        background: var(--v-color-primary-100);
        color: var(--v-color-primary-700);
      }
    }

    &--assistant {
      align-self: flex-start;
    }
  }

  &__avatar {
    flex-shrink: 0;
    width: var(--v-space-8);
    height: var(--v-space-8);
    border-radius: var(--v-radius-circle);
    display: grid;
    place-items: center;
    background: var(--v-color-neutral-200);
    color: var(--v-color-text);
    font-size: var(--v-font-size-caption);
    font-weight: var(--v-font-weight-semibold);
  }

  &__bubble {
    margin: 0;
    padding: var(--v-space-3) var(--v-space-4);
    border-radius: var(--v-radius-lg);
    background: var(--v-color-elevated);
    border: var(--v-border-width) solid var(--v-color-border);
    font-size: var(--v-font-size-text-medium);
    line-height: var(--v-line-height-text-medium);
    color: var(--v-color-text);
    box-shadow: var(--v-shadow-sm);
  }

  &__thinking {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--v-space-3);
    max-width: 28rem;
    animation: ai-chat-enter var(--v-motion-normal) var(--v-ease-spring);
  }

  &__composer {
    padding: var(--v-space-4) var(--v-space-6) var(--v-space-6);
    border-top: var(--v-border-width) solid var(--v-color-border);
    background: var(--v-color-surface);
  }
}

@keyframes ai-chat-enter {
  from {
    opacity: var(--v-state-loading-opacity);
    transform: scale(var(--v-state-enter-scale));
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
