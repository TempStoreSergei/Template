<template>
  <a-layout-header class="layout-header">
    <div class="layout-header__left" />

    <div class="layout-header__center">
      <Search>
        <template #icon>
          <div class="layout-header__search">
            <SearchOutlined /> Поиск товаров
          </div>
        </template>
      </Search>
    </div>

    <div class="layout-header__right">
      <Basket />
    </div>
  </a-layout-header>
</template>

<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import Basket from "~/fetures/basket/ui/index.vue";
import Search from "~/fetures/search";
</script>

<style lang="scss">
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100% !important;
  height: 72px;
  background-color: rgba(
    255,
    255,
    255,
    0.1
  ) !important; // Frosted glass effect with transparency
  backdrop-filter: saturate(180%) blur(20px); // Higher saturation and blur
  -webkit-backdrop-filter: saturate(180%) blur(20px); // For Safari support
  border-bottom: 1px solid rgba(255, 255, 255, 0.3); // Optional light border
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); // Subtle shadow

  &__left {
    flex: 1;
  }

  &__center {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
  }

  &__search {
    border-bottom: 4px solid white;
    text-transform: lowercase;
    font-size: 2em;
    color: white;
    width: 150%;
  }
}
</style>
