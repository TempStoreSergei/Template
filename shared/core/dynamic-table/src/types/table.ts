import type { TableProps } from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue/es/table';
import type { DynamicTableProps, DynamicTableEmitFn } from '../dynamic-table';
import type {
  ExportData2Excel,
  TableForm,
  TableMethods,
  TableState,
  UseEditableType,
} from '../hooks';
import type { Slots } from 'vue';

/**
 * Parameters for loading table data.
 */
export type LoadDataParams = TablePaginationConfig & {
  /** Page number, defined according to your business requirements. */
  page?: number;
  /** Number of items per page, defined according to your business requirements. */
  limit?: number;
};

/** Parameters for the table's onChange event callback. */
export type OnChangeCallbackParams = Parameters<NonNullable<TableProps['onChange']>>;

/** onChange event callback function for the table. */
export type OnChangeCallback = TableProps['onChange'];

/** Type for editable rows. */
export type EditableType = 'single' | 'multiple' | 'cell';

/** Callback for saving a cell. */
export type OnSave<T = any> = (
  /** Row ID, usually a unique identifier. */
  key: Key,
  /** The current value of the modified row, only fields within the form will be set. */
  record: T,
  /** Original value, can be used to check if any changes were made. */
  originRow: T,
) => Promise<any | void>;

/** Callback for canceling a cell save. */
export type OnCancel<T = any> = (
  /** Row ID, usually a unique identifier. */
  key: Key,
  /** The current value of the modified row, only fields within the form will be set. */
  record: T,
  /** Original value, can be used to check if any changes were made. */
  originRow: T,
) => any | void;

/** Type representing a dynamic table with various methods and properties. */
export type DynamicTableType = TableState &
  ExportData2Excel &
  UseEditableType &
  TableForm &
  TableMethods & {
    /** Properties for the dynamic table. */
    props: DynamicTableProps;
    /** Emit function for dynamic table events. */
    emit: DynamicTableEmitFn;
    /** Slots available in the dynamic table. */
    slots: Slots;
  };
