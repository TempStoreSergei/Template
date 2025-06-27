import type { FormSchema } from "~/shared/core/schema-form/";

export const categoriSchemas: FormSchema<any>[] = [
  {
    field: "categoryName",
    component: "Input",
    label: "Название группы блюд",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 24,
    },
  },
];
