<template>
  <div class="menu-container" :class="{ 'is-side-menu': isSideMenu }">
    <Menu
      v-model:selected-keys="selectedKeys"
      :open-keys="isSideMenu ? openKeys : []"
      :mode="isSideMenu ? 'inline' : 'horizontal'"
      :collapsed="props.collapsed"
      theme="dark"
      collapsible
      @click="clickMenuItem"
    >
      <template v-for="item in menus" :key="item.module_route">
        <SubMenuItem :item="item" />
      </template>
    </Menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Menu, type MenuProps } from "ant-design-vue";
import { getMenu } from "./api/index";
import SubMenuItem from "./components/sub-menu-item.vue";
import { useLayoutSettingStore } from "~/entities/store/modules/layoutSetting";
import { LOGIN_NAME } from "~/constants/router";

const props = defineProps({
  collapsed: {
    type: Boolean, // Indicates if the sidebar menu is collapsed
  },
});

const layoutSettingStore = useLayoutSettingStore();
const currentRoute = useRoute();
const router = useRouter();
const openKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([currentRoute.name as string]);

const menus = ref([]);
const isSideMenu = computed(
  () => layoutSettingStore.layoutSetting.layout === "sidemenu",
);

const fetchMenus = async () => {
  try {
    const data = await getMenu();
    menus.value = data;
  } catch (error) {
    console.error("Failed to fetch menus:", error);
  }
};

/**
 * Retrieves the route by its name.
 * @param {string} name - The name of the route.
 * @returns {RouteRecord | undefined} - The route record.
 */
const getRouteByName = (name: string) =>
  router.getRoutes().find((n) => n.name === name);

/**
 * Retrieves the currently opened sub-menus.
 * @returns {string[]} - The keys of the opened sub-menus.
 */
const getOpenKeys = () => {
  return (
    currentRoute.meta?.name ??
    (currentRoute.matched.slice(1).map((n) => n.name) as string[])
  );
};

// Watch for changes in the collapsed state of the menu
watch(
  () => props.collapsed,
  () => {
    selectedKeys.value = [currentRoute.name] as string[];
    setTimeout(() => {
      openKeys.value = getOpenKeys();
    });
  },
);

// Watch for changes in the current route to update the menu selection
watch(
  () => currentRoute.fullPath,
  () => {
    selectedKeys.value = [
      currentRoute.meta?.activeMenu ?? currentRoute.name,
    ] as string[];
    if (currentRoute.name === LOGIN_NAME || props.collapsed) return;
    openKeys.value = getOpenKeys();
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  fetchMenus();
});

/**
 * Handles menu item clicks.
 * @param {MenuProps['onClick']} param0 - The click event object.
 */
const clickMenuItem: MenuProps["onClick"] = ({ key }) => {
  if (key === currentRoute.name) return;
  const preSelectedKeys = selectedKeys.value;
  const targetRoute = getRouteByName(key as string);
  const { isExt } = targetRoute?.meta || {};
  if (targetRoute && isExt) {
    queueMicrotask(() => {
      selectedKeys.value = preSelectedKeys;
    });
  }
};
</script>

<style lang="less" scoped>
.menu-container {
  width: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  &.is-side-menu {
    height: calc(100vh - var(--app-header-height));
  }

  & > :deep(.ant-menu) {
    justify-content: center;
    width: 100%;
  }
}
</style>
