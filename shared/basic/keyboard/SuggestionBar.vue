<script setup lang="ts">
import type { SuggestionItem } from "./types";

interface Props {
  suggestions: SuggestionItem[];
}

withDefaults(defineProps<Props>(), {
  suggestions: () => [],
});

defineEmits<{
  select: [suggestion: string];
}>();

const getTypeLabel = (type: "dish" | "category") => {
  return type === "dish" ? "блюдо" : "категория";
};

const getTypeIcon = (type: "dish" | "category") => {
  return type === "dish" ? "🍽️" : "📁";
};
</script>

<template>
  <section class="suggestions">
    <button
      v-for="suggestion in suggestions"
      :key="suggestion.name"
      class="suggestion-button"
      :class="`suggestion-${suggestion.type}`"
      @click="$emit('select', suggestion.name)"
    >
      <div class="suggestion-content">
        <div class="suggestion-icon">{{ getTypeIcon(suggestion.type) }}</div>
        <div class="suggestion-text">
          <div class="suggestion-name">{{ suggestion.name }}</div>
          <div class="suggestion-type">{{ getTypeLabel(suggestion.type) }}</div>
        </div>
      </div>
    </button>
  </section>
</template>

<style scoped>
.suggestions {
  display: flex;
  margin-top: 12px;
  width: 100%;
  padding: 0 16px;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  justify-content: center;
  flex-wrap: wrap;
}

.suggestion-button {
  border-radius: 12px;
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  background: var(--md-sys-color-surface-container, #f3edf7);
  min-height: 48px;
  flex: 1;
  min-width: 100px;
  max-width: 180px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  position: relative;
}

.suggestion-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(103, 80, 164, 0.12);
  border-color: var(--md-sys-color-outline, #79747e);
}

.suggestion-button:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(103, 80, 164, 0.08);
}

.suggestion-button.suggestion-dish {
  background: var(--md-sys-color-tertiary-container, #ffd8e4);
  border-color: var(--md-sys-color-tertiary-container, #ffd8e4);
}

.suggestion-button.suggestion-dish:hover {
  background: var(--md-sys-color-tertiary, #7d5260);
  border-color: var(--md-sys-color-tertiary, #7d5260);
}

.suggestion-button.suggestion-dish:hover .suggestion-name {
  color: var(--md-sys-color-on-tertiary, #ffffff);
}

.suggestion-button.suggestion-dish:hover .suggestion-type {
  color: var(--md-sys-color-on-tertiary, #ffffff);
  opacity: 0.8;
}

.suggestion-button.suggestion-dish .suggestion-name {
  color: var(--md-sys-color-on-tertiary-container, #31111d);
}

.suggestion-button.suggestion-dish .suggestion-type {
  color: var(--md-sys-color-on-tertiary-container, #31111d);
  opacity: 0.7;
}

.suggestion-button.suggestion-category {
  background: var(--md-sys-color-secondary-container, #e8def8);
  border-color: var(--md-sys-color-secondary-container, #e8def8);
}

.suggestion-button.suggestion-category:hover {
  background: var(--md-sys-color-secondary, #625b71);
  border-color: var(--md-sys-color-secondary, #625b71);
}

.suggestion-button.suggestion-category:hover .suggestion-name {
  color: var(--md-sys-color-on-secondary, #ffffff);
}

.suggestion-button.suggestion-category:hover .suggestion-type {
  color: var(--md-sys-color-on-secondary, #ffffff);
  opacity: 0.8;
}

.suggestion-button.suggestion-category .suggestion-name {
  color: var(--md-sys-color-on-secondary-container, #1d192b);
}

.suggestion-button.suggestion-category .suggestion-type {
  color: var(--md-sys-color-on-secondary-container, #1d192b);
  opacity: 0.7;
}

.suggestion-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  height: 100%;
}

.suggestion-icon {
  font-size: 16px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.suggestion-button:hover .suggestion-icon {
  transform: scale(1.1);
}

.suggestion-text {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.suggestion-name {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 2px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.suggestion-type {
  font-size: 10px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  transition: color 0.2s ease;
}
</style>
