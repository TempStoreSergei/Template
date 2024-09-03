<template>
  <Tooltip
    :title="$t('common.searchText')"
    placement="bottom"
    :mouse-enter-delay="0.5"
  >
    <slot><SearchOutlined @click="visible = true" /></slot>
    <DraggableModal
      v-model:open="visible"
      title="Search Menu"
      :keyboard="false"
      @cancel="handleClose"
    >
      <a-input
        ref="inputRef"
        v-model:value="keyword"
        clearable
        placeholder="Please enter keywords to search"
        @change="handleSearch"
      >
        <template #prefix>
          <SearchOutlined class="text-15px text-[#c2c2c2]" />
        </template>
      </a-input>
      <div class="mt-20px">
        <Empty
          v-if="resultOptions.length === 0"
          description="No search results"
        />
        <search-result
          v-else
          v-model:value="activePath"
          :options="resultOptions"
          @enter="handleEnter"
        />
      </div>
      <template #footer>
        <search-footer />
      </template>
    </DraggableModal>
  </Tooltip>
</template>

<script lang="ts" setup>
import { ref, shallowRef, computed, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useDebounceFn, onKeyStroke } from "@vueuse/core";
import { SearchOutlined } from "@ant-design/icons-vue";
import { Empty, Tooltip } from "ant-design-vue";
import SearchResult from "./components/SearchResult.vue";
import SearchFooter from "./components/SearchFooter.vue";
import type { RouteRecordRaw } from "vue-router";
import { DraggableModal } from "~/shared/core/draggable-modal/index";
import { transformI18n } from "~/hooks/useI18n";

const router = useRouter();
const keyword = ref("");
const activePath = ref("");
const menusList = computed(() => transformRouteToList([]));
const resultOptions = shallowRef<RouteRecordRaw[]>([]);
const inputRef = ref<HTMLInputElement | null>(null);
const handleSearch = useDebounceFn(() => search(), 300);

const visible = ref(false);

watch(visible, async (val) => {
  if (val) {
    await nextTick();
    inputRef.value?.focus();
  }
});

const search = () => {
  resultOptions.value = menusList.value.filter((menu) => {
    const title = transformI18n(menu.meta?.title);
    return (
      keyword.value &&
      title
        ?.toLocaleLowerCase()
        .includes(keyword.value.toLocaleLowerCase().trim())
    );
  });
  if (resultOptions.value?.length > 0) {
    activePath.value = resultOptions.value[0].name as string;
  } else {
    activePath.value = "";
  }
};

const transformRouteToList = (
  routes: RouteRecordRaw[],
  treeMap: RouteRecordRaw[] = [],
) => {
  if (routes && routes.length === 0) return [];
  return routes.reduce((acc, cur) => {
    if (!cur.meta?.hideInMenu && !cur.children) {
      acc.push(cur);
    }
    if (cur.children && cur.children.length > 0) {
      transformRouteToList(cur.children, treeMap);
    }
    return acc;
  }, treeMap);
};

const handleClose = () => {
  visible.value = false;
  setTimeout(() => {
    resultOptions.value = [];
    keyword.value = "";
  }, 200);
};

const handleUp = () => {
  const { length } = resultOptions.value;
  if (length === 0) return;
  const index = resultOptions.value.findIndex(
    (item) => item.name === activePath.value,
  );
  if (index === 0) {
    activePath.value = resultOptions.value[length - 1].name as string;
  } else {
    activePath.value = resultOptions.value[index - 1].name as string;
  }
};

const handleDown = () => {
  const { length } = resultOptions.value;
  if (length === 0) return;
  const index = resultOptions.value.findIndex(
    (item) => item.name === activePath.value,
  );
  if (index + 1 === length) {
    activePath.value = resultOptions.value[0].name as string;
  } else {
    activePath.value = resultOptions.value[index + 1].name as string;
  }
};

const handleEnter = () => {
  const { length } = resultOptions.value;
  if (length === 0 || activePath.value === "") return;
  if (/http(s)?:/.test(activePath.value)) {
    window.open(activePath.value);
  } else {
    router.push({ name: activePath.value });
    handleClose();
  }
};

onKeyStroke("Escape", handleClose);
onKeyStroke("Enter", handleEnter);
onKeyStroke("ArrowUp", handleUp);
onKeyStroke("ArrowDown", handleDown);
</script>

<style lang="less"></style>
