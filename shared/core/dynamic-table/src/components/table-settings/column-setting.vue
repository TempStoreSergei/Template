<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t("component.table.settingColumn") }}</span>
    </template>
    <Popover
      placement="bottomLeft"
      trigger="click"
      overlay-class-name="column-list"
      @open-change="handleVisibleChange"
    >
      <template #title>
        <div class="popover__title">
          <Checkbox v-model:checked="checkAll" :indeterminate="indeterminate">
            {{ t("component.table.settingColumnShow") }}
          </Checkbox>
          <Checkbox
            v-model:checked="checkIndex"
            @change="handleIndexCheckChange"
          >
            {{ t("component.table.settingIndexColumnShow") }}
          </Checkbox>
          <Checkbox
            v-model:checked="checkBordered"
            @change="handleBorderedCheckChange"
          >
            {{ t("component.table.settingBordered") }}
          </Checkbox>
          <a-button size="small" type="link" @click="reset">
            {{ t("common.resetText") }}
          </a-button>
        </div>
      </template>
      <template #content>
        <div ref="columnListRef">
          <template
            v-for="item in tableColumns"
            :key="table.getColumnKey(item)"
          >
            <div class="column-list__item">
              <div class="column-list__item-content">
                <DragOutlined class="column-list__item-drag-icon" />
                <Checkbox
                  v-model:checked="item.hideInTable"
                  :true-value="false"
                  :false-value="true"
                >
                  {{ item.title }}
                </Checkbox>
              </div>
              <div class="column-list__item-fixed">
                <Tooltip placement="bottomLeft" :mouse-leave-delay="0.4">
                  <template #title>
                    {{ t("component.table.settingFixedLeft") }}
                  </template>
                  <VerticalRightOutlined
                    class="column-list__item-fixed-icon column-list__item-fixed-icon--left"
                    :class="{ active: item.fixed === 'left' }"
                    @click="handleColumnFixed(item, 'left')"
                  />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip placement="bottomLeft" :mouse-leave-delay="0.4">
                  <template #title>
                    {{ t("component.table.settingFixedRight") }}
                  </template>
                  <VerticalLeftOutlined
                    class="column-list__item-fixed-icon column-list__item-fixed-icon--right"
                    :class="{ active: item.fixed === 'right' }"
                    @click="handleColumnFixed(item, 'right')"
                  />
                </Tooltip>
              </div>
            </div>
          </template>
        </div>
      </template>
      <SettingOutlined />
    </Popover>
  </Tooltip>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, unref, watch, type UnwrapRef } from "vue";
import {
  SettingOutlined,
  VerticalRightOutlined,
  VerticalLeftOutlined,
  DragOutlined,
} from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import { Tooltip, Popover, Divider } from "ant-design-vue";
import { useTableContext } from "../../hooks/useTableContext";
import type { TableColumn } from "../../types/column";
import Checkbox from "~/shared/basic/check-box/index.vue";
import { useSortable } from "~/hooks/useSortable";
import { isNil } from "~/shared/utils/is";
import { useI18n } from "~/hooks/useI18n";
import AButton from "~/shared/basic/button";

const { t } = useI18n();
const table = useTableContext();

let inited = false;
const defaultColumns = cloneDeep<TableColumn[]>(table.innerColumns.value);
const defaultShowIndex = !!table.props.showIndex;
const defaultBordered = table.props.bordered;
const tableColumns = ref<TableColumn[]>([]);

const checkAll = computed<boolean>({
  get() {
    return (
      tableColumns.value.length > 0 &&
      tableColumns.value.every((n) => !n.hideInTable)
    );
  },
  set(value) {
    tableColumns.value.forEach((item) => (item.hideInTable = !value));
  },
});

const checkIndex = ref(defaultShowIndex);
const checkBordered = ref(table.props.bordered);
const columnListRef = ref<HTMLDivElement>();

const initCheckStatus = () => {
  tableColumns.value = cloneDeep(defaultColumns) as UnwrapRef<TableColumn[]>;
  checkIndex.value = defaultShowIndex;
  checkBordered.value = defaultBordered;
  tableColumns.value.forEach((item) => (item.hideInTable ??= false));
};
initCheckStatus();

const indeterminate = computed(() => {
  return (
    tableColumns.value.length > 0 &&
    tableColumns.value.some((n) => n.hideInTable) &&
    tableColumns.value.some((n) => !n.hideInTable)
  );
});

watch(
  tableColumns,
  (columns) => {
    table.setProps({ columns });
  },
  {
    deep: true,
  },
);

const handleIndexCheckChange = (e) => {
  table.setProps({ showIndex: e.target.checked });
};

const handleBorderedCheckChange = (e) => {
  table.setProps({ bordered: e.target.checked });
};

const handleColumnFixed = (columItem, direction: "left" | "right") => {
  columItem.fixed = columItem.fixed === direction ? false : direction;
};

async function handleVisibleChange() {
  if (inited) return;
  await nextTick();
  const columnListEl = unref(columnListRef);
  if (!columnListEl) return;

  const { initSortable } = useSortable(columnListEl, {
    handle: ".column-list__item-drag-icon",
    onEnd: (evt) => {
      const { oldIndex, newIndex } = evt;

      if (isNil(oldIndex) || isNil(newIndex) || oldIndex === newIndex) {
        return;
      }

      const columns = tableColumns.value;
      columns.splice(newIndex, 0, columns.splice(oldIndex, 1)[0]);
    },
  });
  initSortable();
  inited = true;
}

const reset = () => {
  initCheckStatus();
  table.setProps({ showIndex: defaultShowIndex, bordered: defaultBordered });
};
</script>

<style lang="scss">
.column-list {
  &__item {
    display: flex;
    justify-content: space-between;

    &-content {
      padding: 4px 16px 8px 0;
    }

    &-drag-icon {
      padding-right: 6px;
      cursor: move;
    }

    &-fixed {
      display: flex;

      &-icon {
        &:hover,
        &--left.active,
        &--right.active {
          color: #1890ff;
        }
      }
    }
  }
}
</style>
