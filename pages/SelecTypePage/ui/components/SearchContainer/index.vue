<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <!-- Search Mode Selector -->
      <div class="search-mode-selector">
        <md-icon-button
          @click="$emit('toggleSearchModeMenu')"
          class="search-mode-btn"
          :class="{ 'active': isSearchModeMenuOpen }"
        >
          <md-icon>{{ searchModeIcon }}</md-icon>
        </md-icon-button>

        <!-- Search Mode Menu -->
        <div v-if="isSearchModeMenuOpen" class="search-mode-menu" @click.stop>
          <div
            v-for="mode in searchModes"
            :key="mode.value"
            class="search-mode-option"
            :class="{ 'selected': searchMode === mode.value }"
            @click="$emit('selectSearchMode', mode.value)"
          >
            <md-icon class="mode-icon">{{ mode.icon }}</md-icon>
            <div class="mode-info">
              <div class="mode-title">{{ mode.title }}</div>
              <div class="mode-description">{{ mode.description }}</div>
            </div>
            <md-icon v-if="searchMode === mode.value" class="check-icon">check</md-icon>
          </div>
        </div>
      </div>

      <md-icon class="search-icon">search</md-icon>
      <input
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        @keyup.enter="$emit('performSearch')"
        @focus="$emit('searchFocus')"
        @blur="$emit('searchBlur')"
        type="text"
        :placeholder="searchPlaceholder"
        class="search-input"
        readonly
      />
      <md-icon-button
        v-if="searchQuery"
        @click="$emit('clearSearch')"
        class="clear-search-btn"
      >
        <md-icon>close</md-icon>
      </md-icon-button>
    </div>

    <!-- Virtual Keyboard -->
    <VirtualKeyboard
      :model-value="searchQuery"
      :visible="isKeyboardVisible"
      :suggestions="keyboardSuggestions"
      :max-length="100"
      placeholder="Введите поисковый запрос..."
      return-button-text="Найти"
      @update:model-value="$emit('update:searchQuery', $event)"
      @enter="$emit('keyboardEnter')"
      @close="$emit('keyboardClose')"
      @update:visible="$emit('update:keyboardVisible', $event)"
    >
      <!-- Dynamic Island -->
      <template #dynamic-island>
        <div
          v-if="showDynamicIsland"
          class="search-no-results"
          @click="$emit('clearSearch')"
        >
          <div class="no-results-content">
            <md-icon class="no-results-icon">search_off</md-icon>
            <div class="no-results-text">
              <div class="no-results-title">Ничего не найдено</div>
              <div class="no-results-query">{{ searchQuery }}</div>
            </div>
            <div class="no-results-actions">
              <md-icon-button
                v-if="searchMode !== 'global'"
                @click.stop="$emit('switchToGlobalSearch')"
                class="action-btn global-btn"
                title="Поиск везде"
              >
                <md-icon>public</md-icon>
              </md-icon-button>
              <md-icon-button
                @click.stop="$emit('clearSearch')"
                class="action-btn clear-btn"
                title="Очистить"
              >
                <md-icon>close</md-icon>
              </md-icon-button>
            </div>
          </div>
        </div>
      </template>
    </VirtualKeyboard>
  </div>
</template>

<script setup lang="ts">
import VirtualKeyboard from "~/shared/basic/keyboard/VirtualKeyboard.vue";

interface SearchMode {
  value: string;
  title: string;
  description: string;
  icon: string;
}

interface KeyboardSuggestion {
  name: string;
  type: 'dish' | 'category';
}

interface Props {
  searchQuery: string;
  searchMode: string;
  isSearchModeMenuOpen: boolean;
  searchModes: SearchMode[];
  searchModeIcon: string;
  searchPlaceholder: string;
  isKeyboardVisible: boolean;
  keyboardSuggestions: KeyboardSuggestion[];
  showDynamicIsland: boolean;
}

