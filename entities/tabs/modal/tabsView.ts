import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import {
  useRoute,
  useRouter,
  type RouteLocationMatched,
  type RouteLocationNormalizedLoaded,
} from "vue-router";
import { useKeepAliveStore } from "~/entities/store/modules/keepAlive";
import { useLayoutSettingStore } from "~/entities/store/modules/layoutSetting";
import {
  LOGIN_NAME,
  REDIRECT_NAME,
  PAGE_NOT_FOUND_NAME,
} from "~/constants/router";

export const routeExcludes = [
  REDIRECT_NAME,
  LOGIN_NAME,
  PAGE_NOT_FOUND_NAME,
  "screen",
  "UserLogin",
] as const;

export const useTabsViewStore = defineStore(
  "tabs-view",
  () => {
    const currentRoute = useRoute();
    const router = useRouter();
    const layoutSettingStore = useLayoutSettingStore();
    const tabsList = ref<RouteLocationNormalizedLoaded[]>([]);

    // Filter tabs that should be displayed
    const getTabsList = computed(() => {
      return tabsList.value.filter(
        (item) =>
          item && !isInRouteExcludes(item) && router.hasRoute(item.name!),
      );
    });

    // Get the current tab
    const getCurrentTab = computed(() => {
      return tabsList.value.find(
        (item) =>
          item &&
          !isInRouteExcludes(item) &&
          item.fullPath === currentRoute.fullPath,
      );
    });

    // Check if a route should be excluded
    const isInRouteExcludes = (route: RouteLocationNormalizedLoaded) => {
      return route.meta?.hideInTabs || routeExcludes.includes(route.name);
    };

    // Remove components from keep-alive cache
    const delCompFromClosedTabs = (
      closedTabs: RouteLocationNormalizedLoaded[],
    ) => {
      const keepAliveStore = useKeepAliveStore();
      const compNames = closedTabs.reduce<string[]>((prev, curr) => {
        if (curr.name) {
          const route = router.getRoutes().find((r) => r.name === curr.name);
          const componentName = route?.components?.default?.name;
          if (componentName) {
            prev.push(componentName);
          }
        }
        return prev;
      }, []);
      keepAliveStore.remove(compNames);
    };

    // Get a raw route object with specific properties
    const getRawRoute = (
      route: RouteLocationNormalizedLoaded,
    ): RouteLocationNormalizedLoaded => {
      return {
        ...route,
        matched: route.matched.map(({ meta, path, name }) => ({
          meta,
          path,
          name,
        })) as RouteLocationMatched[],
      };
    };

    // Add a new tab
    const addTabs = (route: RouteLocationNormalizedLoaded) => {
      if (isInRouteExcludes(route)) return false;
      if (!tabsList.value.some((item) => item.fullPath === route.fullPath)) {
        tabsList.value.push(getRawRoute(route));
      }
      return true;
    };

    // Close tabs on the left
    const closeLeftTabs = (route: RouteLocationNormalizedLoaded) => {
      const index = tabsList.value.findIndex(
        (item) => item.fullPath === route.fullPath,
      );
      if (index > -1) {
        delCompFromClosedTabs(tabsList.value.splice(0, index));
      }
    };

    // Close tabs on the right
    const closeRightTabs = (route: RouteLocationNormalizedLoaded) => {
      const index = tabsList.value.findIndex(
        (item) => item.fullPath === route.fullPath,
      );
      if (index > -1) {
        delCompFromClosedTabs(tabsList.value.splice(index + 1));
      }
    };

    // Close all tabs except the current one
    const closeOtherTabs = (route: RouteLocationNormalizedLoaded) => {
      const targetIndex = tabsList.value.findIndex(
        (item) => item.fullPath === route.fullPath,
      );
      if (targetIndex !== -1) {
        const [current] = tabsList.value.splice(targetIndex, 1);
        delCompFromClosedTabs(tabsList.value);
        tabsList.value = current ? [current] : [];
      }
    };

    // Close the current tab
    const closeCurrentTab = (route: RouteLocationNormalizedLoaded) => {
      const index = tabsList.value.findIndex(
        (item) => item.fullPath === route.fullPath,
      );
      if (index > -1) {
        const isCurrentTab = getCurrentTab.value?.fullPath === route.fullPath;
        delCompFromClosedTabs(tabsList.value.splice(index, 1));
        if (isCurrentTab) {
          const newCurrent = tabsList.value[tabsList.value.length - 1] || null;
          router.push(newCurrent || "/");
        }
      }
    };

    // Close all tabs
    const closeAllTabs = () => {
      delCompFromClosedTabs(tabsList.value);
      tabsList.value = [];
    };

    // Update the title of a tab
    const updateTabTitle = (title: string) => {
      const currentRoute = router.currentRoute.value;
      const target = tabsList.value.find(
        (item) => item.fullPath === currentRoute.fullPath,
      );
      if (target) {
        target.meta.title = title;
      }
    };

    // Watch for route changes and add new tabs
    watch(
      () => currentRoute.fullPath,
      () => {
        addTabs(currentRoute);
      },
      { immediate: true },
    );

    // Handle window unload event
    window.addEventListener("beforeunload", () => {
      if (!layoutSettingStore.layoutSetting.cacheTabs) {
        tabsList.value = isInRouteExcludes(currentRoute)
          ? [tabsList.value[0]]
          : [getCurrentTab.value || tabsList.value[0]];

        tabsList.value = tabsList.value.filter(Boolean);
      }
    });

    return {
      tabsList,
      getTabsList,
      getCurrentTab,
      addTabs,
      closeLeftTabs,
      closeRightTabs,
      closeOtherTabs,
      closeCurrentTab,
      closeAllTabs,
      updateTabTitle,
    };
  },
  {
    persist: {
      paths: ["tabsList"],
    },
  },
);

export const useTabsViewStoreWithOut = () => {
  return useTabsViewStore();
};
