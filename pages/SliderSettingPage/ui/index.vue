<template>
  <section class="system-slider">
    <div class="system-slider__settings">
      <a-card class="system-slider__card" title="Базовые настройки">
        <div class="system-slider__switch-segment">
          <a-switch v-model:checked="checked" class="system-slider__switch">
            <template #checkedChildren><check-outlined /></template>
            <template #unCheckedChildren><close-outlined /></template>
          </a-switch>
          <a-segmented
            v-model:value="timeFormat"
            :options="timeFormatList"
            class="system-slider__segmented"
          />
        </div>
        <template #actions>
          <edit-outlined
            key="edit"
            class="system-slider__edit-icon"
            @click="openSettingModal"
          />
        </template>
        <div class="system-slider__time">
          Время в <span>{{ timeFormat }}</span>
        </div>
      </a-card>
    </div>

    <div class="system-slider__table">
      <DynamicTable
        class="system-slider__dynamic-table"
        row-key="id"
        header-title="Настройки заставки"
        title-tooltip="Управление экраном заставки"
        :data-request="getSliders"
        :columns="columns"
        bordered
        :scroll="{ x: 800 }"
      >
        <template #toolbar>
          <Button type="primary" @click="openAddModal()">Добавить слайд</Button>
        </template>
      </DynamicTable>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button, Modal, message } from "ant-design-vue";
import {
  getSliders,
  creteSlide,
  removeSlide,
  updateCategory,
  changeSliderSetting,
} from "../api";
import { baseColumns } from "../config/columns";
import { vpnCreate } from "../config/formSchemas";
import { slideCreate } from "../config/settingFormSchemas";
import { serverIp } from "~/shared/api/request";
import { useTable } from "~/shared/core/dynamic-table";
import { useFormModal } from "~/hooks/useModal/";

defineOptions({
  name: "SystemSlider",
});

const [DynamicTable, dynamicTableInstance] = useTable({
  formProps: { autoSubmitOnEnter: true },
});

const checked = ref(false);
const timeFormat = ref(false);
const timeFormatList = reactive(["Минуты", "Секунты"]);
const [showModal] = useFormModal();

// Modal for adding new VPN configuration

const openSettingModal = () => {
  showModal({
    modalProps: {
      title: "Поменять настройки",
      width: "50%",
      onFinish: async (values) => {
        try {
          await changeSliderSetting(values);
          message.success("VPN configuration added successfully.");
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
const openAddModal = () => {
  showModal({
    modalProps: {
      title: "Add new category",
      width: "50%",
      onFinish: async (values) => {
        try {
          await creteSlide(values);
          message.success("VPN configuration added successfully.");
          dynamicTableInstance?.reload();
        } catch (error) {
          message.error("Failed to add VPN configuration.");
        }
      },
    },
    formProps: {
      labelWidth: 100,
      schemas: slideCreate,
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
      schemas: slideCreate,
    },
  });

  formRef?.setFieldsValue({
    ...record,
    file: serverIp + record.file_path,
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
        await removeSlide(record.id);
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
        label: "Удалить",
        popConfirm: {
          title: "Are you sure you want to delete?",
          placement: "left",
          onConfirm: () => handleDelete(record),
        },
      },
    ],
  },
];
</script>

<style lang="scss">
.system-slider {
  display: flex;
  justify-content: space-between;
  padding: 20px;

  &__settings {
    flex: 1;
    margin-right: 20px;
  }

  &__card {
    width: 100%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  &__switch-segment {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  &__switch {
    margin-right: 16px;
  }

  &__segmented {
    flex: 1;
  }

  &__time {
    font-size: 14px;
    color: #666;
    margin-top: 10px;
  }

  &__edit-icon {
    cursor: pointer;
    color: #1890ff;
    transition: color 0.3s;

    &:hover {
      color: #40a9ff;
    }
  }

  &__table {
    flex: 2;
  }

  &__dynamic-table {
    width: 100%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
}
</style>
