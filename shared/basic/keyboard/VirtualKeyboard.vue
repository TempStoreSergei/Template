<script setup lang="ts">
import type { KeyboardEmits, VirtualKeyboardProps, SuggestionItem } from './types';

import { ref } from 'vue';

import KeyboardHeader from './KeyboardHeader.vue';
import KeyboardLayout from './KeyboardLayout.vue';
import SuggestionBar from './SuggestionBar.vue';

const props = withDefaults(defineProps<VirtualKeyboardProps>(), {
  disabled: false,
  isNumberMode: false,
  maxLength: 100,
  modelValue: '',
  placeholder: 'Введите текст...',
  returnButtonText: 'Принять',
  suggestions: () => [],
  visible: false,
});

const emit = defineEmits<KeyboardEmits>();

const isShifted = ref(false);

const handleKeyPress = (letter: string) => {
  if (
    props.disabled ||
    (props.maxLength && props.modelValue.length >= props.maxLength)
  ) {
    return;
  }

  const newValue =
    props.modelValue + (isShifted.value ? letter.toUpperCase() : letter);
  emit('update:modelValue', newValue);

  if (isShifted.value) {
    isShifted.value = false;
  }
};

const handleBackspace = () => {
  if (props.disabled || props.modelValue.length === 0) return;

  const newValue = props.modelValue.slice(0, -1);
  emit('update:modelValue', newValue);
};

const handleSpace = () => {
  if (props.disabled) return;
  handleKeyPress(' ');
};

const handleEnter = () => {
  emit('enter', props.modelValue);
  emit('update:visible', false);
};

const handleShift = () => {
  isShifted.value = !isShifted.value;
};

const handleSuggestionSelect = (suggestion: string) => {
  if (props.disabled) return;

  const words = props.modelValue.split(' ');
  words[words.length - 1] = suggestion;
  const newValue = `${words.join(' ')} `;
  emit('update:modelValue', newValue);
};

const handleClose = () => {
  emit('update:visible', false);
  emit('close');
};
</script>

<template>
  <Transition name="keyboard" appear>
    <div v-if="visible" class="keyboard-container">
      <div class="frame">
        <KeyboardHeader
          :text="modelValue"
          :placeholder="placeholder"
          @close="handleClose"
        />
        
        <SuggestionBar
          :suggestions="suggestions"
          @select="handleSuggestionSelect"
        />
        <KeyboardLayout
          :is-shifted="isShifted"
          :is-number-mode="isNumberMode"
          :return-button-text="returnButtonText"
          @key-press="handleKeyPress"
          @backspace="handleBackspace"
          @enter="handleEnter"
          @space="handleSpace"
          @shift="handleShift"
        >
          <!-- Dynamic Island теперь в ряду клавиатуры -->
          <template #dynamic-island>
            <slot name="dynamic-island"></slot>
          </template>
        </KeyboardLayout>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.keyboard-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 100%;
  margin-top: 12px;
  z-index: 1000;
}

.frame {
  border-radius: 16px;
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  box-shadow:
    0px 4px 8px 0px rgba(103, 80, 164, 0.12),
    0px 16px 32px 0px rgba(103, 80, 164, 0.15);
  backdrop-filter: blur(20px) saturate(150%);
  background: var(--md-sys-color-surface-container, #f3edf7);
  overflow: hidden;
  width: 100%;
}

.keyboard-enter-active,
.keyboard-leave-active {
  transition: all 0.3s ease;
}

.keyboard-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.keyboard-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
