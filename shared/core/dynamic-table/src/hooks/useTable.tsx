import { nextTick, ref, unref, watch } from "vue";
import { isEmpty } from "lodash-es";
import DynamicTable from "../dynamic-table.vue";
import type { FunctionalComponent } from "vue";
import type { DynamicTableProps } from "../dynamic-table";

type DynamicTableInstance = InstanceType<typeof DynamicTable>;

export const useTable = (props?: Partial<DynamicTableProps>) => {
  const dynamicTableRef = ref<DynamicTableInstance | null>(null);

  const getTableInstance = async (): Promise<DynamicTableInstance | null> => {
    await nextTick();
    const table = unref(dynamicTableRef);
    if (isEmpty(table)) {
      console.error("Failed to retrieve the table instance!");
      return null;
    }
    return table;
  };

  watch(
    () => props,
    async (newProps) => {
      if (newProps) {
        await nextTick();
        const tableInstance = await getTableInstance();
        tableInstance?.setProps?.(newProps);
      }
    },
    {
      deep: true,
      flush: "post",
    },
  );

  const methods = new Proxy(dynamicTableRef, {
    get(target, key: string) {
      if (key in target) {
        return unref(target);
      }
      return async (...args: unknown[]) => {
        const table = await getTableInstance();
        if (table && key in table) {
          return table[key as keyof DynamicTableInstance]?.(...args);
        }
      };
    },
  });

  const DynamicTableRender: FunctionalComponent<DynamicTableProps> = (
    compProps,
    { attrs, slots },
  ) => (
    <DynamicTable
      ref={dynamicTableRef}
      {...{ ...attrs, ...props, ...compProps }}
      v-slots={slots}
    />
  );

  return [DynamicTableRender, methods] as const;
};
