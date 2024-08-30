import { tableProps } from 'ant-design-vue/es/table';
import tableConfig from './dynamic-table.config';
import type { PropType, ExtractPublicPropTypes } from 'vue';
import type { BookType } from 'xlsx';
import type { TableColumn, OnChangeCallbackParams, EditableType, OnSave, OnCancel } from './types/';
import type { SchemaFormProps } from '@/shared/core/schema-form';
import type { GetRowKey } from 'ant-design-vue/es/table/interface';
import { isBoolean } from '@/shared/utils/is';

export const dynamicTableProps = {
  ...tableProps(),
  rowKey: {
    type: [String, Function] as PropType<string | GetRowKey<any>>,
    default: 'id',
  },
  /** Whether to show the search form */
  search: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** Configuration for form properties */
  formProps: {
    type: Object as PropType<SchemaFormProps>,
    default: () => ({}),
  },
  /** Configuration for table columns */
  columns: {
    type: Array as PropType<TableColumn[]>,
    required: true,
    default: () => [],
  },
  sortFn: {
    type: Function as PropType<(sortInfo: OnChangeCallbackParams[2]) => any>,
    default: tableConfig.defaultSortFn,
  },
  filterFn: {
    type: Function as PropType<(data: OnChangeCallbackParams[1]) => any>,
    default: tableConfig.defaultFilterFn,
  },
  /** Configuration for API request */
  fetchConfig: {
    type: Object as PropType<Partial<typeof tableConfig.fetchConfig>>,
    default: () => tableConfig.fetchConfig,
  },
  /** Function to request table data */
  dataRequest: {
    // Function to fetch list data from API
    type: Function as PropType<(params: Recordable) => Promise<API.TableListResult | any[]>>,
  },
  /** Whether to make an immediate request */
  immediate: { type: Boolean as PropType<boolean>, default: true },
  // Additional request parameters
  searchParams: {
    type: Object as PropType<Recordable>,
  },
  /** Whether to show index numbers */
  showIndex: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /** Configuration for the index column */
  indexColumnProps: {
    type: Object as PropType<Partial<TableColumn>>,
    default: () => ({}),
  },
  /** Whether to show the table toolbar */
  showToolBar: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** Whether to show table settings */
  showTableSetting: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** Table header title */
  headerTitle: String as PropType<string>,
  /** Tooltip for the table title */
  titleTooltip: String as PropType<string>,
  /** Auto adjust table height */
  autoHeight: Boolean as PropType<boolean>,
  // Configuration for Excel export
  /** Export file name */
  exportFileName: {
    type: String as PropType<string>,
  },
  /** XLSX book type */
  exportBookType: {
    type: String as PropType<BookType>,
    default: 'xlsx',
  },
  /** Auto width for export */
  exportAutoWidth: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** Custom data export format function */
  exportFormatter: {
    type: Function as PropType<
      (columns: TableColumn[], tableData: any[]) => { header: string[]; data: any[] }
    >,
    default: null,
  },
  /** Type of row editing
   * @const `single`: Only one row can be edited at a time
   * @const `multiple`: Multiple rows can be edited simultaneously
   * @const `cell`: Editable cells
   * @defaultValue `single`
   */
  editableType: {
    type: String as PropType<EditableType>,
    default: 'single',
  },
  /** Callback for saving cell edits */
  onSave: {
    type: Function as PropType<OnSave>,
  },
  /** Callback for canceling cell edits */
  onCancel: {
    type: Function as PropType<OnCancel>,
  },
  /** Alert message for editing only one line */
  onlyOneLineEditorAlertMessage: String,
} as const;

export type DynamicTableProps = ExtractPublicPropTypes<typeof dynamicTableProps> &
  EmitsToProps<DynamicTableEmits>;

export const dynamicTableEmits = {
  change: (...rest: OnChangeCallbackParams) => rest.length === 4,
  'toggle-advanced': (isAdvanced: boolean) => isBoolean(isAdvanced),
  'fetch-error': (error) => error,
  search: (params) => params,
  reload: () => true,
  'update:expandedRowKeys': (keys: Key[]) => keys,
  'expanded-rows-change': (keyValues: string[]) => Array.isArray(keyValues),
};

export type DynamicTableEmits = typeof dynamicTableEmits;

export type DynamicTableEmitFn = EmitFn<DynamicTableEmits>;
