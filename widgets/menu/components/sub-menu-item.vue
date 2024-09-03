<template>
  <!-- SubMenu -->
  <!-- <Menu.SubMenu v-if="isShowSubMenu(item)" :key="item?.name" v-bind="$attrs">
    <template #title>
      <MenuItemContent :item="item" />
    </template>
    <template v-for="child in item.children || []" :key="child.name">
      <MySubMenuItem :item="child" />
    </template>
  </Menu.SubMenu> -->
  <!-- MenuItem -->
  <MyMenuItem :item="item" />
</template>

<script setup lang="ts">
  import { Menu } from 'ant-design-vue';
  import MyMenuItem from './menu-item.vue';
  import MenuItemContent from './menu-item-content.vue';
  import type { PropType } from 'vue';
  import type { RouteRecordRaw } from 'vue-router';

  // Define the name of the component
  defineOptions({
    name: 'MySubMenuItem',
  });

  // Define the props for the component
  const props = defineProps({
    item: {
      type: Object as PropType<RouteRecordRaw>,
      default: () => ({}),
    },
  });

  /**
   * Determines if the given menu item should be displayed as a sub-menu.
   * @param {RouteRecordRaw} menuItem - The menu item to check.
   * @returns {boolean} - True if the menu item should be displayed as a sub-menu, false otherwise.
   */
  const isShowSubMenu = (menuItem: RouteRecordRaw) => {
    return (
      menuItem?.meta?.type === 0 ||
      (!Object.is(menuItem?.meta?.hideChildrenInMenu, true) && menuItem?.children?.length)
    );
  };
</script>

<style scoped></style>
