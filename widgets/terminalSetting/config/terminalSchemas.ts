import type { FormSchema } from "~/shared/core/schema-form/";

export const terminalForm: FormSchema<any>[] = [
  {
    field: "terminalName",
    component: "Input",
    rules: [{ required: true }],
    label: "Новое название цеха",
    colProps: {
      span: 24,
    },
  },
];
