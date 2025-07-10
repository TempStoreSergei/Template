<template>
  <Menu.Item :key="item?.moduleRoute" @click="handleMenuItemClick(item)">
    <MenuItemContent :item="item" />
  </Menu.Item>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Menu } from "ant-design-vue";
import MenuItemContent from "./menu-item-content.vue";
import type { PropType } from "vue";
import type { RouteRecordRaw } from "vue-router";

defineOptions({
  name: "MyMenuItem",
});

defineProps({
  item: {
    type: Object as PropType<RouteRecordRaw>,
    default: () => ({}),
  },
});

const router = useRouter();

const handleMenuItemClick = (item: RouteRecordRaw) => {
  router.push({ name: item.moduleRoute });
};
</script>
