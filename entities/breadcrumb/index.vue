<template>
  <a-breadcrumb>
    <template v-for="(routeItem, routeIndex) in menus" :key="routeItem?.name">
      <a-breadcrumb-item>
        <TitleI18n :title="routeItem?.meta?.title" class="cursor-pointer" />
        <template v-if="routeItem?.children?.length" #overlay>
          <a-menu :selected-keys="getSelectKeys(routeIndex)">
            <template
              v-for="childItem in routeItem.children"
              :key="childItem.name"
            >
              <a-menu-item
                v-if="
                  !childItem.meta?.hideInMenu &&
                  !childItem.meta?.hideInBreadcrumb
                "
                @click="clickMenuItem(childItem)"
              >
                <TitleI18n :title="childItem.meta?.title" />
              </a-menu-item>
            </template>
          </a-menu>
        </template>
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter, type RouteRecordRaw } from "vue-router";
import { TitleI18n } from "../../shared/basic/title-i18n/index.ts";

defineOptions({
  name: "LayoutBreadcrumb",
});

const router = useRouter();
const route = useRoute();

const clickMenuItem = (menuItem: RouteRecordRaw) => {
  const { isExt, extOpenMode, type } = menuItem?.meta || {};

  if (type === 0 && !menuItem.redirect) return;

  if (isExt && extOpenMode === 1) {
    window.open(menuItem.path);
  } else {
    const to =
      typeof menuItem.redirect === "string" ? menuItem.redirect : menuItem;
    router.push(to);
  }
};

const menus = computed(() => {
  if (route.meta?.namePath) {
    let children = [];
    const paths = route.meta.namePath.map((item) => {
      const found = children.find((n) => n.name === item);
      children = found?.children || [];
      return found;
    });
    return [
      {
        name: "__index",
        meta: {
          title: "Home",
        },
        children: [],
      },
      ...paths,
    ];
  }
  return route.matched;
});

const getSelectKeys = (routeIndex: number) => {
  return [menus.value[routeIndex + 1]?.name] as string[];
};
</script>

<style lang="less"></style>
