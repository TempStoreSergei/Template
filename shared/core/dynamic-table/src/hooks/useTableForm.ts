import { unref, computed, watchEffect } from "vue";
import { ColumnKeyFlag } from "../types/column";
import { useTableContext } from "./useTableContext";
import type { ComputedRef } from "vue";
import type { FormSchema, SchemaFormProps } from "~/shared/core/schema-form";

export type TableForm = ReturnType<typeof useTableForm>;

export function useTableForm() {
  const { slots, getProps, loadingRef, getColumnKey, getSearchFormRef } =
    useTableContext();

  // Computed property for generating the form props based on table context
  const getFormProps = computed<SchemaFormProps>(() => {
    const props = unref(getProps);
    const { formProps } = props;
    const { submitButtonOptions } = formProps || {};

    return {
      showAdvancedButton: true,
      layout: "horizontal",
      labelWidth: 100,
      schemas: unref(formSchemas),
      ...formProps,
      submitButtonOptions: {
        loading: unref(loadingRef),
        ...submitButtonOptions,
      },
      compact: true,
    };
  });

  // Computed property for generating the form schemas based on table columns
  const formSchemas = computed<FormSchema[]>(() => {
    const columnKeyFlags = Object.keys(ColumnKeyFlag);

    return unref(getProps)
      .columns.filter((column) => {
        const field = getColumnKey(column);
        return (
          !column.hideInSearch &&
          !!field &&
          !columnKeyFlags.includes(field as string)
        );
      })
      .map((column) => ({
        field: column.searchField ?? [getColumnKey(column)].join("."),
        component: "Input",
        label: column.title as string,
        colProps: {
          span: 8,
        },
        ...column.formItemProps,
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  // Syncs the external changes to the form props with the search form reference
  watchEffect(
    () => {
      const searchFormRef = getSearchFormRef();
      if (searchFormRef) {
        searchFormRef.setSchemaFormProps(unref(getFormProps));
      }
    },
    { flush: "post" },
  );

  // Computed property to get slot keys that start with "form-"
  const getFormSlotKeys: ComputedRef<string[]> = computed(() => {
    return Object.keys(slots).filter((key) => key.startsWith("form-"));
  });

  // Helper function to replace "form-" prefix in slot keys
  const replaceFormSlotKey = (key: string): string => {
    return key?.replace(/^form-/, "") || "";
  };

  return {
    getFormProps,
    replaceFormSlotKey,
    getFormSlotKeys,
  };
}