interface Emits {
  (e: "update:searchQuery", value: string): void;
  (e: "toggleSearchModeMenu"): void;
  (e: "selectSearchMode", mode: string): void;
  (e: "performSearch"): void;
  (e: "searchFocus"): void;
  (e: "searchBlur"): void;
  (e: "clearSearch"): void;
  (e: "keyboardEnter"): void;
  (e: "keyboardClose"): void;
  (e: "update:keyboardVisible", value: boolean): void;
  (e: "switchToGlobalSearch"): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style lang="scss" scoped>
.search-container {
  position: relative;

  .search-input-wrapper {
    display: flex;
    align-items: center;
    background: var(--md-sys-color-surface-container, #f3edf7);
    border-radius: 24px;
    padding: 0 16px;
    border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    transition: all 0.3s ease;
    position: relative;

    &:focus-within {
      border-color: var(--md-sys-color-primary, #6750a4);
      background: var(--md-sys-color-surface, #fef7ff);
      box-shadow: 0 0 0 2px rgba(103, 80, 164, 0.2);
    }

    .search-mode-selector {
      position: relative;
      margin-right: 8px;

      .search-mode-btn {
        --md-icon-button-icon-size: 20px;
        width: 32px;
        height: 32px;

        &.active {
          background-color: var(--md-sys-color-primary-container, #eaddff);
        }
      }

      .search-mode-menu {
        position: absolute;
        top: 40px;
        left: 0;
        background: var(--md-sys-color-surface-container, #f3edf7);
        border-radius: 12px;
        padding: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
        z-index: 1000;
        min-width: 280px;

        .search-mode-option {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          gap: 12px;

          &:hover {
            background-color: var(--md-sys-color-primary-container, #eaddff);
          }

          &.selected {
            background-color: var(--md-sys-color-primary-container, #eaddff);
            color: var(--md-sys-color-primary, #6750a4);
          }

          .mode-icon {
            font-size: 20px;
            color: var(--md-sys-color-primary, #6750a4);
          }

          .mode-info {
            flex: 1;

            .mode-title {
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 2px;
            }

            .mode-description {
              font-size: 12px;
              color: var(--md-sys-color-on-surface-variant, #49454f);
              opacity: 0.8;
            }
          }

          .check-icon {
            font-size: 18px;
            color: var(--md-sys-color-primary, #6750a4);
          }
        }
      }
    }

    .search-icon {
      color: var(--md-sys-color-on-surface-variant, #49454f);
      margin-right: 12px;
      font-size: 20px;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 16px;
      color: var(--md-sys-color-on-surface, #1c1b1f);
      padding: 12px 0;

      &::placeholder {
        color: var(--md-sys-color-on-surface-variant, #49454f);
        opacity: 0.7;
      }
    }

    .clear-search-btn {
      --md-icon-button-icon-size: 20px;
      width: 32px;
      height: 32px;
      margin-left: 8px;

      md-icon {
        color: var(--md-sys-color-on-surface-variant, #49454f);
      }

      &:hover {
        background-color: var(--md-sys-color-error-container, #fce4ec);

        md-icon {
          color: var(--md-sys-color-error, #d32f2f);
        }
      }
    }
  }
}

.search-no-results {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border-radius: 32px;
  padding: 16px 24px;
  margin: 16px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(238, 90, 36, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(238, 90, 36, 0.3);
  }

  .no-results-content {
    display: flex;
    align-items: center;
    gap: 16px;
    color: white;

    .no-results-icon {
      font-size: 24px;
      opacity: 0.9;
    }

    .no-results-text {
      flex: 1;

      .no-results-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .no-results-query {
        font-size: 14px;
        opacity: 0.8;
        font-style: italic;
      }
    }

    .no-results-actions {
      display: flex;
      gap: 8px;

      .action-btn {
        --md-icon-button-icon-size: 20px;
        width: 36px;
        height: 36px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        md-icon {
          color: white;
        }
      }
    }
  }
}
</style>