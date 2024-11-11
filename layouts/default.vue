<template>
  <a-config-provider
    component-size="large"
    :theme="{
      token: {
        borderRadius: 6,
        fontSize: 24,
        lineWidth: 2,
        colorBorder: '#1677ff',
        colorSplit: '#1677ff',
        colorBorderSecondary: '#1677ff',
      },
    }"
  />
  <a-layout class="layout">
    <div
      ref="adminRef"
      class="layout__admin-panel"
      @click="adminClickHandler"
    />
    <div class="layout__content-wrapper">
      <a-layout-content class="layout__content">
        <slot />
      </a-layout-content>
    </div>
  </a-layout>
  <a-config-provider />
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();
const adminRef = ref(null);
const clickCount = ref(0);

const adminClickHandler = () => {
  clickCount.value += 1;
  if (clickCount.value === 4) {
    localStorage.removeItem("token");
    router.push({ name: "users" });
  }
};

onClickOutside(adminRef, () => (clickCount.value = 0));
</script>

<style lang="scss">
.layout {
  &__content-wrapper {
    display: flex;
    justify-content: center;
    height: 100%;
  }

  &__content {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__admin-panel {
    background: transparent;
    height: 150px;
    width: 150px;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
