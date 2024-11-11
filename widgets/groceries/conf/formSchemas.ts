import Tumbler from "../lib/Tumbler.vue";
import type { FormSchema } from "~/shared/core/schema-form/";

export const groceriesInfoPrint: FormSchema<any>[] = [
  {
    field: "amountPortions",
    component: "InputNumber",
    label: "Количисво порций",
    colProps: {
      span: 24,
    },
    componentProps: {
      type: "number",
      id: "calculator",
    },
  },
  {
    field: "amount",
    component: "InputNumber",
    label: "Объем/Масса",
    colProps: {
      span: 24,
    },
    componentProps: {
      type: "number",
      id: "calculator",
    },
  },
];
