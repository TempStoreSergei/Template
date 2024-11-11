<template>
  <DynamicTable
    header-title="Управление группами блюд"
    title-tooltip="Пожалуйста, не удаляйте группы блюд без необходимости, иначае будут удалены все продукты из этой группы блюд"
    :data-request="getCategory"
    :columns="columns"
    :row-selection="rowSelection"
    :scroll="{ x: 1200, y: 240 }"
    :pagination="{ total: countOfElemnt }"
  >
    <template v-if="isCheckRows" #title>
      <Alert class="w-full" type="info" show-icon>
        <template #message>
          Выбрано {{ isCheckRows }} заготовок
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
import { categoriSchemas } from "../config/formSchemas";
import { baseColumns, searchFormSchema } from "../config/columns";
import {
  getCategory,
  categoriesDelete,
  categoryCreate,
  categoryUpdate,
  categoryDelete,
  getTableCategoryInfo,
} from "../api/index";
import { useTable } from "~/shared/core/dynamic-table";
import { useFormModal } from "~/hooks/useModal";

defineOptions({
  name: "SystemCategory",
});

const [DynamicTable, dynamicTableInstance] = useTable({
  formProps: { autoSubmitOnEnter: true, schemas: searchFormSchema },
});
const [showModal] = useFormModal();
const countOfElemnt = ref(0);

const setPageSize = async () => {
  countOfElemnt.value = await getTableCategoryInfo();
};

setPageSize();

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
      title: `${isUpdate ? "Редактировать" : "Добавить"} заготовоку`,
      width: 700,
      onFinish: async (values) => {
        values.id = record.id;
        if (record.id) {
          await categoryUpdate(record.id, values);
        } else {
          await categoryCreate(values);
        }
        dynamicTableInstance?.reload();
      },
    },
    formProps: {
      labelWidth: 100,
      schemas: categoriSchemas,
      autoSubmitOnEnter: true,
    },
  });

  if (isUpdate) {
    formRef?.setFieldsValue({
      categoryName: record.category_name,
    });
  }
};

/**
 * @description Удаление строки из таблицы
 */
const delRowConfirm = async (categoryId: number | number[]) => {
  if (Array.isArray(categoryId)) {
    Modal.confirm({
      title: "Вы уверены, что хотите удалить выбранные заготовки?",
      icon: <ExclamationCircleOutlined />,
      centered: true,
      onOk: async () => {
        await categoriesDelete({ categoriesID: categoryId });
        dynamicTableInstance?.reload();
      },
    });
  } else {
    await categoryDelete(categoryId).finally(dynamicTableInstance?.reload);
  }
};

const columns: TableColumnItem[] = [
  ...baseColumns,
  {
    title: "Действие",
    width: 40,
    dataIndex: "ACTION",
    fixed: "right",
    actions: ({ record }) => [
      {
        icon: "ant-design:edit-outlined",
        tooltip: "Редактировать данные заготовки",
        onClick: () => openUserModal(record),
      },
      {
        icon: "ant-design:delete-outlined",
        tooltip: "Удалить заготовку",
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
