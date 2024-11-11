import type { FormSchema } from "~/shared/core/schema-form/";

export const userSchemas: FormSchema<any>[] = [
  {
    field: "userSurname",
    component: "Input",
    label: "Фамилия",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 24,
    },
  },
  {
    field: "userFirstName",
    rules: [{ required: true, type: "string" }],
    component: "Input",
    label: "Имя",
    colProps: {
      span: 24,
    },
  },
  {
    field: "userPatronymic",
    component: "Input",
    label: "Отчество",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 24,
    },
  },
];
