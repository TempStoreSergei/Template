<template>
  <div>
    <Teleport to="body" :disabled="!isFullscreen">
      <div ref="containerElRef">
        <SchemaForm
          v-if="getProps.search"
          ref="searchFormRef"
          class="dynamic-table__search-form"
          submit-on-reset
          v-bind="getFormProps"
          :table-instance="dynamicTableContext"
          @toggle-advanced="handleToggleAdvanced"
          @submit="handleSubmit"
        >
          <template
            v-for="item of getFormSlotKeys"
            #[replaceFormSlotKey(item)]="data"
          >
            <slot :name="item" v-bind="data || {}" />
          </template>
        </SchemaForm>

        <div class="dynamic-table__content">
          <ToolBar
            v-if="showToolBar"
            :export-file-name="exportFileName"
            :title="headerTitle"
            :title-tooltip="titleTooltip"
            :show-table-setting="showTableSetting"
          >
            <template
              v-for="name of Object.keys($slots)"
              #[name]="data"
              :key="name"
            >
              <slot :name="name" v-bind="data || {}" />
            </template>
          </ToolBar>

          <SchemaForm
            ref="editTableFormRef"
            no-style
            :initial-values="editFormModel"
            :show-action-button-group="false"
            :show-advanced-button="false"
            @validate="handleEditFormValidate"
          >
            <Table
              ref="tableRef"
              v-bind="tableProps"
              :columns="innerColumns"
              :locale="locale"
              :data-source="tableData"
              @change="handleTableChange"
            >
              <template
                v-for="(_, slotName) of $slots"
                #[slotName]="slotData"
                :key="slotName"
              >
                <slot :name="slotName" v-bind="slotData" />
              </template>

              <template #bodyCell="slotData">
                <slot name="bodyCell" v-bind="slotData" />
              </template>
            </Table>
          </SchemaForm>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import {
  useSlots,
  computed,
  onBeforeMount,
  defineProps,
  defineEmits,
} from "vue";
import { Table } from "ant-design-vue";
import {
  useTableMethods,
  createTableContext,
  useExportData2Excel,
  useTableForm,
  useTableState,
  useColumns,
  useEditable,
} from "./hooks";
import { ToolBar } from "./components";
import { dynamicTableProps, dynamicTableEmits } from "./dynamic-table";
import type { DynamicTableType } from "./types";
import { SchemaForm } from "~/shared/core/schema-form";

defineOptions({
  name: "DynamicTable",
  inheritAttrs: false,
});

const props = defineProps(dynamicTableProps);
const emit = defineEmits(dynamicTableEmits);
const slots = useSlots();

const tableState = useTableState({ props, slots });
const {
  tableRef,
  tableData,
  isFullscreen,
  containerElRef,
  searchFormRef,
  editTableFormRef,
  getProps,
  getBindValues,
  editFormModel,
} = tableState;

const dynamicTableContext = {
  props,
  emit,
  slots,
  ...tableState,
} as DynamicTableType;
createTableContext(dynamicTableContext);

const tableMethods = useTableMethods();
Object.assign(dynamicTableContext, tableMethods);
const { fetchData, handleSubmit, handleTableChange, handleEditFormValidate } =
  tableMethods;

const editableHooks = useEditable();
Object.assign(dynamicTableContext, editableHooks);

const { innerColumns } = useColumns();

const locale = {
  filterConfirm: "OK",
  filterReset: "Сбросить",
  filterEmptyText: "Нет фильтров",
  filterCheckall: "Выбрать все",
  filterSearchPlaceholder: "Поиск по фильтру",
  filterSelectAll: "Выбрать все",
  emptyText: "Нет данных",
  selectAll: "Выбрать все строки",
  selectInvert: "Инвертировать выбор",
  sortTitle: "Сортировать",
  expand: "Развернуть",
  collapse: "Свернуть",
  triggerDesc: "Отсортировать по убыванию",
  triggerAsc: "Отсортировать по возрастанию",
  cancelSort: "Отменить сортировку",
};

const tableForm = useTableForm();
const { getFormProps, replaceFormSlotKey, getFormSlotKeys } = tableForm;

const exportData2ExcelHooks = useExportData2Excel();

Object.assign(dynamicTableContext, {
  innerColumns,
  ...props,
  ...tableState,
  ...tableForm,
  ...tableMethods,
  ...editableHooks,
  ...exportData2ExcelHooks,
  emit,
});

defineExpose(dynamicTableContext);

const tableProps = computed(() => ({
  ...getBindValues.value,
  ...tableMethods.getExpandOption.value,
}));

onBeforeMount(() => {
  if (props.immediate) {
    fetchData();
  }
});

const handleToggleAdvanced = (e: Event) => {
  emit("toggle-advanced", e);
};
</script>

<style lang="scss" scoped>
.dynamic-table__search-form {
  background-color: white;
  border-radius: 24px;
  padding-top: 24px;
  padding-right: 24px;
  padding: 16px;
  margin-bottom: 16px;

  &.dark {
    background-color: black;
  }
}

.dynamic-table__content {
  border-radius: 24px;
  background-color: white;

  &.dark {
    background-color: black;
  }
}

.ant-table-wrapper {
  padding: 0 6px 6px;

  .ant-table {
    .ant-table-title {
      display: flex;
    }

    .ant-image:hover {
      cursor: zoom-in;
    }
  }
}

.actions > * {
  margin-right: 10px;
}
</style>
