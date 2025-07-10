<script setup lang="ts">
interface Props {
  isSpecial?: boolean;
  letter: string;
  width?: number;
}

withDefaults(defineProps<Props>(), {
  isSpecial: false,
  width: 75, // Увеличил с 66 до 75
});

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    class="keyboard-key"
    :class="[{ 'keyboard-key--special': isSpecial }]"
    :style="{ width: width ? `${width}px` : '75px' }"
    @click="$emit('click')"
  >
    {{ letter }}
  </button>
</template>

<style scoped>
.keyboard-key {
  flex: 1;
  border-radius: 16px;
  background: var(--md-sys-color-surface-container-high, #e6e0e9);
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  box-shadow: 
    0 2px 4px rgba(103, 80, 164, 0.08),
    0 1px 2px rgba(103, 80, 164, 0.04);
  align-self: stretch;
  margin-top: auto;
  margin-bottom: auto;
  min-height: 54px; /* Увеличил с 66 до 54 для лучшего баланса */
  padding: 0 12px; /* Увеличил padding с 8px до 12px */
  font-family: var(--md-sys-typescale-body-large-font, Roboto);
  font-size: 18px; /* Уменьшил с 20px до 18px для баланса */
  color: var(--md-sys-color-on-surface, #1d1b20);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  user-select: none;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.6) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.4) 100%
    );
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover {
    background: var(--md-sys-color-surface-container-highest, #e6e0e9);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      0 4px 8px rgba(103, 80, 164, 0.12),
      0 2px 4px rgba(103, 80, 164, 0.08);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
    background: var(--md-sys-color-primary-container, #eaddff);
    color: var(--md-sys-color-on-primary-container, #21005d);
  }
}

.keyboard-key--special {
  background: var(--md-sys-color-primary, #6750a4);
  color: var(--md-sys-color-on-primary, #ffffff);
  border-color: var(--md-sys-color-primary, #6750a4);
  font-weight: 600;
  
  &::before {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.2) 100%
    );
  }
  
  &:hover {
    background: var(--md-sys-color-primary-container, #eaddff);
    color: var(--md-sys-color-on-primary-container, #21005d);
    border-color: var(--md-sys-color-primary, #6750a4);
  }
  
  &:active {
    background: var(--md-sys-color-secondary, #625b71);
    color: var(--md-sys-color-on-secondary, #ffffff);
  }
}
</style>
