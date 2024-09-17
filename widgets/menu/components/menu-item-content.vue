<template>
  <template v-if="item?.img">
    <Icon :icon="item.img" />
  </template>
  <TitleI18n :title="item?.title" />
</template>

<script lang="ts" setup>
import type { RouteRecordRaw } from "vue-router";
import { Icon } from "~/shared/basic/icon";
import { TitleI18n } from "~/shared/basic/title-i18n";

defineOptions({
  name: "MenuItemContent",
});

defineProps({
  item: {
    type: Object as PropType<RouteRecordRaw>,
    default: () => ({}),
  },
});
</script>
