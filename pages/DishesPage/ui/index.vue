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
import { ref, computed, createVNode } from "vue";
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
  itemShortname: string; // --- ДОБАВЛЕНО ---
  categoryID: string;
  itemInStock: boolean;
  itemExpirationDate: number | null;
  itemImage: string;
  unitID: string | null;
  itemRecipe: string;
  itemsIngridients: any;
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
    const { itemsData: dishes } = await getItemsData(params);

    // Строим дерево категорий
    let categoryTree = buildCategoryTree(categories);

    // Добавляем товары к категориям
    let treeWithDishes = addDishesToCategories(categoryTree, dishes);

    // Применяем фильтрацию если есть параметры поиска
    if (params.name || params.type || params.category_id) {
      treeWithDishes = filterTreeData(treeWithDishes, params);
    }

    // Подсчитываем общее количество элементов
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
    countOfElements.value = countElements(treeWithDishes);

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
      .map((item) => {
        const newItem = { ...item };
        if (newItem.type === "category" && newItem.children) {
          newItem.children = filterRecursive(newItem.children);
        }
        return newItem;
      })
      .filter((item) => {
        let isMatch = true;
        if (type) {
          isMatch = isMatch && item.type === type;
        }
        if (name) {
          const lowerCaseName = name.toLowerCase();
          const itemName =
            item.type === "category"
              ? (item as CategoryItem).categoryName.toLowerCase()
              : (item as DishItem).itemName.toLowerCase();
          let nameMatch = itemName.includes(lowerCaseName);
          if (item.type === 'category' && !nameMatch && item.children && item.children.length > 0) {
            return true;
          }
          isMatch = isMatch && nameMatch;
        }
        if (category_id) {
          if (item.type === "dish") {
            isMatch = isMatch && (item as DishItem).categoryID === category_id;
          } else if (item.type === "category") {
            if ((item as CategoryItem).id === category_id || (item.children && item.children.length > 0)) {
              return true;
            }
            isMatch = false;
          }
        }
        if (item.type === "category") {
          return isMatch || (item.children && item.children.length > 0);
        }
        return isMatch;
      });
  };

  return filterRecursive(treeData);
};

const rowSelection = ref({
  selectedRowKeys: [] as string[],
  onChange: (selectedRowKeys: string[]) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys;
  },
});

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
        const formData = new FormData();

        // --- ИСПРАВЛЕНО: Используем корректные имена полей из схемы ---
        if (values.itemName) formData.append("itemName", values.itemName);
        if (values.itemShortname) formData.append("itemShortname", values.itemShortname); // --- ДОБАВЛЕНО ---
        if (values.categoryID) formData.append("categoryID", values.categoryID);
        if (values.itemExpirationDate) formData.append("itemExpirationDate", values.itemExpirationDate.toString());

        formData.append("itemRecipe", values.itemRecipe || "");

        if (values.itemImage && !isHttpUrl(values.itemImage)) {
          formData.append("itemImage", values.itemImage);
        }

        if (values.itemsIngridients && Array.isArray(values.itemsIngridients)) {
          formData.append("itemsIngridients", JSON.stringify(values.itemsIngridients));
        }

        if (isUpdate) {
          formData.append("itemID", record.itemID!);
          await itemUpdate(formData);
        } else {
          await itemCreate(formData);
        }

        dynamicTableInstance?.reload();
      },
    },
    formProps: {
      labelWidth: 150,
      schemas: categoriySchemas,
      autoSubmitOnEnter: true,
    },
  });

  if (isUpdate) {
    const infoAboutDish = await getItem(record.itemID!);

    // --- ИСПРАВЛЕНО: Устанавливаем значения в форму с правильными именами ---
    formRef?.setFieldsValue({
      itemName: infoAboutDish.itemName,
      itemShortname: infoAboutDish.itemShortname, // --- ДОБАВЛЕНО ---
      categoryID: infoAboutDish.categoryID,
      itemExpirationDate: infoAboutDish.itemExpirationDate,
      itemRecipe: infoAboutDish.itemRecipe,
      itemImage: infoAboutDish.itemImage ? getDataFromServer(infoAboutDish.itemImage) : null,
      itemsIngridients: typeof infoAboutDish.itemsIngridients === 'string'
        ? JSON.parse(infoAboutDish.itemsIngridients)
        : infoAboutDish.itemsIngridients,
    });
  }
};

