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
      <Button type="primary" @click="openAddModal">Add New</Button>
    </template>
  </DynamicTable>
</template>

<script setup lang="ts">
import { Button, message, Modal } from "ant-design-vue";
import {
  creteVPNConfig,
  getCategory,
  removeVPNConfig,
  updateCategory,
} from "../api";
import { baseColumns } from "../config/columns";
import { vpnCreate } from "../config/formSchemas";
import { useTable } from "~/shared/core/dynamic-table";
import { useFormModal } from "~/hooks/useModal/";
import { serverIp } from "~/shared/api/request";

// Setup table and modal hooks
const [DynamicTable, dynamicTableInstance] = useTable({
  formProps: { autoSubmitOnEnter: true },
});
const [showModal] = useFormModal();

// Utility function to filter out unchanged properties
const filterUnchangedProperties = (values: any, record: any) => {
  Object.keys(values).forEach((key) => {
    if (record[key] === values[key]) {
      delete values[key];
    }
  });
};

const urlToBlob = async (url: string) => {
  const response = await fetch(url, { mode: "cors" });
  if (response.ok) {
    return await response.blob();
  } else {
    throw new Error("Network response was not ok.");
  }
};

// Utility function to create FormData for new VPN config
const createFormData = async (
  values: any,
  isUpdate = false,
  origin: string = "",
) => {
  const formData = new FormData();
  const { additional_img_file, ...otherValues } = values;

  // Append other fields to formData
  Object.entries(otherValues).forEach(([key, value]) => {
    formData.append(key, value);
  });

  let imgSrcArray = "";
  if (additional_img_file) {
    console.log(additional_img_file);
    if (additional_img_file.length > 0) {
      if (additional_img_file[0].uid !== "vc-upload-0") {
        const value =
          typeof additional_img_file[0].value !== "object"
            ? await urlToBlob(additional_img_file[0].value)
            : additional_img_file[0].value;
        console.log(value);
        formData.append("main_file", value);
      }

      if (additional_img_file.length > 1) {
        additional_img_file.slice(1).forEach((file) => {
          if (typeof file.value === "object") {
            formData.append("additional_img_file", file.value);
          }
        });
      }

      imgSrcArray = additional_img_file.slice(1).reduce((acc, file) => {
        if (typeof file.value === "string") {
          acc += file.value + ",";
        }
        return acc;
      }, "");

      imgSrcArray = imgSrcArray.slice(0, -1);
      if (imgSrcArray !== origin) {
        formData.append(
          "additional_img_list",
          imgSrcArray !== "" ? imgSrcArray : "empty",
        );
      }

      formData.append("is_active_addit_img", additional_img_file.length > 1);
    } else {
      formData.append("is_active_addit_img", false);
    }
  }

  return formData;
};

// Open modal for adding a new VPN configuration
const openAddModal = () => {
  showModal({
    modalProps: {
      title: "Add new category",
      width: "50%",
      onFinish: async (values: any) => {
        try {
          const formData = await createFormData(values);
          await creteVPNConfig(formData);
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

// Open modal for updating an existing VPN configuration
const openUpdateModal = async (record: any) => {
  const [formRef] = await showModal({
    modalProps: {
      title: "Update category",
      width: "50%",
      onFinish: async (values: any) => {
        try {
          filterUnchangedProperties(values, record);
          if (Object.keys(values).length === 0) {
            message.warn("No data changes.");
            return;
          }
          if (values.sale) {
            values.sale = ~~values.sale;
          }

          const formattedOrigin = record.additional_img
            ? record.additional_img
                .replaceAll(" ", "")
                .split(",")
                .map((url) => serverIp + url)
                .join(",")
            : "";

          const formData = await createFormData(values, true, formattedOrigin);

          await updateCategory(record.id, formData);

          message.success("VPN configuration updated successfully.");
          dynamicTableInstance?.reload();
        } catch (error) {
          console.error(error.message);
          message.error("Failed to update VPN configuration.");
        }
      },
    },
    formProps: {
      labelWidth: 100,
      schemas: vpnCreate,
    },
  });

  const images = [
    { uid: "vc-upload-0", value: serverIp + record.main_img },
    ...(record?.additional_img?.trim()
      ? record.additional_img
          .replaceAll(" ", "")
          .split(",")
          .map((filePath: string, index: number) => ({
            uid: `vc-upload-${index + 1}`,
            value: `${serverIp}${filePath}`,
          }))
      : []),
  ];

  formRef?.setFieldsValue({
    ...record,
    additional_img_file: images,
  });
};

// Handle delete action
const handleDelete = (record: any) => {
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
    title: "Действия",
    width: 120,
    dataIndex: "ACTION",
    hideInSearch: true,
    fixed: "right",
    actions: ({ record }: { record: any }) => [
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
        onClick: () => openUpdateModal(record),
      },
    ],
  },
];
</script>
