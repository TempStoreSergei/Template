import type { FormSchema } from "~/shared/core/schema-form/";

export const customSizePaper: FormSchema<any>[] = [
  {
    field: "width",
    component: "Input",
    label: "Ширина",
    rules: [
      { required: true },
      {
        pattern: /^[0-9]*\,?[0-9]{0,1}$/,
        message: "Только одна запятая",
      },
    ],
    colProps: {
      span: 24,
    },
    componentProps: {
      type: "text",
      id: "calculatorPoint",
    },
  },
  {
    field: "height",
    component: "Input",
    label: "Высота",
    rules: [
      { required: true },
      {
        pattern: /^[0-9]*\,?[0-9]{0,1}$/,
        message: "Только одна запятая",
      },
    ],
    colProps: {
      span: 24,
    },
    componentProps: {
      type: "text",
      id: "calculatorPoint",
    },
  },
];
