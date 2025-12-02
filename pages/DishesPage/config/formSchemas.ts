// ../config/formSchemas.ts

import ListSelect from "../lib/List";
import AvatarUpload from "../lib/Image";
import type { FormSchema } from "~/shared/core/schema-form/";
import { getFinalCategoryData } from "~/pages/CategoryPage";

export const categoriySchemas: FormSchema<any>[] = [
  {
    field: "itemImage",
    component: () => AvatarUpload,
    label: "Изображение",
  },
  {
    field: "itemName",
    component: "Input",
    label: "Название блюда",
    rules: [{ required: true, message: "Пожалуйста, введите название" }],
    colProps: {
      span: 24,
    },
  },
  {
    field: "itemShortname",
    component: "Input",
    label: "Краткое название",
    rules: [
      { required: true, message: "Пожалуйста, введите краткое название" },
    ],
    colProps: {
      span: 24,
    },
  },
  {
    field: "categoryID",
    component: "Select",
    label: "Категория блюда",
    rules: [{ required: true, message: 'Пожалуйста, выберите категорию' }],
    colProps: {
      span: 24,
    },
    componentProps: {
      request: async () => {
        const items = await getFinalCategoryData();
        return items.categoriesData.map((item) => ({
          label: item.categoryName,
          value: item.id,
        }));
      },
    },
  },
  {
    field: "itemExpirationDate",
    component: "InputNumber", // Рекомендуется использовать InputNumber для чисел
    label: "Срок годности (в часах)",
    rules: [
      {
        required: true,
        type: "number",
        message: "Пожалуйста, укажите срок годности",
      },
    ],
    componentProps: {
      min: 0,
      style: { width: "100%" },
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: "itemsIngridients",
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