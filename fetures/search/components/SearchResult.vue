<template>
  <div>
    <div class="pb-12px">
      <template v-for="item in options" :key="item.name">
        <div
          class="bg-[#e5e7eb] h-56px mt-8px px-14px rounded-4px flex items-center justify-between"
          style="cursor: pointer"
          :style="{
            background: item.name === active ? '#1890ff' : '',
            color: item.name === active ? '#fff' : '',
          }"
          @click="handleTo"
          @mouseenter="handleMouse(item)"
        >
          <BookOutlined />
          <TitleI18n class="flex-1 ml-5px" :title="item.meta?.title" />
          <EnterOutlined class="icon text-20px p-2px mr-3px" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { EnterOutlined, BookOutlined } from "@ant-design/icons-vue";
import type { RouteRecordRaw } from "vue-router";
import { TitleI18n } from "~/shared/basic/title-i18n/index.ts";

interface Props {
  value: string;
  options: RouteRecordRaw[];
}

interface Emits {
  (e: "update:value", val: string): void;
  (e: "enter"): void;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<Emits>();

const active = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    emit("update:value", val);
  },
});

const handleMouse = async (item: RouteRecordRaw) => {
  active.value = item.name as string;
};

const handleTo = () => {
  emit("enter");
};
</script>

<style lang="less">
.icon {
  box-shadow:
    inset 0 -2px #cdcde6,
    inset 0 0 1px 1px #fff,
    0 1px 2px 1px #1e235a66;
}
</style>
