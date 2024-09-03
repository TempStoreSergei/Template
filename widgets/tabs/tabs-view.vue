<template>
  <div class="tabs-view">
    <a-tabs
      :active-key="activeKey"
      hide-add
      type="editable-card"
      class="tabs"
      @change="handleTabChange"
      @edit="handleTabEdit"
    >
      <a-tab-pane v-for="tabItem in tabsList" :key="tabItem.fullPath">
        <template #tab>
          <TabsOperator
            :ref="(instance: TabsOperatorInstance) => (itemRefs[tabItem.fullPath] = instance)"
            :tab-item="tabItem"
          />
        </template>
      </a-tab-pane>
      <template #rightExtra>
        <TabsOperator :tab-item="route" :is-extra="true" />
      </template>
    </a-tabs>
    <div class="tabs-view-content" :style="{ overflow }">
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <Suspense>
            <Transition
              :name="transitionName"
              mode="out-in"
              appear
              @before-leave="handleBeforeLeave"
              @after-leave="handleAfterLeave"
            >
              <keep-alive :include="keepAliveComponents">
                <component :is="Component" :key="route.fullPath" />
              </keep-alive>
            </Transition>
            <template #fallback> Loading... </template>
          </Suspense>
        </template>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import TabsOperator from './tabs-operator.vue';
  import { useTabsViewStore } from '~/entities/tabs/modal/tabsView';
  import { useKeepAliveStore } from '~/entities/store/modules/keepAlive';

  type TabsOperatorInstance = InstanceType<typeof TabsOperator>;

  const route = useRoute();
  const router = useRouter();
  const tabsViewStore = useTabsViewStore();
  const keepAliveStore = useKeepAliveStore();

  const itemRefs: Record<string, TabsOperatorInstance | null> = {};

  const overflow = ref('auto');
  const activeKey = computed(() => tabsViewStore.getCurrentTab?.fullPath);
  const tabsList = computed(() => tabsViewStore.getTabsList);
  const keepAliveComponents = computed(() => keepAliveStore.list);

  const transitionName = computed(() => {
    const name = route.meta?.transitionName;
    return name === false ? '' : name ?? 'fade-slide';
  });

  const handleTabEdit = (targetKey: string, action: string) => {
    if (action === 'remove') {
      itemRefs[targetKey]?.removeTab();
    }
  };

  const handleTabChange = (key: string) => {
    if (!Object.is(route.fullPath, key)) {
      router.push(key);
    }
  };

  const handleBeforeLeave = () => {
    overflow.value = 'hidden';
  };

  const handleAfterLeave = () => {
    overflow.value = 'auto';
  };
</script>

<style lang="scss">
  .tabs-view {
    border-top: 1px solid #eee;

    .tabs {
      .ant-tabs-nav {
        background-color: white;
        &.dark {
          background-color: black;
        }
        margin: 0;
        padding: 4px 20px 0 10px;
        user-select: none;
      }

      .ant-tabs-tabpane {
        display: none;
      }

      .ant-tabs-tab-remove {
        display: flex;
        margin: 0;
        padding: 0;

        .anticon-close {
          padding-left: 6px;
        }
      }

      .ant-tabs-tab:not(.ant-tabs-tab-active) {
        .ant-tabs-tab-remove {
          width: 0;
        }

        .anticon-close {
          visibility: hidden;
          width: 0;
          transition: width 0.3s;
        }

        &:hover {
          .anticon-close {
            visibility: visible;
            width: 16px;
            padding-left: 6px;
          }

          .ant-tabs-tab-remove {
            width: auto;
          }
        }
      }
    }

    .tabs-view-content {
      height: calc(100vh - 110px - var(--app-footer-height));
      padding: 20px 14px 0;
      overflow: auto;
    }

    .dark & {
      border-top: 1px solid black;
    }
  }
</style>
