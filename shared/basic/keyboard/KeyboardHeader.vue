<script setup lang="ts">
interface Props {
  text?: string;
  placeholder?: string;
}

withDefaults(defineProps<Props>(), {
  text: '',
  placeholder: 'Введите текст...',
});

defineEmits<{
  close: [];
}>();
</script>

<template>
  <header class="header-bar">
    <div class="input-display">
      <span v-if="text" class="input-text">{{ text }}</span>
      <span v-else class="input-placeholder">{{ placeholder }}</span>
    </div>
    <button class="button-symbol" @click="$emit('close')">
      <md-icon>close</md-icon>
    </button>
  </header>
</template>

<style scoped>
.header-bar {
  background: var(--md-sys-color-surface-container-high, #e6e0e9);
  display: flex;
  min-height: 48px;
  padding: 8px 16px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  font-family: var(--md-sys-typescale-body-large-font, Roboto);
}

.input-display {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.input-text {
  color: var(--md-sys-color-on-surface, #1d1b20);
  font-size: 14px;
  font-weight: 400;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;
}

.input-placeholder {
  color: var(--md-sys-color-on-surface-variant, #49454f);
  font-size: 14px;
  font-weight: 400;
  font-style: italic;
  display: block;
}

.button-symbol {
  border-radius: 16px;
  background: var(--md-sys-color-surface-container-highest, #e6e0e9);
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: var(--md-sys-color-error-container, #f9dedc);
    border-color: var(--md-sys-color-error, #b3261e);
    transform: scale(1.05);
    
    md-icon {
      color: var(--md-sys-color-error, #b3261e);
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  md-icon {
    color: var(--md-sys-color-on-surface-variant, #49454f);
    transition: color 0.2s ease;
    font-size: 18px;
  }
}
</style>
