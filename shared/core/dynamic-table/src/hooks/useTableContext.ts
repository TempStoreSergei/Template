import { injectLocal, provideLocal } from "@vueuse/core";
import type { DynamicTableType } from "../types";

const key = Symbol("dynamic-table");

export const createTableContext = (instance: DynamicTableType) => {
  provideLocal(key, instance);
};

export const useTableContext = () => {
  return injectLocal(key) as DynamicTableType;
};
