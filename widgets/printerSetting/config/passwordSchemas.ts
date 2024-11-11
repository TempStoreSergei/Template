import type { FormSchema } from "~/shared/core/schema-form/";

export const passwordForm: FormSchema<any>[] = [
  {
    field: "oldPassword",
    component: "Input",
    label: "Старый пароль",
    rules: [{ required: true }],
    colProps: {
      span: 12,
    },
  },
  {
    field: "newPassword",
    component: "Input",
    rules: [{ required: true }],
    label: "Новый пароль",
    colProps: {
      span: 12,
    },
  },
];
