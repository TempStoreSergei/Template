import AvatarUpload from "../lib/Image.vue";
import type { FormSchema } from "~/shared/core/schema-form/";

export const vpnCreate: FormSchema<any>[] = [
  {
    field: "file",
    component: () => AvatarUpload,
    label: "Image",
  },
  {
    field: "sale",
    rules: [{ required: true }],
    component: "InputNumber",
    label: "Sale",
    colProps: {
      span: 12,
    },
  },
  {
    field: "title",
    component: "Input",
    label: "Title",
    rules: [{ required: true, type: "string" }],
    colProps: {
      span: 12,
    },
  },
  {
    field: "description",
    component: "Input",
    label: "description",
    colProps: {
      span: 12,
    },
  },
  {
    field: "title_pos",
    component: "Select",
    label: "Position",
    rules: [{ required: true, type: "string" }],
    componentProps: {
      request: async () => {
        return [
          { label: "left", value: "left" },
          { label: "right", value: "right" },
          { label: "center", value: "center" },
        ];
      },
    },
  },
];
