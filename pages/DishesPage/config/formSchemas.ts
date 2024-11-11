import ListSelect from "../lib/List";
import AvatarUpload from "../lib/Image";
import type { FormSchema } from "~/shared/core/schema-form/";
import { getAllCategory } from "~/pages/DishCategoryPage";

export const categoriySchemas: FormSchema<any>[] = [
  {
    field: "dish_img",
    component: () => AvatarUpload,
    label: "Изображние",
  },
  {
    field: "dish_name",
    component: "Input",
    label: "Название блюда",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 24,
    },
  },
  {
    field: "category_id",
    component: "Select",
    label: "Категория блюда",
    rules: [{ required: true, type: "number" }],
    colProps: {
      span: 24,
    },
    componentProps: {
      request: async () => {
        const items = await getAllCategory();
        return items.map((item) => ({
          label: item.category_name,
          value: item.id,
        }));
      },
    },
  },
  {
    field: "dish_life_time",
    component: "InputNumber",
    label: "Срок годности (в часах)",
    rules: [{ required: true, type: "string" }],
    componentProps: {
      type: "number",
      id: "calculator",
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: "groceries_list",
    label: "Список ингредиентов",
    component: () => ListSelect,
    colProps: {
      span: 24,
    },
  },
];
