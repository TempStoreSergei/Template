<template>
  <div>
    <Teleport to="body" :disabled="!isFullscreen">
      <div ref="containerElRef">
        <SchemaForm
          v-if="getProps.search"
          ref="searchFormRef"
          class="bg-white dark:bg-black mb-16px !pt-24px pr-24px"
          submit-on-reset
          v-bind="getFormProps"
          :table-instance="dynamicTableContext"
          @toggle-advanced="handleToggleAdvanced"
          @submit="handleSubmit"
        >
          <template v-for="item in getFormSlotKeys" :key="item" #item="data">
            <slot :name="item" v-bind="data || {}" />
          </template>
        </SchemaForm>

        <div class="bg-white dark:bg-black">
          <ToolBar
            v-if="showToolBar"
            :export-file-name="exportFileName"
            :title="headerTitle"
            :title-tooltip="titleTooltip"
            :show-table-setting="showTableSetting"
          >
            <template v-slot:toolbar="data">
              <slot name="toolbar" v-bind="data || {}" />
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
              :data-source="tableData"
              @change="handleTableChange"
            >
              <template v-for="(_, slotName) in $slots" :key="slotName" #slotName="slotData">
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

<script lang="tsx" setup>
  import { useSlots, computed, onBeforeMount } from 'vue';
  import { Table } from 'ant-design-vue';
  import {
    useTableMethods,
    createTableContext,
    useExportData2Excel,
    useTableForm,
    useTableState,
    useColumns,
    useEditable,
  } from './hooks';
  import { ToolBar } from './components';
  import { dynamicTableProps, dynamicTableEmits } from './dynamic-table';
  import type { DynamicTableType } from './types';
  import { SchemaForm } from '@/shared/core/schema-form';

  defineOptions({
    name: 'DynamicTable',
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

  const dynamicTableContext = { props, emit, slots, ...tableState } as DynamicTableType;
  createTableContext(dynamicTableContext);

  const tableMethods = useTableMethods();
  Object.assign(dynamicTableContext, tableMethods);
  const { fetchData, handleSubmit, handleTableChange, handleEditFormValidate } = tableMethods;

  const editableHooks = useEditable();
  Object.assign(dynamicTableContext, editableHooks);

  const { innerColumns } = useColumns();

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
    emit('toggle-advanced', e);
  };
</script>

<style lang="less" scoped>
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
