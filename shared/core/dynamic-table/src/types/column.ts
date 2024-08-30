import type { ColumnsType } from 'ant-design-vue/es/table';
import type { FormSchema, GetFieldKeys } from '@/shared/core/schema-form';
import type { ActionItem } from './tableAction';
import type { TableActionType } from '@/shared/core/dynamic-table/src/types';
import type { DataIndex } from 'ant-design-vue/es/vc-table/interface';

// Type for individual column definitions in the table
export type ColumnType<T> = ColumnsType<T>[number];

// Parameters for custom render functions in columns
export type CustomRenderParams<T extends object = Recordable> = Omit<
  Parameters<NonNullable<ColumnType<T>['customRender']>>[number],
  'column'
> & { column: TableColumn<T> };

// Definition for table columns with extended features
export type TableColumn<T extends object = Recordable> = ColumnType<T> & {
  dataIndex?: GetFieldKeys<T> | ColumnKeyFlagType | Omit<DataIndex, string>;
  /** Field used for search queries */
  searchField?: string;
  /** Hide this field in the search form */
  hideInSearch?: boolean;
  /** Hide this column in the table */
  hideInTable?: boolean;
  /** Configuration for Form.Item in the search form, can include rules */
  formItemProps?: Partial<FormSchema<T>>;
  /** Configuration for Form.Item in the editable table, can include rules */
  editFormItemProps?: Partial<FormSchema<T>> & {
    /**
     * Whether to inherit all properties from `TableColumn.formItemProps`, merged deeply
     * When `true`, the behavior is as follows:
     * ```js
     * Object.assign({}, TableColumn.formItemProps, TableColumn.editFormItemProps)
     * ```
     * @default true
     */
    extendSearchFormProps?: boolean;
  };
  /** Actions for the column, usually for operations on a row */
  actions?: (params: CustomRenderParams<T>, action: TableActionType) => ActionItem[];
  /** Whether the cell in this column is editable */
  editable?: boolean | ((params: CustomRenderParams<T>) => boolean);
  /** Default edit state for cells, only relevant if `editableType` is `cell` */
  defaultEditable?: boolean;
};

// Flags used to categorize columns
export enum ColumnKeyFlag {
  ACTION = 'ACTION',
  INDEX = 'INDEX',
}

// Array of column key flags
export const columnKeyFlags = Object.values(ColumnKeyFlag) as string[];

// Type for column key flags
export type ColumnKeyFlagType = `${ColumnKeyFlag}`;
