<template>
  <div class="toolbar">
    <div class="toolbar__header">
      <slot name="headerTitle">
        <div class="toolbar__title">
          {{ title }}
          <BasicHelp
            v-if="titleTooltip"
            class="toolbar__help-icon"
            :text="titleTooltip"
          />
        </div>
      </slot>

      <slot name="afterHeaderTitle" />
    </div>

    <div class="toolbar__actions">
      <Space>
        <slot name="toolbar" />
        <span v-if="exportFileName" @click="exportData2Excel">
          <slot name="export-button">
            <a-button type="primary">Export</a-button>
          </slot>
        </span>
      </Space>

      <Divider v-if="$slots.toolbar && showTableSetting" type="vertical" />
      <TableSetting v-if="showTableSetting" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Divider, Space } from "ant-design-vue";
import TableSetting from "../table-settings/index.vue";
import BasicHelp from "~/shared/basic/basic-help/index.vue";
import { useTableContext } from "~/shared/core/dynamic-table/src/hooks";

defineOptions({
  name: "ToolBar",
});

defineProps({
  title: {
    type: String,
    default: "",
  },
  exportFileName: {
    type: String,
    default: "",
  },
  titleTooltip: {
    type: String,
    default: "",
  },
  showTableSetting: {
    type: Boolean,
    default: true,
  },
});

const { exportData2Excel } = useTableContext();
</script>

<style lang="scss">
.toolbar {
  display: flex;
  justify-content: space-between;
  padding: 16px;

  &__header {
    display: flex;
  }

  &__title {
    display: flex;
    align-items: center;
    font-weight: 500;
  }

  &__help-icon {
    margin-left: 6px;
    padding-top: 3px;
  }

  &__actions {
    display: flex;
    align-items: center;
  }
}
</style>
