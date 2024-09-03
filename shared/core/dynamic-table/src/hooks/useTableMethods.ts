import { unref, nextTick, getCurrentInstance, watch } from 'vue';
import { isFunction, isBoolean, get, debounce } from 'lodash-es';
import { useInfiniteScroll } from '@vueuse/core';
import tableConfig from '../dynamic-table.config';
import { useEditable } from './useEditable';
import { useTableExpand } from './useTableExpand';
import { useTableContext } from './useTableContext';
import type { DynamicTableProps } from '../dynamic-table';
import type { OnChangeCallbackParams, TableColumn } from '../types/';
import type { Pagination } from './useTableState';
import type { FormProps } from 'ant-design-vue';
import { warn } from '~/shared/utils/log';
import { isObject } from '~/shared/utils/is';

export type UseInfiniteScrollParams = Parameters<typeof useInfiniteScroll>;

export type TableMethods = ReturnType<typeof useTableMethods>;

export const useTableMethods = () => {
  const {
    props,
    emit,
    innerPropsRef,
    tableData,
    loadingRef,
    searchFormRef,
    paginationRef,
    editFormErrorMsgs,
    searchState,
  } = useTableContext();

  const editableMethods = useEditable();
  const expandMethods = useTableExpand();

  /**
   * @param {object} params - Query parameters for fetching data
   * @description Fetches data based on query parameters and updates table data
   */
  const fetchData = debounce(async (params: Recordable = {}) => {
    const { dataRequest, dataSource, fetchConfig, searchParams } = props;

    if (!dataRequest || !isFunction(dataRequest) || Array.isArray(dataSource)) {
      return;
    }

    try {
      let pageParams: Recordable = {};
      const pagination = unref(paginationRef)!;

      const { pageField, sizeField, listField, totalField } = {
        ...tableConfig.fetchConfig,
        ...fetchConfig,
      };

      const enablePagination = isObject(pagination);
      if (enablePagination) {
        pageParams = {
          [pageField]: pagination.current,
          [sizeField]: pagination.pageSize,
        };
      }

      const { sortInfo = {}, filterInfo } = searchState;
      let queryParams: Recordable = {
        ...pageParams,
        ...sortInfo,
        ...filterInfo,
        ...searchParams,
        ...params,
      };

      await nextTick();
      if (searchFormRef.value) {
        const values = await searchFormRef.value.validate();
        queryParams = {
          ...searchFormRef.value.handleFormValues(values),
          ...queryParams,
        };
      }

      loadingRef.value = true;
      const res = await dataRequest(queryParams);

      const isArrayResult = Array.isArray(res);
      const resultItems: Recordable[] = isArrayResult ? res : get(res, listField);
      const resultTotal: number = isArrayResult ? res.length : Number(get(res, totalField));

      if (enablePagination && resultTotal) {
        const { current = 1, pageSize = tableConfig.defaultPageSize } = pagination;
        const currentTotalPage = Math.ceil(resultTotal / pageSize);
        if (current > currentTotalPage) {
          updatePagination({ current: currentTotalPage });
          return await fetchData(params);
        }
      }

      tableData.value = resultItems;
      updatePagination({ total: ~~resultTotal });
      if (queryParams[pageField]) {
        updatePagination({ current: queryParams[pageField] || 1 });
      }

      return tableData;
    } catch (error) {
      warn(`Error fetching table data: ${error}`);
      emit('fetch-error', error);
      tableData.value = [];
      updatePagination({ total: 0 });
    } finally {
      loadingRef.value = false;
    }
  });

  // Watch for changes in search parameters and fetch data accordingly
  watch(() => props.searchParams, fetchData);

  // Watch for changes in data source and update pagination
  watch(
    () => props.dataSource,
    (val) => {
      updatePagination({ total: val?.length });
    },
  );

  const setProps = (props: Partial<DynamicTableProps>) => {
    Object.assign(innerPropsRef.value, props);
  };

  /**
   * @description Handles form submission and data fetching
   */
  const handleSubmit = (params, page = 1) => {
    updatePagination({ current: page });
    fetchData(params);
    emit('search', params);
  };

  /**
   * @description Refreshes the table data, optionally resetting the page index
   */
  const reload = (resetPageIndex = false) => {
    const pagination = unref(paginationRef);
    if (resetPageIndex && isObject(pagination)) {
      pagination.current = 1;
    }
    emit('reload');
    return fetchData();
  };

  /**
   * @description Handles changes in table pagination, filters, and sorting
   */
  const handleTableChange = async (...rest: OnChangeCallbackParams) => {
    const [pagination, filters, sorter] = rest;
    const { sortFn, filterFn } = props;

    if (searchFormRef.value) {
      await searchFormRef.value.validate();
    }

    updatePagination(pagination);

    const params: Recordable = {};
    if (sorter && isFunction(sortFn)) {
      const sortInfo = sortFn(sorter);
      searchState.sortInfo = sortInfo;
      params.sortInfo = sortInfo;
    }

    if (filters && isFunction(filterFn)) {
      const filterInfo = filterFn(filters);
      searchState.filterInfo = filterInfo;
      params.filterInfo = filterInfo;
    }

    await fetchData({});
    emit('change', ...rest);
  };

  /**
   * @description Retrieves the column key from a column object
   */
  const getColumnKey = (column: TableColumn) => {
    return (column?.key || column?.dataIndex) as string;
  };

  /** Callback for form validation errors */
  const handleEditFormValidate: FormProps['onValidate'] = (name, status, errorMsgs) => {
    const key = Array.isArray(name) ? name.join('.') : name;
    if (status) {
      editFormErrorMsgs.value.delete(key);
    } else {
      editFormErrorMsgs.value.set(key, errorMsgs);
    }
  };

  /** Updates pagination information */
  const updatePagination = (info: Pagination = paginationRef.value) => {
    if (isBoolean(info)) {
      paginationRef.value = info;
    } else if (isObject(paginationRef.value)) {
      paginationRef.value = {
        ...paginationRef.value,
        ...info,
      };
    }
  };

  /** Sets up infinite scroll */
  const onInfiniteScroll = (
    callback: UseInfiniteScrollParams[1],
    options?: UseInfiniteScrollParams[2],
  ) => {
    const el = getCurrentInstance()?.proxy?.$el.querySelector('.ant-table-body');
    useInfiniteScroll(el, callback, options);
  };

  /**
   * @description Retrieves the dynamic form reference for the search form
   */
  const getSearchFormRef = () => searchFormRef.value;

  return {
    ...editableMethods,
    ...expandMethods,
    setProps,
    handleSubmit,
    handleTableChange,
    getColumnKey,
    fetchData,
    getSearchFormRef,
    reload,
    onInfiniteScroll,
    handleEditFormValidate,
  };
};
