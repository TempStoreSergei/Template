<script setup lang="ts">
import KeyboardKey from './KeyboardKey.vue';

interface Props {
  isNumberMode?: boolean;
  isShifted?: boolean;
  returnButtonText?: string;
}

withDefaults(defineProps<Props>(), {
  isNumberMode: false,
  isShifted: false,
  returnButtonText: 'Принять',
});

defineEmits<{
  backspace: [];
  enter: [];
  keyPress: [key: string];
  shift: [];
  space: [];
}>();

// Символы для верхнего регистра
const getUpperSymbols = (key: string): string => {
  const upperMap: Record<string, string> = {
    '0': ')',
    '1': '!',
    '2': '@',
    '3': '#',
    '4': '$',
    '5': '%',
    '6': '^',
    '7': '&',
    '8': '*',
    '9': '(',
    "'": '"',
    ',': '<',
    '-': '_',
    '.': '>',
    '/': '?',
    ';': ':',
    '=': '+',
    '[': '{',
    '\\': '|',
    ']': '}',
    '`': '~',
  };
  return upperMap[key] || key.toUpperCase();
};

// Клавиши для режима символов/цифр (только основные)
const getSymbolKeys = (isShifted: boolean) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const symbols = ['!', '"', '№', ';', '%', ':', '?', '*', '(', ')'];
  return isShifted ? symbols : numbers;
};

// Русские раскладки клавиш
const getFirstRowRussian = () => 'йцукенгшщзхъ';
const getSecondRowRussian = () => 'фывапролджэ';
const getThirdRowRussian = () => 'ячс'; // Первая часть третьего ряда
const getFourthRowRussian = () => 'митьбю'; // Вторая часть третьего ряда
</script>

<template>
  <section class="keyboard">
    <!-- Цифровая клавиатура -->
    <template v-if="isNumberMode">
      <!-- Ряд 1: 1 2 3 -->
      <div class="number-row">
        <KeyboardKey
          v-for="num in ['1', '2', '3']"
          :key="num"
          :letter="num"
          @click="$emit('keyPress', num)"
        />
      </div>
      <!-- Ряд 2: 4 5 6 -->
      <div class="number-row">
        <KeyboardKey
          v-for="num in ['4', '5', '6']"
          :key="num"
          :letter="num"
          @click="$emit('keyPress', num)"
        />
      </div>
      <!-- Ряд 3: 7 8 9 -->
      <div class="number-row">
        <KeyboardKey
          v-for="num in ['7', '8', '9']"
          :key="num"
          :letter="num"
          @click="$emit('keyPress', num)"
        />
      </div>
      <!-- Ряд 4: 0, Backspace, Return -->
      <div class="number-row">
        <KeyboardKey letter="0" @click="$emit('keyPress', '0')" />
        <KeyboardKey letter="⌫" is-special @click="$emit('backspace')" />
        <KeyboardKey
          :letter="returnButtonText"
          is-special
          @click="$emit('enter')"
        />
      </div>
    </template>

    <!-- Обычная QWERTY клавиатура -->
    <template v-else>
      <!-- Ряд символов/цифр -->
      <div class="row-1-keys">
        <KeyboardKey
          v-for="key in getSymbolKeys(isShifted)"
          :key="key"
          :letter="key"
          @click="$emit('keyPress', key)"
        />
      </div>

      <!-- Ряд букв ЙЦУКЕН -->
      <div class="row-2-keys">
        <KeyboardKey
          v-for="key in getFirstRowRussian()"
          :key="key"
          :letter="isShifted ? key.toUpperCase() : key"
          @click="$emit('keyPress', key)"
        />
      </div>

      <!-- Ряд букв ФЫВАПР -->
      <div class="row-3-keys">
        <KeyboardKey
          v-for="key in getSecondRowRussian()"
          :key="key"
          :letter="isShifted ? key.toUpperCase() : key"
          @click="$emit('keyPress', key)"
        />
      </div>

      <!-- Ряд для МИТЬБЮ -->
      <div class="row-4">
        <div class="row-4-keys">
          <KeyboardKey
            v-for="key in getFourthRowRussian()"
            :key="key"
            :letter="isShifted ? key.toUpperCase() : key"
            @click="$emit('keyPress', key)"
          />
        </div>
      </div>

      <!-- Ряд с Shift и ЯЧС -->
      <div class="row-5">
        <KeyboardKey
          :letter="isShifted ? '⇧' : '⇧'"
          :width="90"
          :is-special="true"
          :class="{ 'shift-active': isShifted }"
          @click="$emit('shift')"
        />
        <div class="row-5-keys">
          <KeyboardKey
            v-for="key in getThirdRowRussian()"
            :key="key"
            :letter="isShifted ? key.toUpperCase() : key"
            @click="$emit('keyPress', key)"
          />
        </div>
        <KeyboardKey
          letter="⌫"
          :width="90"
          is-special
          @click="$emit('backspace')"
        />
      </div>

      <!-- Последний ряд только пробел и Enter -->
      <div class="row-6">
        <div class="space" @click="$emit('space')"></div>
        <button class="enter" @click="$emit('enter')">
          {{ returnButtonText }}
        </button>
      </div>

      <!-- Ряд для Dynamic Island -->
      <div class="dynamic-island-row">
        <slot name="dynamic-island"></slot>
      </div>
    </template>
  </section>
