import AvatarUploadMultiple from "../lib/Image.vue";
import ColorSelect from "../lib/Color.vue";
import type { FormSchema } from "~/shared/core/schema-form/";
import { getCategory } from "~/pages/CategoryPage";

export const vpnCreate: FormSchema<any>[] = [
  {
    field: "additional_img_file",
    component: () => AvatarUploadMultiple,
    label: "Изображение",
  },
  {
    field: "sale",
    rules: [{ required: true }],
    component: "InputNumber",
    label: "Скидка",
    colProps: {
      span: 12,
    },
  },
  {
    field: "price",
    rules: [{ required: true }],
    component: "InputNumber",
    label: "Цена",
    colProps: {
      span: 12,
    },
  },
  {
    field: "title",
    component: "Input",
    label: "Название",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 12,
    },
  },
  {
    field: "main_color",
    component: () => ColorSelect,
    label: "Цвет",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 12,
    },
  },
  {
    field: "description",
    component: "InputTextArea",
    label: "Описание",
    colProps: {
      span: 24,
    },
  },
  {
    field: "category_id",
    component: "Select",
    label: "Категория",
    rules: [{ required: true, type: "number" }],
    componentProps: {
      request: async () => {
        const request = await getCategory();
        return request.map((category) => ({
          label: category.title,
          value: category.id,
        }));
      },
    },
  },
];
