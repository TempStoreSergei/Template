import dayjs from "dayjs";
import type { RuleObject } from "ant-design-vue/es/form/";
import type { ComponentType } from "./types/component";
import { isNumber } from "~/shared/utils/is";
import { useI18n } from "~/hooks/useI18n";

/**
 * @description Generates a placeholder message based on the component type.
 * @param {ComponentType} component - The type of the component.
 * @param {string} [label=''] - Optional label to append to the placeholder message.
 * @returns {string} - The generated placeholder message.
 */
export function createPlaceholderMessage(component: ComponentType, label = "") {
  const { t } = useI18n();

  // Check if the component is an input type
  if (component.includes("Input") || component.includes("Complete")) {
    return `Введите ${label}`;
  }

  // Define types of components that require a "choose" placeholder
  const chooseTypes: ComponentType[] = [
    "Select",
    "Cascader",
    "Checkbox",
    "CheckboxGroup",
    "Switch",
    "TreeSelect",
  ];

  // Check if the component is a picker or belongs to the chooseTypes array
  if (component.includes("Picker") || chooseTypes.includes(component)) {
    return `Выберите ${label}`;
  }

  // Default return value for unsupported component types
  return "";
}

// List of date picker types
const DATE_TYPE = ["DatePicker", "MonthPicker", "WeekPicker", "TimePicker"];

// Function to generate an array of date-related component types
function genType() {
  return [...DATE_TYPE, "RangePicker"];
}

/**
 * @description Sets the validation rule type for the given component.
 * @param {RuleObject} rule - The rule object to modify.
 * @param {ComponentType} component - The type of the component.
 * @param {string} valueFormat - The format of the value.
 */
export function setComponentRuleType(
  rule: RuleObject,
  component: ComponentType,
  valueFormat: string,
) {
  // Set the rule type based on the component type
  if (
    ["DatePicker", "MonthPicker", "WeekPicker", "TimePicker"].includes(
      component,
    )
  ) {
    rule.type = valueFormat ? "string" : "object";
  } else if (
    ["RangePicker", "Upload", "CheckboxGroup", "TimePicker"].includes(component)
  ) {
    rule.type = "array";
  } else if (["InputNumber"].includes(component)) {
    rule.type = "number";
  }
}

/**
 * @description Processes the date value based on the component type and attributes.
 * @param {Recordable} attr - The attributes of the component.
 * @param {string} component - The type of the component.
 */
export function processDateValue(attr: Recordable, component: string) {
  const { valueFormat, value } = attr;
  if (valueFormat) {
    // Format the value based on the provided valueFormat
    // attr.value = isObject(value) ? dayjs(value).format(valueFormat) : value;
  } else if (DATE_TYPE.includes(component) && value) {
    // Convert the value to a dayjs object for date types
    attr.value = dayjs(attr.value);
  }
}

/**
 * @description Handles the input number value conversion based on the component type.
 * @param {ComponentType} [component] - The type of the component (optional).
 * @param {any} [val] - The value to convert (optional).
 * @returns {any} - The processed value.
 */
export function handleInputNumberValue(component?: ComponentType, val?: any) {
  if (!component) return val;

  // Convert numerical values to strings for certain input types
  if (
    ["Input", "InputPassword", "InputSearch", "InputTextArea"].includes(
      component,
    )
  ) {
    return val && isNumber(val) ? `${val}` : val;
  }

  return val;
}

/**
 * Array of date item types generated from the genType function.
 */
export const dateItemType = genType();
