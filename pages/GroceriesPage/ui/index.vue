<template>
  <DynamicTable
    header-title="Управление заготовками"
    title-tooltip="Пожалуйста, не удаляйте заготовки без необходимости. Иначе будут удалены все продукты из этой группы заготовок и пропадут из готовых блюд."
    :data-request="fetchGroceries"
    :columns="columns"
    :scroll="{ x: 2000, y: 240 }"
    :row-selection="rowSelection"
    :pagination="{ total: countOfElemnt }"
  >
    <template v-if="selectedRowCount" #title>
      <Alert class="w-full" type="info" show-icon>
        <template #message>
          Выбрано {{ selectedRowCount }} заготовок
          <a-button type="link" @click="clearSelectedRows">
            Отменить выбор
          </a-button>
        </template>
      </Alert>
    </template>
    <template #toolbar>
      <a-button type="primary" @click="openModal({})">
        <Icon icon="ant-design:plus-outlined" /> Добавить
      </a-button>
      <a-button
        type="primary"
        :disabled="!selectedRowCount"
        @click="confirmDelete(selectedRowKeys)"
      >
        <Icon icon="ant-design:delete-outlined" /> Удалить
      </a-button>
    </template>
  </DynamicTable>
</template>

<script setup lang="tsx">
import { ref, computed } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Modal, Alert, message } from "ant-design-vue";
import { grocerieSchemas } from "../config/formSchemas";
import { baseColumns, searchFormSchemas } from "../config/columns";
import {
  getGroceries,
  grocerieCreate,
  grocerieDelete,
  grocerieUpdate,
  groceriesDelete,
  getLenthOfTable,
} from "../api/index";
import { getCategory } from "~/pages/CategoryPage";
import { getUnits } from "~/pages/UnitPage";
import { useTable } from "~/shared/core/dynamic-table";
import { useFormModal } from "~/hooks/useModal";

defineOptions({
  name: "SystemUser",
});

const fetchGroceries = async (params: any) => {
  const originalData = await getGroceries(params);
  const categories = await getCategory();
  const units = await getUnits();

  const getCategoryNameById = (id) => {
    const foundCategory = categories.find((cat) => cat.id === id);
    return foundCategory ? foundCategory.category_name : "Unknown Category";
  };

  const getUnitNameById = (id) => {
    const foundUnit = units.find((unit) => unit.id === id);
    return foundUnit ? foundUnit.unit_fullname : "Unknown Unit";
  };

  const updatedData = originalData.map((grocery) => ({
    ...grocery,
    grocery_unit_name: getUnitNameById(grocery.grocery_unit),
    category_id_name: getCategoryNameById(grocery.category_id),
  }));

  return updatedData;
};

const [DynamicTable, dynamicTableInstance] = useTable({
  formProps: { autoSubmitOnEnter: true, schemas: searchFormSchemas },
});
const [showModal] = useFormModal();

const rowSelection = ref({
  selectedRowKeys: [],
  onChange: (selectedRowKeys, selectedRows) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys;
  },
});

const countOfElemnt = ref(0);

const setPageSize = async () => {
  countOfElemnt.value = await getLenthOfTable();
};

setPageSize();

// Computed property for selected rows count
const selectedRowCount = computed(
  () => rowSelection.value.selectedRowKeys.length,
);
const selectedRowKeys = computed(() => rowSelection.value.selectedRowKeys);

/**
 * @description Opens modal for creating/updating grocery item
 */
const openModal = async (record = {}) => {
  const isUpdate = Boolean(record.id);

  const [formRef] = await showModal({
    modalProps: {
      title: `${isUpdate ? "Редактировать" : "Добавить"} заготовку`,
      width: 700,
      onFinish: async (values) => {
        values.id = record.id;
        cleanValues(record, values);

        if (Object.keys(values).length === 0) {
          message.info("Переданы те же данные");
          return;
        }

        if (values.grocery_img === null) {
          values.grocery_img_delete = true;
        }

        await handleFormSubmission(record.id, values);
        dynamicTableInstance?.reload();
      },
    },
    formProps: {
      labelWidth: 100,
      schemas: grocerieSchemas,
      autoSubmitOnEnter: true,
    },
  });

  if (isUpdate) {
    formRef?.setFieldsValue({
      ...record,
      grocery_img: record.grocery_img
        ? getDataFromServer(record.grocery_img)
        : null,
    });
  }
};

/**
 * @description Cleans values by removing unchanged properties
 */
const cleanValues = (record, values) => {
  Object.keys(values).forEach((key) => {
    if (key === "grocery_img" && isHttpUrl(values[key])) {
      delete values[key];
    }
    if (record[key] === values[key]) {
      delete values[key];
    }
  });
};

/**
 * @description Handles form submission for creating/updating
 */
const handleFormSubmission = async (id, values) => {
  if (id) {
    await grocerieUpdate(id, values);
  } else {
    await grocerieCreate(values);
    countOfElemnt.value += 1;
  }
};

/**
 * @description Confirms and deletes selected rows from the table
 */
const confirmDelete = async (groceriesId) => {
  if (Array.isArray(groceriesId)) {
    Modal.confirm({
      title: "Вы уверены, что хотите удалить выбранные заготовки?",
      icon: <ExclamationCircleOutlined />,
      centered: true,
      onOk: async () => {
        await groceriesDelete({ groceriesID: groceriesId });
        countOfElemnt.value -= groceriesId.length;
        dynamicTableInstance?.reload();
      },
    });
  } else {
    await grocerieDelete(groceriesId).finally(() => {
      countOfElemnt.value -= 1;
      dynamicTableInstance?.reload();
    });
  }
};

// Columns configuration
const columns: TableColumnItem[] = [
  ...baseColumns,
  {
    title: "Действие",
    width: 120,
    dataIndex: "ACTION",
    fixed: "right",
    actions: ({ record }) => [
      {
        icon: "EditOutlined",
        tooltip: "Редактировать данные заготовки",
        onClick: () => openModal(record),
      },
      {
        icon: "DeleteOutlined",
        popConfirm: {
          title: "Вы уверены, что хотите удалить?",
          placement: "left",
          onConfirm: () => confirmDelete(record.id),
        },
      },
    ],
  },
];
</script>
