<template>
  <DynamicTable
  header-title="Управление готовыми блюдами"
  :data-request="fetchTreeData"
  :columns="columns"
  :scroll="{ x: 2200, y: 240 }"
  :row-selection="rowSelection"
  :pagination="{ total: countOfElements }"
  :row-key="(record: any) => record.key || record.id"
  :default-expand-all-rows="false"
  :children-column-name="'children'"
  >
  <template v-if="isCheckRows" #title>
  <Alert class="w-full" type="info" show-icon>
  <template #message>
  Выбрано {{ isCheckRows }} элементов
  <a-button type="link" @click="rowSelection.selectedRowKeys = []"
  >Отменить выбор</a-button
  >
  </template>
  </Alert>
  </template>
  <template #toolbar>
  <a-button type="primary" @click="openUserModal({})">
  <Icon icon="ant-design:plus-outlined" /> Добавить блюдо
  </a-button>
  <a-button
  type="primary"
  :disabled="!isCheckRows"
  @click="delRowConfirm(rowSelection.selectedRowKeys)"
  >
  <Icon icon="ant-design:delete-outlined" /> Удалить
  </a-button>
  </template>
  </DynamicTable>
  </template>
  
  <script setup lang="tsx">
  import { ref, computed } from "vue";
  import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
  import { Modal, Alert, Tag } from "ant-design-vue";
  import { categoriySchemas } from "../config/formSchemas";
  import { type TableColumnItem } from "../config/columns";
  import {
  getItemsData,
  itemCreate,
  itemDelete,
  itemsDelete,
  itemUpdate,
  getItem,
  } from "../api/index";
  import { getCategoryData } from "~/pages/CategoryPage";
  import { useTable } from "~/shared/core/dynamic-table";
  import { useFormModal } from "~/hooks/useModal";
  import { Icon } from "~/shared/basic/icon";
  import { isHttpUrl } from "~/shared/utils/is";
  import { getDataFromServer } from "~/shared/utils/urlUtils";
  
  defineOptions({
  name: "SystemDishes",
  });
  
  // Новые схемы поиска для древовидной структуры
  const treeSearchFormSchemas = [
  {
  field: "name",
  label: "Название",
  component: "Input",
  colProps: { span: 8 },
  componentProps: {
  placeholder: "Поиск по названию категории или блюда",
  },
  },
  {
  field: "type",
  label: "Тип",
  component: "Select",
  colProps: { span: 8 },
  componentProps: {
  placeholder: "Выберите тип",
  options: [
  { label: "Все", value: "" },
  { label: "Категории", value: "category" },
  { label: "Блюда", value: "dish" },
  ],
  },
  },
  {
  field: "category_id",
  label: "Категория",
  component: "Select",
  colProps: { span: 8 },
  componentProps: {
  placeholder: "Выберите категорию",
  request: async () => {
  const { categoriesData: categories } = await getCategoryData();
  return [
  { label: "Все категории", value: "" },
  ...categories.map((category: any) => ({
  label: category.categoryName,
  value: category.id,
  })),
  ];
  },
  },
  },
  ];
  
  const [DynamicTable, dynamicTableInstance] = useTable({
  formProps: { autoSubmitOnEnter: true, schemas: treeSearchFormSchemas },
  });
  const [showModal] = useFormModal();
  
  interface CategoryItem {
  id: string;
  categoryName: string;
  categoryShortname: string;
  categoryExpirationDate: number | null;
  categoryParentID: string | null;
  key: string;
  type: "category";
  children?: TreeItem[];
  }
  
  interface DishItem {
  itemID: string;
  itemName: string;
  categoryID: string;
  itemInStock: boolean;
  itemExpirationDate: number | null;
  itemImage: string;
  unitID: string | null;
  itemRecipe: boolean;
  itemIngridients: number;
  key: string;
  type: "dish";
  category_id_name?: string;
  }
  
  type TreeItem = CategoryItem | DishItem;
  
  // Функция для построения дерева категорий
  const buildCategoryTree = (categories: any[]): CategoryItem[] => {
  const categoryMap = new Map<string, CategoryItem>();
  const rootCategories: CategoryItem[] = [];
  
  // Создаем карту всех категорий
  categories.forEach((cat) => {
  const categoryItem: CategoryItem = {
  ...cat,
  key: `category-${cat.id}`,
  type: "category",
  children: [],
  };
  categoryMap.set(cat.id, categoryItem);
  });
  
  // Строим дерево
  categories.forEach((cat) => {
  const categoryItem = categoryMap.get(cat.id)!;
  if (cat.categoryParentID) {
  const parent = categoryMap.get(cat.categoryParentID);
  if (parent) {
  parent.children = parent.children || [];
  parent.children.push(categoryItem);
  } else {
  rootCategories.push(categoryItem);
  }
  } else {
  rootCategories.push(categoryItem);
  }
  });
  
  return rootCategories;
  };
  
  // Функция для добавления товаров к категориям
  const addDishesToCategories = (
  categoryTree: CategoryItem[],
  dishes: any[],
  ): TreeItem[] => {
  const addDishesToCategory = (categories: CategoryItem[]) => {
  categories.forEach((category) => {
  // Добавляем товары к текущей категории
  const categoryDishes = dishes
  .filter((dish) => dish.categoryID === category.id)
  .map((dish) => ({
  ...dish,
  key: `dish-${dish.itemID}`,
  type: "dish" as const,
  category_id_name: category.categoryName,
  }));
  
  category.children = category.children || [];
  category.children.push(...categoryDishes);
  
  // Рекурсивно добавляем товары к подкатегориям
  if (category.children) {
  const subCategories = category.children.filter(
  (child) => child.type === "category",
  ) as CategoryItem[];
  addDishesToCategory(subCategories);
  }
  });
  };
  
  addDishesToCategory(categoryTree);
  return categoryTree;
  };
  
  const fetchTreeData = async (params: any) => {
  try {
  // Получаем категории
  const { categoriesData: categories } = await getCategoryData();
  
  // Получаем товары
  const { itemsData: dishes, lenItemsData } = await getItemsData(params);
  
  // Строим дерево категорий
  let categoryTree = buildCategoryTree(categories);
  
  // Добавляем товары к категориям
  let treeWithDishes = addDishesToCategories(categoryTree, dishes);
  
  // Применяем фильтрацию если есть параметры поиска
  if (params.name || params.type || params.category_id) {
  treeWithDishes = filterTreeData(treeWithDishes, params);
  }
  
  // Подсчитываем общее количество элементов
  let totalElements = 0;
  const countElements = (items: TreeItem[]): number => {
  let count = 0;
  items.forEach((item) => {
  count++;
  if (item.type === "category" && item.children) {
  count += countElements(item.children);
  }
  });
  return count;
  };
  totalElements = countElements(treeWithDishes);
  
  countOfElements.value = totalElements;
  
  return treeWithDishes;
  } catch (error) {
  console.error("Ошибка при загрузке данных:", error);
  return [];
  }
  };
  
  // Функция для фильтрации древовидных данных
  const filterTreeData = (treeData: TreeItem[], params: any): TreeItem[] => {
  const { name, type, category_id } = params;
  
  const filterRecursive = (items: TreeItem[]): TreeItem[] => {
  return items
  .filter((item) => {
  let shouldInclude = true;
  
  // Фильтр по названию
  if (name) {
  const itemName =
  item.type === "category"
  ? (item as CategoryItem).categoryName.toLowerCase()
  : (item as DishItem).itemName.toLowerCase();
  shouldInclude =
  shouldInclude && itemName.includes(name.toLowerCase());
  }
  
  // Фильтр по типу
  if (type) {
  shouldInclude = shouldInclude && item.type === type;
  }
  
  // Фильтр по категории
  if (category_id) {
  if (item.type === "category") {
  shouldInclude =
  shouldInclude && (item as CategoryItem).id === category_id;
  } else {
  shouldInclude =
  shouldInclude && (item as DishItem).categoryID === category_id;
  }
  }
  
  // Для категорий также фильтруем детей
  if (item.type === "category" && item.children) {
  const filteredChildren = filterRecursive(item.children);
  (item as CategoryItem).children = filteredChildren;
  
  // Если у категории есть подходящие дети, включаем саму категорию
  if (filteredChildren.length > 0 && !shouldInclude) {
  shouldInclude = true;
  }
  }
  
  return shouldInclude;
  })
  .map((item) => {
  // Глубокое копирование для предотвращения мутации оригинальных данных
  if (item.type === "category") {
  return {
  ...item,
  children: item.children ? filterRecursive(item.children) : [],
  };
  }
  return item;
  });
  };
  
  return filterRecursive(treeData);
  };
  
  const rowSelection = ref({
  selectedRowKeys: [] as string[],
  onChange: (selectedRowKeys: string[], selectedRows: TreeItem[]) => {
  rowSelection.value.selectedRowKeys = selectedRowKeys;
  },
  });
  
  // Проверка выбора строк в таблице
  const isCheckRows = computed(() => rowSelection.value.selectedRowKeys.length);
  
  /**
  * @description Открытие модального окна для редактирования/создания пользователя
  */
  const openUserModal = async (record: Partial<DishItem> = {}) => {
  const isUpdate = Boolean(record.itemID);
  
  const [formRef] = await showModal({
  modalProps: {
  title: `${isUpdate ? "Редактировать" : "Добавить"} блюдо`,
  width: 700,
  onFinish: async (values: any) => {
  values.id = record.itemID;
  const formData = new FormData();
  
  formData.append("dish_name", values.dish_name);
  formData.append("category_id", values.category_id);
  formData.append("dish_life_time", values.dish_life_time);
  formData.append("dish_recipe", values.dish_recipe);
  if (values.dish_img && !isHttpUrl(values.dish_img)) {
  formData.append("dish_img", values.dish_img);
  }
  
  if (values.groceries_list && Array.isArray(values.groceries_list)) {
  values.groceries_list.forEach((item: any) => {
  formData.append(
  "groceries_list",
  JSON.stringify({
  grocery_name: item.grocery_name,
  grocery_amount: item.grocery_amount,
  unit_id: item.unit_id,
  }),
  );
  });
  }
  
  if (record.itemID) {
  await itemUpdate(record.itemID, formData);
  } else {
  await itemCreate(formData);
  }
  dynamicTableInstance?.reload();
  },
  },
  formProps: {
  labelWidth: 100,
  schemas: categoriySchemas,
  autoSubmitOnEnter: true,
  },
  });
  
  if (isUpdate) {
  const infoAboutDish = await getItem(record.itemID!);
  formRef?.setFieldsValue({
  dish_name: infoAboutDish.itemName,
  category_id: infoAboutDish.categoryID,
  dish_life_time: infoAboutDish.itemLifeTime,
  dish_recipe: infoAboutDish.itemRecipe,
  dish_img: infoAboutDish.dish_img
  ? getDataFromServer(infoAboutDish.dish_img)
  : null,
  groceries_list: infoAboutDish.dish_groceries_list?.map(
  (grocery: any) => ({
  ...grocery,
  unit_id: grocery.grocery_unit_id,
  }),
  ),
  });
  }
  };
  
  const countOfElements = ref(0);
  
  /**
  * @description Удаление строки из таблицы
  */
  const delRowConfirm = async (itemKeys: string | string[]) => {
  const keys = Array.isArray(itemKeys) ? itemKeys : [itemKeys];
  
  // Фильтруем только товары (исключаем категории)
  const dishKeys = keys.filter((key) => key.startsWith("dish-"));
  const dishIds = dishKeys.map((key) => key.replace("dish-", ""));
  
  if (dishIds.length === 0) {
  Modal.warning({
  title: "Предупреждение",
  content: "Можно удалять только товары, категории удалить нельзя",
  });
  return;
  }
  
  if (dishIds.length > 1) {
  Modal.confirm({
  title: "Вы уверены, что хотите удалить выбранные блюда?",
  icon: <ExclamationCircleOutlined />,
  centered: true,
  onOk: async () => {
  await itemsDelete(dishIds);
  dynamicTableInstance?.reload();
  },
  });
  } else {
  await itemDelete(dishIds[0]).finally(() =>
  dynamicTableInstance?.reload(),
  );
  }
  };
  
  // Обновленные колонки для работы с деревом
  const columns: TableColumnItem[] = [
  {
  title: "Название",
  dataIndex: "name",
  width: 250,
  customRender: ({ record }: any) => {
  if (record.type === "category") {
  return (
  <strong style="color: #1890ff;">
  {(record as CategoryItem).categoryName}
  </strong>
  );
  } else {
  return <span>{(record as DishItem).itemName}</span>;
  }
  },
  },
  {
  title: "Тип",
  dataIndex: "type",
  width: 100,
  customRender: ({ record }: any) => {
  return record.type === "category" ? (
  <Tag color="blue">Категория</Tag>
  ) : (
  <Tag color="green">Блюдо</Tag>
  );
  },
  },
  {
  title: "Срок годности",
  hideInSearch: true,
  dataIndex: "expiration",
  width: 200,
  customRender: ({ record }: any) => {
  if (record.type === "category") {
  const category = record as CategoryItem;
  return category.categoryExpirationDate ? (
  <Tag>{category.categoryExpirationDate} часов</Tag>
  ) : (
  <Tag color="gray">Не указан</Tag>
  );
  } else {
  const dish = record as DishItem;
  return dish.itemExpirationDate ? (
  <Tag>{dish.itemExpirationDate} часов</Tag>
  ) : (
  <Tag color="gray">Не указан</Tag>
  );
  }
  },
  },
  {
  title: "В наличии",
  hideInSearch: true,
  dataIndex: "inStock",
  width: 120,
  customRender: ({ record }: any) => {
  if (record.type === "category") {
  return <span>-</span>;
  } else {
  const dish = record as DishItem;
  return dish.itemInStock ? (
  <Tag color="green">Да</Tag>
  ) : (
  <Tag color="red">Нет</Tag>
  );
  }
  },
  },
  {
  title: "Есть рецепт",
  hideInSearch: true,
  dataIndex: "hasRecipe",
  width: 120,
  customRender: ({ record }: any) => {
  if (record.type === "category") {
  return <span>-</span>;
  } else {
  const dish = record as DishItem;
  return dish.itemRecipe ? (
  <Tag color="green">Да</Tag>
  ) : (
  <Tag color="orange">Нет</Tag>
  );
  }
  },
  },
  {
  title: "Кол-во ингредиентов",
  hideInSearch: true,
  dataIndex: "ingredients",
  width: 150,
  customRender: ({ record }: any) => {
  if (record.type === "category") {
  return <span>-</span>;
  } else {
  const dish = record as DishItem;
  return <Tag>{dish.itemIngridients} ингр.</Tag>;
  }
  },
  },
  {
  title: "Изображение",
  dataIndex: "image",
  hideInSearch: true,
  width: 150,
  customRender: ({ record }: any) => {
  if (record.type === "category") {
  return <span>-</span>;
  } else {
  const dish = record as DishItem;
  if (!dish.itemImage) return <span>Нет изображения</span>;
  
  const imageUrl = getDataFromServer(dish.itemImage);
  return (
  <img
  src={imageUrl}
  width="60"
  height="60"
  alt="Dish Image"
  class="dish-image"
  style="object-fit: cover; border-radius: 4px;"
  />
  );
  }
  },
  },
  {
  title: "Действие",
  width: 120,
  dataIndex: "ACTION",
  fixed: "right",
  actions: ({ record }: any) => {
  if (record.type === "category") {
  return []; // Для категорий не показываем действия
  }
  
  return [
  {
  icon: "EditOutlined",
  tooltip: "Редактировать данные блюда",
  onClick: () => openUserModal(record as DishItem),
  },
  {
  icon: "DeleteOutlined",
  popConfirm: {
  title: "Вы уверены, что хотите удалить?",
  placement: "left",
  onConfirm: () =>
  delRowConfirm(`dish-${(record as DishItem).itemID}`),
  },
  },
  ];
  },
  },
  ];
  </script>
  
  <style scoped>
  :deep(.ant-table-tbody .ant-table-row) {
  transition: background-color 2s ease;
  }
  
  :deep(.ant-table-tbody .ant-table-row:hover) {
  background-color: #f5f5f5;
  }
  
  /* Стили для категорий */
  :deep(.ant-table-tbody .ant-table-row[data-row-type="category"]) {
  background-color: #fafafa;
  font-weight: 500;
  }
  
  :deep(.ant-table-tbody .ant-table-row[data-row-type="category"]:hover) {
  background-color: #e6f7ff;
  }
  
  /* Стили для блюд */
  :deep(.ant-table-tbody .ant-table-row[data-row-type="dish"]) {
  background-color: #ffffff;
  }
  
  /* Иконки разворачивания */
  :deep(.ant-table-row-expand-icon) {
  color: #1890ff;
  font-size: 16px;
  }
  
  :deep(.ant-table-row-expanded .ant-table-row-expand-icon) {
  color: #52c41a;
  }
  
  /* Отступы для элементов дерева */
  :deep(.ant-table-row-level-1 .ant-table-cell:first-child) {
  padding-left: 32px;
  }
  
  :deep(.ant-table-row-level-2 .ant-table-cell:first-child) {
  padding-left: 64px;
  }
  
  /* Разделители между группами */
  :deep(
  .ant-table-tbody
  .ant-table-row[data-row-type="category"]
  + .ant-table-row[data-row-type="category"]
  ) {
  border-top: 2px solid #e8e8e8;
  }
  
  /* Стили для изображений */
  :deep(.dish-image) {
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 1);
  transition: transform 2s ease;
  }
  
  :deep(.dish-image:hover) {
  transform: scale(05);
  }
  
  /* Стили для тегов */
  :deep(.ant-tag) {
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  }
  
  /* Улучшение читаемости заголовков таблицы */
  :deep(.ant-table-thead .ant-table-cell) {
  background-color: #fafafa;
  font-weight: 600;
  border-bottom: 2px solid #e8e8e8;
  }
  
  /* Анимация для expandable rows */
  :deep(.ant-table-expanded-row > .ant-table-cell) {
  border-bottom: 1px solid #e8e8e8;
  }
  
  /* Responsive стили */
  @media (max-width: 768px) {
  :deep(.ant-table-scroll .ant-table-body) {
  overflow-x: auto;
  }
  
  :deep(.dish-image) {
  width: 40px !important;
  height: 40px !important;
  }
  }
  </style>
  
  