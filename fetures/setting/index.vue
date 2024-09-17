<template>
  <SettingOutlined @click="showDrawer" />
  <Drawer v-model:open="visible" placement="right" :closable="false" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { SettingOutlined } from "@ant-design/icons-vue";
import { Drawer } from "ant-design-vue";

defineOptions({
  name: "TariffPage",
});
const visible = ref(false);

const showDrawer = () => {
  visible.value = true;
};
</script>

<style lang="less" scoped>
.style-checbox-item {
  position: relative;
  cursor: pointer;

  &.active::after {
    content: "✔";
    position: absolute;
    right: 12px;
    bottom: 10px;
    color: var(--app-primary-color);
  }
}

input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  outline: none;
  appearance: none;

  &::-webkit-color-swatch-wrapper {
    background: var(--custom-color);
  }

  &::-webkit-color-swatch {
    display: none;
  }
}
</style>
