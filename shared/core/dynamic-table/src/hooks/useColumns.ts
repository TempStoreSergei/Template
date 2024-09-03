import { computed, unref, h } from 'vue';
import { cloneDeep, isFunction, mergeWith } from 'lodash-es';
import { Input } from 'ant-design-vue';
import { EditableCell } from '../components';
import { ColumnKeyFlag, columnKeyFlags, type CustomRenderParams } from '../types/column';
import tableConfig from '../dynamic-table.config';
import { useTableContext } from './useTableContext';
import type { TableColumn } from '~/shared/core/dynamic-table';
import type { FormSchema } from '~/shared/core/schema-form';
import { isBoolean } from '~/shared/utils/is';
import { TableAction } from '~/shared/core/dynamic-table/src/components';

export const useColumns = () => {
  const tableContext = useTableContext();
  const { slots, props, getProps, paginationRef } = tableContext;

  const innerColumns = computed(() => {
    const innerProps = unref(getProps);
    const columns = cloneDeep(innerProps.columns?.filter((n) => !n.hideInTable) || []);

    // Add an index column if required
    if (innerProps?.showIndex) {
      columns.unshift({
        dataIndex: ColumnKeyFlag.INDEX,
        title: 'Index',
        width: 60,
        align: 'center',
        fixed: 'left',
        ...innerProps.indexColumnProps,
        customRender: ({ index }) => {
          const pagination = unref(paginationRef);
          if (isBoolean(pagination)) {
            return index + 1;
          }
          const { current = 1, pageSize = 10 } = pagination || {};
          return (current - 1) * pageSize + index + 1;
        },
      } as TableColumn);
    }

    return columns.map((column) => {
      const customRender = column.customRender;
      const rowKey = props.rowKey as string;
      const columnKey = tableContext.getColumnKey(column) as string;

      column.align ||= tableConfig.defaultAlign;

      column.customRender = (options) => {
        const { record, index, text } = options as CustomRenderParams<Record<string, any>>;
        /** Check if the current row is in editable mode */
        const isEditableRow = tableContext.isEditable(record[rowKey]);
        /** Check if cell editing mode is enabled */
        const isEditableCell = innerProps.editableType === 'cell';
        /** Check if the current cell is editable */
        const isCellEditable = isBoolean(column.editable)
          ? column.editable
          : (column.editable?.(options) ?? true);
        /** Determine if the cell should be editable */
        const isShowEditable =
          (isEditableRow || isEditableCell) &&
          isCellEditable &&
          !columnKeyFlags.includes(columnKey);

        return isShowEditable
          ? h(
              EditableCell,
              {
                schema: getColumnFormSchema(column, record),
                rowKey: record[rowKey] ?? index,
                editableType: innerProps.editableType,
                column: options,
              },
              { default: () => customRender?.(options) ?? text, ...slots },
            )
          : customRender?.(options);
      };

      // Handle action columns
      if (column.actions && columnKey === ColumnKeyFlag.ACTION) {
        column.customRender = (options) => {
          const { record, index } = options;
          return h(TableAction, {
            actions: column.actions!(options, tableContext),
            rowKey: record[rowKey] ?? index,
            columnParams: options,
          });
        };
      }

      return {
        key: column.key ?? (column.dataIndex as string),
        dataIndex: column.dataIndex ?? (column.key as string),
        ...column,
      } as TableColumn;
    });
  });

  const mergeCustomizer = (objValue, srcValue, key) => {
    /** Handle merging when `componentProps` is a function */
    if (key === 'componentProps') {
      return (...args) => ({
        ...(isFunction(objValue) ? objValue(...args) : objValue),
        ...(isFunction(srcValue) ? srcValue(...args) : srcValue),
      });
    }
  };

  /** Retrieve the form schema for the current row */
  const getColumnFormSchema = (column: TableColumn, record: Record<string, any>): FormSchema => {
    const key = tableContext.getColumnKey(column) as string;
    /** Determine if search form properties should be inherited */
    const isExtendSearchFormProps = !Object.is(
      column.editFormItemProps?.extendSearchFormProps,
      false,
    );

    return {
      field: `${record[props.rowKey as string]}.${column.searchField ?? key}`,
      component: () => Input,
      defaultValue: record[key],
      colProps: {
        span: unref(getProps).editableType === 'cell' ? 20 : 24,
      },
      formItemProps: {
        help: '',
      },
      ...(isExtendSearchFormProps
        ? mergeWith(cloneDeep(column.formItemProps), column.editFormItemProps, mergeCustomizer)
        : column.editFormItemProps),
    };
  };

  return {
    innerColumns,
  };
};
