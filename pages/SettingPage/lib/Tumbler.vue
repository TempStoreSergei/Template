<script lang="ts" setup>
import { ref } from "vue";
const data = ref([
  {
    value: 0,
    payload: {
      title: "Выключен",
    },
  },
  {
    value: 1,
    payload: {
      title: "Включен",
    },
  },
]);

const value = ref(0);
</script>

<template>
  <a-segmented v-model:value="value" :options="data">
    <template #label="{ payload = {} }">
      <a-typography-text>
        {{ payload.title }}
      </a-typography-text>
    </template>
  </a-segmented>
</template>

<style lang="less" scoped></style>
