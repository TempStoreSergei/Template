import AvatarUpload from "../lib/Image.vue";
import type { FormSchema } from "~/shared/core/schema-form/";

export const slideCreate: FormSchema<any>[] = [
  {
    field: "file",
    component: () => AvatarUpload,
    label: "Файл",
  },
  {
    field: "order",
    rules: [{ required: true }],
    component: "InputNumber",
    label: "Номер",
    colProps: {
      span: 12,
    },
  },
];
