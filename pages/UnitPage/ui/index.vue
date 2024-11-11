<template>
  <DynamicTable
    header-title="Настройка велечин измерения"
    title-tooltip="Пожалуйста, не удаляйте велечин измерения без необходимости, чтобы избежать проблемы с отображенем кол-во ингредиентов в блюде."
    :data-request="getUnits"
    :columns="columns"
    :scroll="{ x: 1600, y: 340 }"
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
import { baseColumns } from "../config/columns";
import {
  getUnits,
  unitCreate,
  unitUpdate,
  unitDelete,
  unitsDelete,
  getLenthOfTable,
} from "../api/index";
import { useTable } from "~/shared/core/dynamic-table";
import { useFormModal } from "~/hooks/useModal";

defineOptions({
  name: "SystemUser",
});

const [DynamicTable, dynamicTableInstance] = useTable({
  formProps: { autoSubmitOnEnter: true },
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

const countOfElemnt = ref(0);

const setPageSize = async () => {
  countOfElemnt.value = await getLenthOfTable();
};

setPageSize();

// Проверка выбора строк в таблице
const isCheckRows = computed(() => rowSelection.value.selectedRowKeys.length);

/**
 * @description Открытие модального окна для редактирования/создания пользователя
 */
const openUserModal = async (record: Partial<TableListItem> = {}) => {
  const isUpdate = Boolean(record.id);

  const [formRef] = await showModal({
    modalProps: {
      title: `${isUpdate ? "Редактировать" : "Добавить"} величену`,
      width: 700,
      onFinish: async (values) => {
        values.id = record.id;
        if (record.id) {
          await unitUpdate(record.id, values);
        } else {
          await unitCreate(values);
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
      unitFullname: record.unit_fullname,
      unitShortname: record.unit_shortname,
    });
  }
};

/**
 * @description Удаление строки из таблицы
 */
const delRowConfirm = async (unitId: number | number[]) => {
  if (Array.isArray(unitId)) {
    Modal.confirm({
      title: "Вы уверены, что хотите удалить выбранные еденицы измерения?",
      icon: <ExclamationCircleOutlined />,
      centered: true,
      onOk: async () => {
        await unitsDelete({ unitsID: unitId });
        countOfElemnt.value -= unitId.length;
        dynamicTableInstance?.reload();
      },
    });
  } else {
    await unitDelete(unitId).finally(() => {
      countOfElemnt.value -= 1;
      dynamicTableInstance?.reload();
    });
  }
};

const columns: TableColumnItem[] = [
  ...baseColumns,
  {
    title: "Действие",
    width: 80,
    dataIndex: "ACTION",
    fixed: "right",
    actions: ({ record }) => [
      {
        icon: "ant-design:edit-outlined",
        tooltip: "Редактировать данные пользователя",
        onClick: () => openUserModal(record),
      },
      {
        icon: "ant-design:delete-outlined",
        tooltip: "Удалить пользователя",
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
