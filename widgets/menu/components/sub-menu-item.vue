<template>
  <MyMenuItem :item="item" />
</template>

<script setup lang="ts">
import MyMenuItem from "./menu-item.vue";
import type { PropType } from "vue";
import type { RouteRecordRaw } from "vue-router";

// Define the name of the component
defineOptions({
  name: "MySubMenuItem",
});

// Define the props for the component
const props = defineProps({
  item: {
    type: Object as PropType<RouteRecordRaw>,
    default: () => ({}),
  },
});
</script>

<style scoped></style>
