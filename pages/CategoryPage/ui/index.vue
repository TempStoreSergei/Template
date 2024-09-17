<template>
  <DynamicTable
    row-key="id"
    header-title="VPN Management"
    title-tooltip="Manage VPN Configurations"
    :data-request="getCategory"
    :columns="columns"
    bordered
    :scroll="{ x: 1600 }"
  >
    <template #toolbar>
      <Button type="primary" @click="openAddModal()">Add New</Button>
    </template>
  </DynamicTable>
</template>

<script setup lang="ts">
import { Button, Modal, message } from "ant-design-vue";
import {
  getCategory,
  creteVPNConfig,
  removeVPNConfig,
  updateCategory,
} from "../api";
import { baseColumns } from "../config/columns";
import { vpnCreate } from "../config/formSchemas";
import { serverIp } from "~/shared/api/request";
import { useTable } from "~/shared/core/dynamic-table";
import { useFormModal } from "~/hooks/useModal/";

defineOptions({
  name: "SystemVpn",
});

const [DynamicTable, dynamicTableInstance] = useTable({
  formProps: { autoSubmitOnEnter: true },
});
const [showModal] = useFormModal();

// Modal for adding new VPN configuration
const openAddModal = () => {
  showModal({
    modalProps: {
      title: "Add new category",
      width: "50%",
      onFinish: async (values) => {
        try {
          await creteVPNConfig(values);
          message.success("VPN configuration added successfully.");
          dynamicTableInstance?.reload();
        } catch (error) {
          message.error("Failed to add VPN configuration.");
        }
      },
    },
    formProps: {
      labelWidth: 100,
      schemas: vpnCreate,
    },
  });
};
const filterSameProperties = (values, record) => {
  // Iterate over each key in the values object
  for (const key in values) {
    // If the property exists in both objects and the values are the same
    if (
      values.hasOwnProperty(key) &&
      record.hasOwnProperty(key) &&
      values[key] === record[key]
    ) {
      // Delete the property from the values object
      delete values[key];
    }
  }
};

const TestAfterDelete = async (record: any) => {
  const [formRef] = await showModal({
    modalProps: {
      title: "Add new category",
      width: "50%",
      onFinish: async (values) => {
        try {
          filterSameProperties(values, record);
          const isEmpty = Object.keys(values).length === 0;
          if (isEmpty) {
            message.warn("Data not change.");
          } else {
            if (values.hasOwnProperty("description")) {
              const isNullValue = values.description.length === 0;
              values.description = isNullValue ? "empty" : values.description;
            }
            if (values.hasOwnProperty("file")) {
              const isString = typeof values.file === "string";
              if (isString) {
                delete values.file;
              }
            }
            values.sale = ~~values.sale;
            await updateCategory(record.id, values);
            dynamicTableInstance?.reload();
            message.success("VPN configuration added successfully.");
          }
        } catch (error) {
          message.error("Failed to add VPN configuration.");
        }
      },
    },
    formProps: {
      labelWidth: 100,
      schemas: vpnCreate,
    },
  });

  formRef?.setFieldsValue({
    ...record,
    file: serverIp + record.img,
  });
};

// Handle delete action
const handleDelete = (record) => {
  Modal.confirm({
    title: "Are you sure you want to delete this record?",
    okText: "Yes",
    cancelText: "No",
    onOk: async () => {
      try {
        await removeVPNConfig(record.id);
        message.success("Record deleted successfully.");
        dynamicTableInstance?.reload();
      } catch (error) {
        message.error("Failed to delete the record.");
      }
    },
  });
};

// Define columns for the DynamicTable
const columns = [
  ...baseColumns,
  {
    title: "Actions",
    width: 180,
    dataIndex: "ACTION",
    hideInSearch: true,
    fixed: "right",
    actions: ({ record }) => [
      {
        label: "Delete",
        auth: "system:vpn:delete",
        popConfirm: {
          title: "Are you sure you want to delete?",
          placement: "left",
          onConfirm: () => handleDelete(record),
        },
      },
      {
        label: "Update",
        auth: "system:vpn:download",
        onClick: () => TestAfterDelete(record),
      },
    ],
  },
];
</script>
