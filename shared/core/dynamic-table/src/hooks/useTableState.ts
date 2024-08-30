import { computed, reactive, ref, unref, watch, type Slots } from 'vue';
import { omit } from 'lodash-es';
import tableConfig from '../dynamic-table.config';
import { useScroll } from './useScroll';
import type { DynamicTableProps } from '../dynamic-table';
import type { TableProps, Table } from 'ant-design-vue';
import type { SchemaForm } from '@/shared/core/schema-form';
import { useI18n } from '@/hooks/useI18n';

export type Pagination = TableProps['pagination'];

export type TableState = ReturnType<typeof useTableState>;

export type UseTableStateParams = {
  props: DynamicTableProps;
  slots: Slots;
};

interface SearchState {
  sortInfo: Recordable;
  filterInfo: Record<string, string[]>;
}

export const useTableState = ({ props, slots }: UseTableStateParams) => {
  const { t } = useI18n();
  /** Table instance */
  const tableRef = ref<InstanceType<typeof Table>>();
  /** Search form instance */
  const searchFormRef = ref<InstanceType<typeof SchemaForm>>();
  /** Edit table form instance */
  const editTableFormRef = ref<InstanceType<typeof SchemaForm>>();
  /** Table data */
  const tableData = ref<any[]>([]);
  /** Internal properties */
  const innerPropsRef = ref<Partial<DynamicTableProps>>({});
  /** Pagination configuration */
  const paginationRef = ref<NonNullable<Pagination>>(false);
  /** Table loading state */
  const loadingRef = ref<boolean>(!!props.loading);
  /** Is table in fullscreen mode */
  const isFullscreen = ref(false);
  /** Dynamic table container element */
  const containerElRef = ref<HTMLDivElement | null>(null);
  /** Edit form model */
  const editFormModel = ref<Recordable>({});
  /** All form items that failed validation */
  const editFormErrorMsgs = ref(new Map());
  /** Keys of rows currently being edited, formatted as `${recordKey}` */
  const editableRowKeys = ref(new Set<Key>());
  /** Keys of cells currently being edited, formatted as `${recordKey}.${dataIndex}`, valid only when `editableType` is `cell` */
  const editableCellKeys = ref(new Set<Key>());
  /** Search parameters when sorting or filtering the table */
  const searchState = reactive<SearchState>({
    sortInfo: {},
    filterInfo: {},
  });

  const { scroll } = useScroll({ props, containerElRef });

  if (!Object.is(props.pagination, false)) {
    paginationRef.value = {
      current: 1,
      pageSize: tableConfig.defaultPageSize,
      total: 0,
      pageSizeOptions: [...tableConfig.pageSizeOptions],
      showQuickJumper: true,
      showSizeChanger: true, // Show option to change page size
      showTotal: (total) => t('component.table.total', { total }), // Show total count
      ...props.pagination,
    };
  }

  const getProps = computed(() => {
    return Object.assign({}, props, unref(innerPropsRef));
  });

  const getBindValues = computed(() => {
    const props = unref(getProps);

    let propsData: Recordable = {
      ...props,
      scroll: { ...unref(scroll), ...props.scroll },
      pagination: props.pagination ?? unref(paginationRef),
      rowKey: props.rowKey ?? 'id',
      loading: props.loading ?? unref(loadingRef),
      tableLayout: props.tableLayout ?? 'fixed',
    };
    if (slots.expandedRowRender) {
      propsData = omit(propsData, 'scroll');
    }

    propsData = omit(propsData, ['class', 'onChange', 'columns']);
    return propsData;
  });

  // If the external dataSource is set, use the provided data directly
  watch(
    () => props.dataSource,
    (val) => {
      if (val) {
        tableData.value = val;
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );

  watch(
    () => props.columns,
    (val) => {
      if (val) {
        Object.assign(innerPropsRef.value, { columns: val });
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );

  return {
    tableRef,
    editTableFormRef,
    loadingRef,
    isFullscreen,
    containerElRef,
    tableData,
    searchFormRef,
    innerPropsRef,
    getProps,
    getBindValues,
    paginationRef,
    editFormModel,
    editFormErrorMsgs,
    editableCellKeys,
    editableRowKeys,
    searchState,
  };
};
