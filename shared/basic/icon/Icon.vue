<script setup lang="ts">
import { computed, type CSSProperties } from "vue";
import * as Icons from "@ant-design/icons-vue";
import { isString } from "lodash-es";

const props = withDefaults(
  defineProps<{
    icon: keyof typeof Icons;
    size?: number | string;
    color?: string;
  }>(),
  {
    size: 28,
  },
);

const getWrapStyle = computed((): CSSProperties => {
  const { size, color } = props;
  let fs = size;
  if (isString(size)) {
    fs = parseInt(size, 10);
  }

  return {
    fontSize: `${fs}px`,
    color,
    display: "inline-flex",
  };
});
</script>

<template>
  <component :style="getWrapStyle" :is="Icons[icon]" />
</template>
