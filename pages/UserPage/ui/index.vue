<template>
  <DynamicTable
    header-title="Управление пользователями"
    title-tooltip="Пожалуйста, не удаляйте пользователей без необходимости, чтобы избежать нарушения работы других пользователей."
    :data-request="getUser"
    :columns="columns"
    :scroll="{ x: 30, y: 240 }"
    :row-selection="rowSelection"
    :pagination="{ total: countOfElemnt }"
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
import { userSchemas } from "../config/formSchemas";
import { baseColumns, searchFormSchema } from "../config/columns";
import {
  getUser,
  userCreate,
  userUpdate,
  userDelete,
  usersDelete,
  getLenthOfTable,
} from "../api/index";
import { useTable } from "~/shared/core/dynamic-table";
import { useFormModal } from "~/hooks/useModal";

defineOptions({
  name: "SystemUser",
});

const [DynamicTable, dynamicTableInstance] = useTable({
  formProps: { autoSubmitOnEnter: true, schemas: searchFormSchema },
});
const [showModal] = useFormModal();

const rowSelection = ref({
  selectedRowKeys: [] as number[],
  onChange: (selectedRowKeys: number[], selectedRows: TableListItem[]) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys;
  },
});

const countOfElemnt = ref(0);

const setPageSize = async () => {
  countOfElemnt.value = await getLenthOfTable();
};

setPageSize();

const isCheckRows = computed(() => rowSelection.value.selectedRowKeys.length);

/**
 * @description Открытие модального окна для редактирования/создания пользователя
 */
const openUserModal = async (record: Partial<TableListItem> = {}) => {
  const isUpdate = Boolean(record.id);

  const [formRef] = await showModal({
    modalProps: {
      title: `${isUpdate ? "Редактировать" : "Добавить"} пользователя`,
      width: 700,
      onFinish: async (values) => {
        values.id = record.id;
        if (record.id) {
          await userUpdate(record.id, values);
        } else {
          await userCreate(values);
          countOfElemnt.value += 1;
        }
        dynamicTableInstance?.reload();
      },
    },
    formProps: {
      labelWidth: 100,
      schemas: userSchemas,
      autoSubmitOnEnter: true,
    },
  });

  if (isUpdate) {
    formRef?.setFieldsValue({
      userSurname: record.user_surname,
      userFirstName: record.user_first_name,
      userPatronymic: record.user_patronymic,
    });
  }
};

/**
 * @description Удаление строки из таблицы
 */
const delRowConfirm = async (userId: number | number[]) => {
  if (Array.isArray(userId)) {
    Modal.confirm({
      title: "Вы уверены, что хотите удалить выбранных пользователей?",
      icon: <ExclamationCircleOutlined />,
      centered: true,
      onOk: async () => {
        await usersDelete({ usersID: userId });
        countOfElemnt.value -= userId.length;
        rowSelection.value.selectedRowKeys = [];
        dynamicTableInstance?.reload();
      },
    });
  } else {
    await userDelete(userId).finally(() => {
      countOfElemnt.value -= 1;
      dynamicTableInstance?.reload();
    });
  }
};

const columns: TableColumnItem[] = [
  ...baseColumns,
  {
    title: "Действие",
    width: 20,
    dataIndex: "ACTION",
    fixed: "right",
    actions: ({ record }) => [
      {
        icon: "EditOutlined",
        tooltip: "Редактировать данные пользователя",
        onClick: () => openUserModal(record),
      },
      {
        icon: "DeleteOutlined",
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
