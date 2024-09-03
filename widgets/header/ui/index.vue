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
      <Space :size="20">
        <Search />
        <Tooltip :title="$t('layout.header.tooltipLock')" placement="bottom">
          <LockOutlined @click="lockscreenStore.setLock(true)" />
        </Tooltip>
        <FullScreen />
        <LocalePicker />
        <Dropdown placement="bottomRight">
          <template #overlay>
            <Menu>
              <Menu.Item @click="$router.push({ name: 'account-settings' })">
                {{ $t("routes.account.settings") }}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item>
                <div @click.prevent="doLogout">
                  <PoweroffOutlined />
                  {{ $t("layout.header.dropdownItemLoginOut") }}
                </div>
              </Menu.Item>
            </Menu>
          </template>
          <Avatar alt="test"> test </Avatar>
        </Dropdown>
        <ProjectSetting />
      </Space>
    </div>
  </Layout.Header>
</template>

<script lang="ts" setup>
import { computed, type CSSProperties } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined,
  LockOutlined,
} from "@ant-design/icons-vue";
import {
  Layout,
  Modal,
  Dropdown,
  Menu,
  Space,
  Avatar,
  Tooltip,
  type MenuTheme,
} from "ant-design-vue";
import {
  Search,
  FullScreen,
  ProjectSetting,
  LayoutBreadcrumb,
} from "../components";
import { LocalePicker } from "~/shared/basic/locale-picker/index";
import { useKeepAliveStore } from "~/entities/store/modules/keepAlive";
import { useLockscreenStore } from "~/entities/lockscreen/modal/lockscreen";
import { LOGIN_NAME } from "~/constants";
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
const lockscreenStore = useLockscreenStore();
const keepAliveStore = useKeepAliveStore();

const router = useRouter();
const route = useRoute();
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
    onOk: async () => {
      // await userStore.logout();
      keepAliveStore.clear();
      localStorage.clear();
      await router.replace({
        name: LOGIN_NAME,
        query: {
          redirect: route.fullPath,
        },
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