</template>

<style scoped>
.keyboard {
  margin-top: 12px; /* Уменьшил еще больше */
  padding: 0 12px 16px; /* Значительно уменьшил padding */
}

.row-1-keys,
.row-2-keys,
.row-3-keys,
.row-5-keys,
.number-row {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px; /* Уменьшил с 10px до 8px */
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 8px; /* Уменьшил с 10px до 8px */
}

.row-1-keys {
  margin-top: 0;
}

.row-4 {
  display: flex;
  margin-top: 8px;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.row-4-keys {
  display: flex;
  min-width: 360px; /* Увеличил для 6 букв */
  align-items: center;
  gap: 8px;
  justify-content: center;
}

/* Ряд с Shift и ЯЧС */
.row-5 {
  display: flex;
  margin-top: 8px;
  width: 100%;
  align-items: center;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.row-5-keys {
  align-self: stretch;
  display: flex;
  min-width: 180px; /* Уменьшил для 3 букв */
  margin: auto 0;
  align-items: center;
  gap: 8px;
  justify-content: center;
  flex: 1;
}

.row-6 {
  display: flex;
  margin-top: 8px;
  width: 100%;
  align-items: center;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Ряд для Dynamic Island */
.dynamic-island-row {
  margin-top: 12px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
}

.space {
  border-radius: 100px;
  background: var(--md-sys-color-surface-container-high, #e6e0e9);
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  box-shadow: 
    0 2px 4px rgba(103, 80, 164, 0.08),
    0 1px 2px rgba(103, 80, 164, 0.04);
  align-self: stretch;
  display: flex;
  min-width: 450px; /* Увеличил с 360px до 450px */
  margin: auto 0;
  flex: 1;
  height: 54px; /* Уменьшил с 66px до 54px для баланса */
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  
  &:hover {
    background: var(--md-sys-color-surface-container-highest, #e6e0e9);
    transform: translateY(-1px);
    box-shadow: 
      0 4px 8px rgba(103, 80, 164, 0.12),
      0 2px 4px rgba(103, 80, 164, 0.08);
  }
  
  &:active {
    background: var(--md-sys-color-primary-container, #eaddff);
    transform: translateY(0);
  }
}

.enter {
  align-self: stretch;
  border-radius: 100px;
  background: var(--md-sys-color-primary, #6750a4);
  border: 1px solid var(--md-sys-color-primary, #6750a4);
  box-shadow: 
    0 2px 4px rgba(103, 80, 164, 0.08),
    0 1px 2px rgba(103, 80, 164, 0.04);
  margin: auto 0;
  min-height: 54px; /* Уменьшил с 66px до 54px для баланса */
  font-family: var(--md-sys-typescale-body-large-font, Roboto);
  font-size: 16px; /* Уменьшил с 25.5px до 16px */
  color: var(--md-sys-color-on-primary, #ffffff);
  font-weight: 600;
  text-align: center;
  line-height: 1;
  width: 200px; /* Увеличил с 183px до 200px */
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  
  &:hover {
    background: var(--md-sys-color-primary-container, #eaddff);
    color: var(--md-sys-color-on-primary-container, #21005d);
    transform: translateY(-1px);
    box-shadow: 
      0 4px 8px rgba(103, 80, 164, 0.12),
      0 2px 4px rgba(103, 80, 164, 0.08);
  }
  
  &:active {
    background: var(--md-sys-color-secondary, #625b71);
    color: var(--md-sys-color-on-secondary, #ffffff);
    transform: translateY(0);
  }
}

.shift-active {
  background-color: rgba(255, 255, 255, 0.3) !important;
}

/* Цифровая клавиатура */
.number-row {
  justify-content: space-evenly;
  max-width: 350px; /* Увеличил с 300px до 350px */
  margin: 0 auto 10px auto; /* Уменьшил margin */
}

.number-row .keyboard-key {
  min-width: 75px; /* Увеличил с 66px до 75px */
  flex: 0 0 75px;
}
</style>
