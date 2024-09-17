import Tumbler from "../lib/Tumbler.vue";
import type { FormSchema } from "~/shared/core/schema-form/";

export const vpnCreate: FormSchema<any>[] = [
  {
    field: "isEnable",
    component: () => Tumbler,
    label: "Состыояние",
  },
  {
    field: "timeToChangeIMG",
    component: "InputNumber",
    label: "Время (сек)",
    colProps: {
      span: 12,
    },
  },
];