const countOfElements = ref(0);

const delRowConfirm = async (itemKeys: string | string[]) => {
  const keys = Array.isArray(itemKeys) ? itemKeys : [itemKeys];
  const dishKeys = keys.filter((key) => key.startsWith("dish-"));
  const dishIds = dishKeys.map((key) => key.replace("dish-", ""));

  if (dishIds.length === 0) {
    Modal.warning({
      title: "Предупреждение",
      content: "Можно удалять только блюда, категории удалить нельзя.",
    });
    return;
  }

  Modal.confirm({
    title: `Вы уверены, что хотите удалить ${dishIds.length} ${dishIds.length > 1 ? 'блюд' : 'блюдо'}?`,
    icon: createVNode(ExclamationCircleOutlined),
    centered: true,
    onOk: async () => {
      if (dishIds.length > 1) {
        await itemsDelete(dishIds);
      } else {
        await itemDelete(dishIds[0]);
      }
      rowSelection.value.selectedRowKeys = [];
      dynamicTableInstance?.reload();
    },
  });
};

const columns: TableColumnItem[] = [
  {
    title: "Название",
    dataIndex: "name",
    width: 250,
    customRender: ({ record }: { record: TreeItem }) => {
      if (record.type === "category") {
        return <strong style="color: #1890ff;">{record.categoryName}</strong>;
      } else {
        return <span>{record.itemName}</span>;
      }
    },
  },
  {
    title: "Тип",
    dataIndex: "type",
    width: 100,
    customRender: ({ record }: { record: TreeItem }) => {
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
    customRender: ({ record }: { record: TreeItem }) => {
      const expirationDate = record.type === 'category' ? record.categoryExpirationDate : record.itemExpirationDate;
      return expirationDate ? (
        <Tag>{expirationDate} часов</Tag>
      ) : (
        <Tag color="gray">Не указан</Tag>
      );
    },
  },
  {
    title: "В наличии",
    hideInSearch: true,
    dataIndex: "inStock",
    width: 120,
    customRender: ({ record }: { record: TreeItem }) => {
      if (record.type === "category") return <span>-</span>;
      return record.itemInStock ? <Tag color="green">Да</Tag> : <Tag color="red">Нет</Tag>;
    },
  },
  {
    title: "Есть рецепт",
    hideInSearch: true,
    dataIndex: "hasRecipe",
    width: 120,
    customRender: ({ record }: { record: TreeItem }) => {
      if (record.type === "category") return <span>-</span>;
      // Проверяем, что рецепт не пустая строка
      return record.itemRecipe ? <Tag color="green">Да</Tag> : <Tag color="orange">Нет</Tag>;
    },
  },
  {
    title: "Кол-во ингредиентов",
    hideInSearch: true,
    dataIndex: "ingredients",
    width: 150,
    customRender: ({ record }: { record: TreeItem }) => {
      if (record.type === "category") return <span>-</span>;
      const count = Array.isArray(record.itemsIngridients) ? record.itemsIngridients.length : 0;
      return <Tag>{count} ингр.</Tag>;
    },
  },
  {
    title: "Изображение",
    dataIndex: "image",
    hideInSearch: true,
    width: 150,
    customRender: ({ record }: { record: TreeItem }) => {
      if (record.type === "category" || !record.itemImage) return <span>-</span>;
      const imageUrl = getDataFromServer(record.itemImage);
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
    },
  },
  {
    title: "Действие",
    width: 120,
    dataIndex: "ACTION",
    fixed: "right",
    actions: ({ record }: { record: TreeItem }) => {
      if (record.type === "category") return [];
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
            onConfirm: () => delRowConfirm(`dish-${(record as DishItem).itemID}`),
          },
        },
      ];
    },
  },
];
</script>

<style scoped>
:deep(.ant-table-tbody .ant-table-row) {
  transition: background-color 0.3s ease;
}
/* Стили для изображений */
:deep(.dish-image) {
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}
:deep(.dish-image:hover) {
  transform: scale(1.1);
}
</style>