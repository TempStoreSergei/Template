import type { FormSchema } from "~/shared/core/schema-form/";

export const userSchemas: FormSchema<any>[] = [
  {
    field: "unitFullname",
    component: "Input",
    label: "Полное название велечины",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 24,
    },
  },
  {
    field: "unitShortname",
    rules: [{ required: true, type: "string" }],
    component: "Input",
    label: "Сокращенное название величены",
    colProps: {
      span: 24,
    },
  },
];
