import type { FormSchema } from "~/shared/core/schema-form/";
import { getCategory } from "~/pages/CategoryPage";
import { getUnits } from "~/pages/UnitPage";
import AvatarUpload from "../lib/Image.vue";

export const grocerieSchemas: FormSchema<any>[] = [
  {
    field: "grocery_img",
    component: () => AvatarUpload,
    label: "Изображние",
  },
  {
    field: "grocery_name",
    component: "Input",
    label: "Название заготовки",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 24,
    },
  },
  {
    field: "category_id",
    component: "Select",
    label: "Название группы",
    rules: [{ required: true, type: "number" }],
    colProps: {
      span: 24,
    },
    componentProps: {
      request: async () => {
        const request = await getCategory();
        return request.map((category) => ({
          label: category.category_name,
          value: category.id,
        }));
      },
    },
  },
  {
    field: "grocery_unit",
    component: "Select",
    label: "Единицы измерения",
    rules: [{ required: true, type: "number" }],
    colProps: {
      span: 24,
    },
    componentProps: {
      request: async () => {
        const request = await getUnits();
        return request.map((category) => ({
          label: category.unit_fullname,
          value: category.id,
        }));
      },
    },
  },
  {
    field: "grocery_in_stock",
    component: "Switch",
    label: "Това в наличий",
    rules: [{ required: true, type: "boolean" }],
    colProps: {
      span: 24,
    },
  },
  {
    field: "grocery_life_time",
    component: "Input",
    componentProps: {
      id: "calculator",
    },
    label: "Срок годности",
    rules: [{ required: true}],
    colProps: {
      span: 24,
    },
  },
];
