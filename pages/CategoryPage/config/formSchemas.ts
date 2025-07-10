import type { FormSchema } from "~/shared/core/schema-form/";

export const categoriSchemas: FormSchema<any>[] = [
  {
    field: "categoryName",
    component: "Input",
    label: "Название группы заготовок",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 24,
    },
  },
  {
    field: "categoryShortname",
    component: "Input",
    label: "Короткое название",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 24,
    },
  },
  {
    field: "categoryExpirationDate",
    component: "Input",
    label: "Срок годности (в часах)",
    rules: [{ required: true, type: "string" }],
    componentProps: {
      id: "calculator",
    },
    colProps: {
      span: 24,
    },
  },
];
