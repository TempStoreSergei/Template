<template>
  <div class="apple-navigation">
    <!-- Left Arrow -->
    <md-icon-button
      v-if="canScrollLeft"
      @click="scrollLeft"
      class="nav-arrow nav-arrow-left"
    >
      <md-icon>chevron_left</md-icon>
    </md-icon-button>

    <!-- Navigation Container -->
    <div class="nav-container" ref="navContainer">
      <!-- Depth Indicator -->
      <div class="nav-depth-indicator" :style="{ width: `${Math.min((breadcrumbPath.length + 1) * 12, 80)}%` }"></div>
      <div class="nav-track" ref="navTrack" :style="{ transform: `translateX(${scrollOffset}px)` }">
        <!-- Home Button -->
        <div class="nav-item nav-item-home" @click="navigateToPath(null)">
          <div class="nav-item-content">
            <md-icon class="nav-icon">home</md-icon>
            <span class="nav-text">Главная</span>
          </div>
        </div>

        <!-- Category Items -->
        <template v-for="(part, index) in breadcrumbPath" :key="part.id">
          <!-- Glass Separator -->
          <div class="nav-glass-separator">
            <div class="separator-line"></div>
          </div>

          <div
            class="nav-item nav-item-category"
            :class="{ 'nav-item-active': index === breadcrumbPath.length - 1 }"
            @click="navigateToPath(index)"
          >
            <div class="nav-item-content">
              <md-icon class="nav-icon">folder</md-icon>
              <span class="nav-text">{{ part.categoryName }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Right Arrow -->
    <md-icon-button
      v-if="canScrollRight"
      @click="scrollRight"
      class="nav-arrow nav-arrow-right"
    >
      <md-icon>chevron_right</md-icon>
    </md-icon-button>
  </div>
</template>

<script setup lang="ts">
import type { Category } from "../../../model/types";

interface Props {
  breadcrumbPath: Category[];
  navContainer: HTMLElement | null;
  navTrack: HTMLElement | null;
  scrollOffset: number;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

interface Emits {
  (e: "scrollLeft"): void;
  (e: "scrollRight"): void;
  (e: "navigateToPath", index: number | null): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style lang="scss" scoped>
.apple-navigation {
  display: flex;
  align-items: center;
  height: 44px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 0 8px;
  margin-bottom: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  .nav-arrow {
    --md-icon-button-icon-size: 20px;
    width: 32px;
    height: 32px;
    margin: 0 4px;
    flex-shrink: 0;
    z-index: 10;

    md-icon {
      color: var(--md-sys-color-primary, #007aff);
    }

    &:hover:not(:disabled) {
      background-color: rgba(0, 122, 255, 0.1);
    }
  }

  .nav-container {
    flex: 1;
    overflow: hidden;
    position: relative;
    height: 32px;
    margin: 0 4px;

    .nav-depth-indicator {
      position: absolute;
      top: 0;
      left: 0;
      height: 2px;
      background: linear-gradient(
        90deg,
        var(--md-sys-color-primary, #007aff) 0%,
        rgba(0, 122, 255, 0.3) 100%
      );
      border-radius: 1px;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
    }

    .nav-track {
      display: flex;
      align-items: center;
      height: 100%;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      gap: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      height: 28px;
      padding: 0 12px;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      flex-shrink: 0;
      position: relative;

      &:hover {
        background-color: rgba(0, 122, 255, 0.08);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 122, 255, 0.15);
      }

      &-home {
        background: linear-gradient(135deg, #007aff 0%, #5ac8fa 100%);
        color: white;

        &:hover {
          background: linear-gradient(135deg, #0056b3 0%, #4aa3d9 100%);
          transform: translateY(-1px) scale(1.02);
        }

        .nav-icon, .nav-text {
          color: white;
        }
      }

      &-category {
        background-color: rgba(120, 120, 128, 0.08);
        color: var(--md-sys-color-on-surface, #1c1c1e);

        &.nav-item-active {
          background: linear-gradient(135deg, #34c759 0%, #30d158 100%);
          color: white;

          .nav-icon, .nav-text {
            color: white;
          }
        }
      }

      &-content {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .nav-icon {
        font-size: 16px;
        color: var(--md-sys-color-primary, #007aff);
      }

      .nav-text {
        font-size: 14px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface, #1c1c1e);
      }
    }

    .nav-glass-separator {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 4px;
      flex-shrink: 0;

      .separator-line {
        width: 1px;
        height: 16px;
        background: linear-gradient(
          180deg,
          transparent 0%,
          rgba(0, 122, 255, 0.3) 50%,
          transparent 100%
        );
      }
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0.7) 100%
    );
    border-radius: inherit;
    z-index: -1;
  }
}
</style>