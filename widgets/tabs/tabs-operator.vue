<script setup lang="ts">
import { computed, unref } from "vue";
import {
  DownOutlined,
  ReloadOutlined,
  CloseOutlined,
  VerticalRightOutlined,
  VerticalLeftOutlined,
  ColumnWidthOutlined,
  MinusOutlined,
} from "@ant-design/icons-vue";
import {
  useRoute,
  useRouter,
  type RouteLocationNormalizedLoaded,
} from "vue-router";
import { isFunction } from "lodash-es";
import { message } from "ant-design-vue";
import { REDIRECT_NAME } from "~/constants";
import { TitleI18n } from "~/shared/basic/title-i18n";
import { isDevMode } from "~/constants/env";
import { useTabsViewStore } from "~/entities/tabs/modal/tabsView";

defineOptions({
  name: "TabOperator",
});

const props = defineProps({
  tabItem: {
    type: Object as PropType<RouteLocationNormalizedLoaded>,
    required: true,
  },
  isExtra: Boolean,
});

const route = useRoute();
const router = useRouter();
const tabsViewStore = useTabsViewStore();

const activeKey = computed(() => tabsViewStore.getCurrentTab?.fullPath);
const tabsList = computed(() => tabsViewStore.getTabsList);

const isCurrentRoute = (route: RouteLocationNormalizedLoaded) =>
  router.currentRoute.value.matched.some((item) => item.name === route.name);

const removeTab = () => {
  if (tabsList.value.length === 1) {
    return message.warning("This is the last tab, it cannot be closed!");
  }
  tabsViewStore.closeCurrentTab(props.tabItem);
};

const reloadPage = () => {
  router.replace({
    name: REDIRECT_NAME,
    params: {
      path: unref(route).fullPath,
    },
  });
};

const closeLeft = () => {
  tabsViewStore.closeLeftTabs(props.tabItem);
  if (!isCurrentRoute(props.tabItem)) {
    router.replace(props.tabItem.fullPath);
  }
};

const closeRight = () => {
  tabsViewStore.closeRightTabs(props.tabItem);
  if (!isCurrentRoute(props.tabItem)) {
    router.replace(props.tabItem.fullPath);
  }
};

const closeOther = () => {
  tabsViewStore.closeOtherTabs(props.tabItem);
  if (!isCurrentRoute(props.tabItem)) {
    router.replace(props.tabItem.fullPath);
  }
};

const closeAll = () => {
  tabsViewStore.closeAllTabs();
  router.replace("/");
};

const openPageFile = async () => {
  if (!isDevMode) return;

  const routes = router.getRoutes();
  const target = routes.find((n) => n.name === props.tabItem.name);
  if (target) {
    let comp = target.components?.default;
    let __file = (comp as any)?.__file as string;

    if (isFunction(comp)) {
      try {
        const res = await comp();
        __file = res?.default?.__file;
      } catch (error) {
        console.log(error);
      }
    }

    if (__file) {
      fetch(`/__open-in-editor?file=${__file}`);
    }
  }
};

defineExpose({
  removeTab,
});
</script>

<template>
  <a-dropdown :trigger="[isExtra ? 'click' : 'contextmenu']">
    <a v-if="isExtra" class="ant-dropdown-link" @click.prevent>
      <DownOutlined :style="{ fontSize: '20px' }" />
    </a>
    <div v-else style="display: inline-block">
      <TitleI18n :title="tabItem.meta?.title" />
    </div>
    <template #overlay>
      <a-menu style="user-select: none">
        <a-menu-item
          key="1"
          :disabled="activeKey !== tabItem.fullPath"
          @click="reloadPage"
        >
          <ReloadOutlined />
          {{ $t("layout.multipleTab.reload") }}
        </a-menu-item>
        <a-menu-item key="2" @click="removeTab">
          <CloseOutlined />
          {{ $t("layout.multipleTab.close") }}
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="3" @click="closeLeft">
          <VerticalRightOutlined />
          {{ $t("layout.multipleTab.closeLeft") }}
        </a-menu-item>
        <a-menu-item key="4" @click="closeRight">
          <VerticalLeftOutlined />
          {{ $t("layout.multipleTab.closeRight") }}
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="5" @click="closeOther">
          <ColumnWidthOutlined />
          {{ $t("layout.multipleTab.closeOther") }}
        </a-menu-item>
        <a-menu-item key="6" @click="closeAll">
          <MinusOutlined />
          {{ $t("layout.multipleTab.closeAll") }}
        </a-menu-item>
        <template v-if="isDevMode">
          <a-menu-divider />
          <a-menu-item key="7" @click="openPageFile">
            <ColumnWidthOutlined />
            Open page in editor
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style lang="scss"></style>
