<template>
  <section class="printer-setting">
    <a-alert class="w-full" type="info">
      <template #message>
        При использований друхи расходников для принтера будет необходимо
        настройть размер печати самостоятельно
      </template>
    </a-alert>
    <!-- Print Speed Segment -->
    <a-divider>Скорость печати</a-divider>
    <a-flex gap="large">
      <a-tag color="blue">Медлено</a-tag>
      <a-segmented
        v-model:value="selectedPrintSpeed"
        :options="printSpeedOptions"
        @change="chagePrinterSpeed({ printerSpeed: $event })"
      >
        <template #label="{ value: val, payload = {} }">
          <div style="padding: 4px 4px">
            <div>{{ val }}</div>
          </div>
        </template>
      </a-segmented>
      <a-tag color="blue">Быстро</a-tag>
    </a-flex>

    <!-- Darkness Segment -->
    <a-divider>Темнота печати</a-divider>
    <a-flex gap="large">
      <a-tag color="blue">Тускло</a-tag>
      <a-segmented
        v-model:value="selectedDarkness"
        :options="darknessOptions"
        @change="chagePrinterDarknes({ printerDarkness: $event })"
      >
        <template #label="{ value: val, payload = {} }">
          <div style="padding: 4px 4px">
            <div>{{ val }}</div>
          </div>
        </template>
      </a-segmented>
      <a-tag color="blue">Ярко</a-tag>
    </a-flex>

    <a-divider>Действия</a-divider>
    <a-flex gap="large">
      <a-button type="dashed" @click="openPageSetting">
        Размер печати
      </a-button>
      <a-button type="primary" @click="testPagePrint">
        Тестовая печать</a-button
      >
    </a-flex>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getInfoAboutPrinter,
  chagePrinterDarknes,
  chagePrinterPapperSize,
  chagePrinterSpeed,
  testPagePrint,
  getInfoAboutSticker,
} from "../api";
import { customSizePaper } from "../config/formSchemas";
import { useFormModal } from "~/hooks/useModal";

// Ref to hold processed options for each setting
const printSpeedOptions = ref([]);
const darknessOptions = ref([]);

// Selected values for each setting
const selectedPrintSpeed = ref("");
const selectedDarkness = ref("");

// Function to process server data
const processOptions = (settings) => {
  return settings.map((opt) => {
    const cleanedValue = opt.replace("*", ""); // Remove "*"
    return {
      value: cleanedValue,
      payload: {
        content: cleanedValue,
      },
    };
  });
};
const [showModal] = useFormModal();

const openPageSetting = async () => {
  const [formRef] = await showModal({
    modalProps: {
      title: "Изменить размер печати принтера",
      width: 700,
      onFinish: async (values) => {
        const height = parseFloat(values.height);
        const width = parseFloat(values.width);

        if (isNaN(height) || isNaN(width)) {
          message.error("Не коректные данные!");
          return;
        }

        const result = { height, width };
        await chagePrinterPapperSize({ ...result, printerSize: "Custom" });
      },
    },
    formProps: {
      schemas: customSizePaper,
      autoSubmitOnEnter: true,
    },
  });
  const infoAboutSticker = await getInfoAboutSticker();
  formRef?.setFieldsValue({
    width: infoAboutSticker.printer_settings_width,
    height: infoAboutSticker.printer_settings_height,
  });
};

onMounted(async () => {
  const response = await getInfoAboutPrinter();

  // Set up each option list after processing server data
  response.forEach((setting) => {
    switch (setting.name_options) {
      case "PrintSpeed/Print Speed":
        printSpeedOptions.value = processOptions(setting.list_settings);
        selectedPrintSpeed.value = printSpeedOptions.value.find(
          (opt) =>
            opt.value ===
            setting.list_settings
              .find((s) => s.includes("*"))
              ?.replace("*", ""),
        ).value;
        break;
      case "Darkness/Darkness":
        darknessOptions.value = processOptions(setting.list_settings);
        selectedDarkness.value = darknessOptions.value.find(
          (opt) =>
            opt.value ===
            setting.list_settings
              .find((s) => s.includes("*"))
              ?.replace("*", ""),
        ).value;
        break;
    }
  });
});
</script>

<style lang="scss">
.printer-setting {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.a-flex {
  height: 100%;
}
</style>
