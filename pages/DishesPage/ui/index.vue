<template>
  <DynamicTable
    header-title="Управление готовымы блюдами"
    :data-request="getDishes"
    :columns="columns"
    :scroll="{ x: 2200, y: 240 }"
    :row-selection="rowSelection"
    :pagination="{ total: countOfElemnt }"
  >
    <template v-if="isCheckRows" #title>
      <Alert class="w-full" type="info" show-icon>
        <template #message>
          Выбрано {{ isCheckRows }} блюд
          <a-button type="link" @click="rowSelection.selectedRowKeys = []"
            >Отменить выбор</a-button
          >
        </template>
      </Alert>
    </template>
    <template #toolbar>
      <a-button type="primary" @click="openUserModal({})">
        <Icon icon="ant-design:plus-outlined" /> Добавить
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
import { Modal, Alert } from "ant-design-vue";
import { categoriySchemas } from "../config/formSchemas";
import { baseColumns, searchFormSchemas } from "../config/columns";
import {
  getDishes,
  dishCreate,
  dishDelete,
  dishesDelete,
  dishUpdate,
  getDish,
  getLenthOfTable,
} from "../api/index";
import { useTable } from "~/shared/core/dynamic-table";
import { useFormModal } from "~/hooks/useModal";

defineOptions({
  name: "SystemDishes",
});

const [DynamicTable, dynamicTableInstance] = useTable({
  formProps: { autoSubmitOnEnter: true, schemas: searchFormSchemas },
});
const [showModal] = useFormModal();

const rowSelection = ref({
  selectedRowKeys: [] as number[],
  onChange: (selectedRowKeys: number[], selectedRows: TableListItem[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows,
    );
    rowSelection.value.selectedRowKeys = selectedRowKeys;
  },
});

// Проверка выбора строк в таблице
const isCheckRows = computed(() => rowSelection.value.selectedRowKeys.length);

/**
 * @description Открытие модального окна для редактирования/создания пользователя
 */
const openUserModal = async (record: Partial<TableListItem> = {}) => {
  const isUpdate = Boolean(record.id);

  const [formRef] = await showModal({
    modalProps: {
      title: `${isUpdate ? "Редактировать" : "Добавить"} блюдо`,
      width: 700,
      onFinish: async (values) => {
        values.id = record.id;
        const formData = new FormData();

        formData.append("dish_name", values.dish_name);
        formData.append("category_id", values.category_id);
        formData.append("dish_life_time", values.dish_life_time);
        if (values.dish_img && !isHttpUrl(values.dish_img)) {
          formData.append("dish_img", values.dish_img);
        }

        if (values.groceries_list && isArray(values.groceries_list)) {
          values.groceries_list.forEach((item) => {
            formData.append(
              "groceries_list",
              JSON.stringify({
                grocery_name: item.grocery_name,
                grocery_amount: item.grocery_amount,
              }),
            );
          });
        }

        if (record.id) {
          await dishUpdate(record.id, formData);
        } else {
          await dishCreate(formData);
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
    const infoAboutDish = await getDish(record.id);
    formRef?.setFieldsValue({
      dish_name: infoAboutDish.dish_name,
      category_id: infoAboutDish.category_id,
      dish_life_time: infoAboutDish.dish_life_time,
      dish_img: infoAboutDish.dish_img
        ? getDataFromServer(infoAboutDish.dish_img)
        : null,
      groceries_list: infoAboutDish.dish_groceries_list,
    });
  }
};

const countOfElemnt = ref(0);

const setPageSize = async () => {
  countOfElemnt.value = await getLenthOfTable();
};

setPageSize();

/**
 * @description Удаление строки из таблицы
 */
const delRowConfirm = async (dishId: number | number[]) => {
  if (Array.isArray(dishId)) {
    Modal.confirm({
      title: "Вы уверены, что хотите удалить выбранные блюда?",
      icon: <ExclamationCircleOutlined />,
      centered: true,
      onOk: async () => {
        await dishesDelete({ dishesID: dishId });
        dynamicTableInstance?.reload();
      },
    });
  } else {
    await dishDelete(dishId).finally(dynamicTableInstance?.reload);
  }
};

const columns: TableColumnItem[] = [
  ...baseColumns,
  {
    title: "Действие",
    width: 120,
    dataIndex: "ACTION",
    fixed: "right",
    actions: ({ record }) => [
      {
        icon: "ant-design:edit-outlined",
        tooltip: "Редактировать данные блюда",
        onClick: () => openUserModal(record),
      },
      {
        icon: "ant-design:delete-outlined",
        tooltip: "Удалить блюдо",
        popConfirm: {
          title: "Вы уверены, что хотите удалить?",
          placement: "left",
          onConfirm: () => delRowConfirm(record.id),
        },
      },
    ],
  },
];
</script>

<style></style>
