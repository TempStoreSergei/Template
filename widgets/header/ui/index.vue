<template>
  <Layout.Header :style="headerStyle" class="layout-header">
    <div class="layout-header__left">
      <slot name="left">
        <Space :size="20">
          <span
            class="layout-header__menu-toggle cursor-pointer"
            @click="() => emit('update:collapsed', !collapsed)"
          >
            <component
              :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined"
            />
          </span>
          <LayoutBreadcrumb />
        </Space>
      </slot>
    </div>
    <div class="layout-header__menu">
      <slot name="menu" />
    </div>
    <div class="layout-header__right">
      <a-button
        type="dashed"
        style="margin-right: 24px"
        danger
        @click="doLogout"
      >
        Выход
      </a-button>
      <ProjectSetting />
    </div>
  </Layout.Header>
</template>

<script lang="ts" setup>
import { computed, type CSSProperties } from "vue";
import { useRouter } from "vue-router";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import { Layout, Modal, Space, type MenuTheme } from "ant-design-vue";
import { ProjectSetting, LayoutBreadcrumb } from "../components";
import { logOut } from "../api";
import { useKeepAliveStore } from "~/entities/store/modules/keepAlive";
import { useLayoutSettingStore } from "~/entities/store/modules/layoutSetting";

defineProps({
  collapsed: {
    type: Boolean,
  },
  theme: {
    type: String as PropType<MenuTheme>,
  },
});

const emit = defineEmits(["update:collapsed"]);
const layoutSettingStore = useLayoutSettingStore();
const keepAliveStore = useKeepAliveStore();

const router = useRouter();
const headerStyle = computed<CSSProperties>(() => {
  const { navTheme, layout } = layoutSettingStore.layoutSetting;
  const isDark = navTheme === "dark" && layout === "topmenu";
  return {
    backgroundColor:
      navTheme === "realDark" || isDark ? "" : "rgba(255, 255, 255, 0.85)",
    color: isDark ? "rgba(255, 255, 255, 0.85)" : "",
  };
});

const doLogout = () => {
  Modal.confirm({
    title: "Вы уверены, что хотите выйти из системы?",
    centered: true,
    okText: "Да",
    cancelText: "Отмена",
    onOk: async () => {
      await logOut();
      keepAliveStore.clear();
      localStorage.clear();
      await router.push({
        name: "UserLogin",
      });
    },
  });
};
</script>

<style lang="scss">
.layout-header {
  display: flex;
  position: sticky;
  z-index: 10;
  top: 0;
  align-items: center;
  justify-content: space-between;
  height: var(--app-header-height);
  padding: 0 20px;

  &__left {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  &__menu {
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  &__right {
    min-width: 180px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__menu-toggle {
    cursor: pointer;
  }
}
</style>
