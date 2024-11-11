<template>
  <DynamicTable
    header-title="Управление заготовка"
    title-tooltip="Пожалуйста, не удаляйте заготовки без необходимости, иначае будут удалены все продукты из этой группу заготовок и пропадут из готовоых блюд."
    :data-request="getCategory"
    :columns="columns"
    :scroll="{ x: 800, y: 240 }"
    :row-selection="rowSelection"
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
  getLenthOfTable,
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
  countOfElemnt.value = await getLenthOfTable();
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
          countOfElemnt.value += 1;
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
        countOfElemnt.value -= categoryId.length;
        dynamicTableInstance?.reload();
      },
    });
  } else {
    await categoryDelete(categoryId).finally(() => {
      countOfElemnt.value -= 1;
      dynamicTableInstance?.reload();
    });
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
