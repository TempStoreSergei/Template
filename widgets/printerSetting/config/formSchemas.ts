import { ref, computed } from "vue";
import { getInfoAboutSticker } from "../api";
import type { FormSchema } from "~/shared/core/schema-form/";

const stikerInfo = ref({});

const getInfoFromServer = async () => {
  stikerInfo.value = await getInfoAboutSticker();
};

getInfoFromServer();

// Reactive default values
const defaultWidth = computed(
  () => stikerInfo.value.printer_settings_width ?? 0,
);
const defaultHeight = computed(
  () => stikerInfo.value.printer_settings_height ?? 0,
);

export const customSizePaper: FormSchema<any>[] = [
  {
    field: "width",
    component: "Input",
    label: "Ширина",
    rules: [{ required: true }],
    colProps: {
      span: 24,
    },
    componentProps: {
      type: "text",
      id: "calculatorPoint",
      defaultValue: defaultWidth, // Bind computed property here
    },
  },
  {
    field: "height",
    component: "Input",
    label: "Высота",
    rules: [{ required: true }],
    colProps: {
      span: 24,
    },
    componentProps: {
      type: "text",
      id: "calculatorPoint",
      defaultValue: defaultHeight, // Bind computed property here
    },
  },
];
