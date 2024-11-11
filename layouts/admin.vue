<template>
  <ConfigProvider
    :component-size="'large'"
    :theme="{
      token: {
        fontSize: 22,
      },
    }"
  >
    <Layout class="layout">
      <Layout.Sider
        v-model:collapsed="collapsed"
        :width="asiderWidth"
        :trigger="null"
        collapsible
        :theme="theme"
        class="layout-sider"
      >
        <Logo :collapsed="collapsed" />
        <AsideMenu :collapsed="collapsed" :theme="theme" />
      </Layout.Sider>
      <Layout>
        <PageHeader v-model:collapsed="collapsed" :theme="theme" />
        <Layout.Content class="layout-content">
          <TabsView />
        </Layout.Content>
      </Layout>
    </Layout>
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { Layout, ConfigProvider } from "ant-design-vue";
import { Logo } from "~/widgets";
import AsideMenu from "~/widgets/menu/menu.vue";
import PageHeader from "~/widgets/header/ui/index.vue";
import { TabsView } from "~/widgets/tabs/index";

const collapsed = ref<boolean>(false);

const asiderWidth = computed(() => (collapsed.value ? 80 : 302));
const theme = computed(() => "dark");
</script>

<style lang="scss">
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .ant-layout {
    overflow: hidden;
  }

  .layout-content {
    flex: 1;
    overflow: auto;
  }
}
</style>
