import type { Ref } from "vue";
import type { CustomRenderParams } from "./column";
import type { PopconfirmProps } from "ant-design-vue/es/popconfirm";
import type { ButtonProps, TooltipProps } from "ant-design-vue/es/components";
import type { TableMethods, UseEditableType } from "../hooks/";
import type { ButtonType } from "~/shared/basic/button";

// Define the structure for an action item, which is used to represent buttons with various properties.
export type ActionItem = Omit<ButtonProps, "onClick" | "loading" | "type"> & {
  // Function to be called when the button is clicked, with parameters for custom rendering.
  onClick?: Fn<CustomRenderParams, any>;

  // Label text for the button.
  label?: string;

  // Color of the button.
  color?: string;

  // Type of button, which is an enum or predefined type.
  type?: ButtonType;

  // Loading state of the button, can be reactive.
  loading?: Ref<ButtonProps["loading"]> | ButtonProps["loading"];

  // Icon to be displayed on the button.
  icon?: string;

  // Configuration for pop-up confirmation dialogs.
  popConfirm?: PopConfirm;

  // Whether the button is disabled.
  disabled?: boolean;

  // If true, a divider will be shown after the button.
  divider?: boolean;

  // Controls the visibility based on roles or permissions.
  // auth?: RoleEnum | RoleEnum[] | string | string[];

  // Controls the visibility based on business logic.
  ifShow?: boolean | ((action: ActionItem) => boolean);

  // Tooltip text or configuration for the button.
  tooltip?: string | TooltipProps;

  /** Setting button permissions, defaults to disabling if `effect` is not provided. */
};

// Define the structure for a pop-up confirmation dialog (PopConfirm).
export type PopConfirm = PopconfirmProps & {
  // Title of the pop-up confirmation.
  title: string;

  // Text for the confirmation button.
  okText?: string;

  // Text for the cancel button.
  cancelText?: string;

  // Function to be called when the confirmation button is clicked.
  onConfirm: Fn<CustomRenderParams, any>;

  // Function to be called when the cancel button is clicked.
  onCancel?: Fn<CustomRenderParams, any>;

  // Icon to be displayed in the pop-up confirmation.
  icon?: string;

  // Placement of the pop-up confirmation relative to the button.
  placement?:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom"
    | "bottomLeft"
    | "bottomRight";
};

// Define the structure for the table actions, including various methods related to table operations.
export type TableActionType = {
  /** Reload the table and reset the page number, excluding the search form. */
  reload: TableMethods["reload"];

  /** Set dynamic properties of the table. */
  setProps: TableMethods["setProps"];

  /** Fetch remote data for the table. */
  fetchData: TableMethods["fetchData"];

  /** Enter the editable state for a row. */
  startEditable: UseEditableType["startEditable"];

  /** Cancel the editable state for a row. */
  cancelEditable: UseEditableType["cancelEditable"];

  /** Get the form model values after editing. */
  getEditFormModel: UseEditableType["getEditFormModel"];

  /** Check if the current row is in an editable state. */
  isEditable: UseEditableType["isEditable"];

  /** Validate the row's editable form. */
  validateRow: UseEditableType["validateRow"];
};
