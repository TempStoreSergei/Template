import ListSelect from "../lib/List";
import AvatarUpload from "../lib/Image";
import type { FormSchema } from "~/shared/core/schema-form/";
import { getAllCategory } from "~/pages/DishCategoryPage";

export const categoriySchemas: FormSchema<any>[] = [
  {
    field: "itemImage",
    component: () => AvatarUpload,
    label: "Изображние",
  },
  {
    field: "itemName",
    component: "Input",
    label: "Название блюда",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 24,
    },
  },
  {
    field: "categoryID",
    component: "Select",
    label: "Категория блюда",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 24,
    },
    componentProps: {
      request: async () => {
        const items = await getAllCategory();
        return items.map((item) => ({
          label: item.categoryName,
          value: item.id,
        }));
      },
    },
  },
  {
    field: "itemExpirationDate",
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
  {
    field: "itemIngridients",
    label: "Список ингредиентов",
    component: () => ListSelect,
    colProps: {
      span: 24,
    },
  },
  {
    field: "itemRecipe",
    component: "InputTextArea",
    label: "Рецепт блюда",
    componentProps: {
      autosize: { minRows: 6, maxRows: 6 },
    },
    colProps: {
      span: 24,
    },
  },
];
