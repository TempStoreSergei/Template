import Tumbler from "../lib/Tumbler.vue";
import type { FormSchema } from "~/shared/core/schema-form/";

export const groceriesInfoPrint: FormSchema<any>[] = [
  {
    field: "amountPortions",
    component: "Input",
    label: "Количество порций",
    colProps: {
      span: 24,
    },
    componentProps: {
      id: "calculator",
    },
  },
  {
    field: "amount",
    component: "Input",
    label: "Масса нетто",
    colProps: {
      span: 24,
    },
    componentProps: {
      id: "calculator",
    },
  },
  {
    field: "quantityBlanks",
    component: "Input",
    label: "Количесто этикеток",
    colProps: {
      span: 24,
    },
    componentProps: {
      id: "calculator",
      min: 1,
      max: 100,
      defaultValue: 1,
    },
  },
];
