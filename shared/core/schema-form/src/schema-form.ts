import { formProps, type FormProps } from "ant-design-vue/es/form";
import type { ColEx } from "./types/component";
import type {
  ExtractPublicPropTypes,
  ComponentInternalInstance,
  CSSProperties,
} from "vue";
import type { FieldMapToTime, FormSchema, RowProps } from "./types/form";
import type { ButtonProps } from "~/shared/basic/button";
import type { TableActionType } from "~/shared/core/dynamic-table";
import { isObject } from "~/shared/utils/is";

export const aFormPropKeys = Object.keys(formProps());

export const schemaFormProps = {
  ...formProps(),
  layout: {
    type: String as PropType<FormProps["layout"]>,
    default: "horizontal",
  },
  /** Default values for pre-set fields */
  initialValues: {
    type: Object as PropType<Recordable>,
    default: () => ({}),
  },
  // Label width, fixed width
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  fieldMapToTime: {
    type: Array as PropType<FieldMapToTime>,
    default: () => [],
  },
  compact: { type: Boolean as PropType<boolean> },
  /** Form configuration rules */
  schemas: {
    type: [Array] as PropType<FormSchema[]>,
    default: () => [],
  },
  mergeDynamicData: {
    type: Object as PropType<Recordable>,
    default: null,
  },
  baseRowStyle: {
    type: Object as PropType<CSSProperties>,
  },
  baseColProps: {
    type: Object as PropType<Partial<ColEx>>,
  },
  autoSetPlaceHolder: { type: Boolean as PropType<boolean>, default: true },
  /** Automatically submit when pressing enter on the input component */
  autoSubmitOnEnter: { type: Boolean as PropType<boolean>, default: false },
  submitOnReset: { type: Boolean as PropType<boolean> },
  submitOnChange: { type: Boolean as PropType<boolean> },
  /** Disable the form */
  disabled: { type: Boolean as PropType<boolean> },
  emptySpan: {
    type: [Number, Object] as PropType<number>,
    default: 0,
  },
  /** Display expand/collapse button */
  showAdvancedButton: { type: Boolean as PropType<boolean> },
  /** Convert time */
  transformDateFunc: {
    type: Function as PropType<Fn>,
    default: (date: any) => {
      return date?.format?.("YYYY-MM-DD HH:mm:ss") ?? date;
    },
  },
  rulesMessageJoinLabel: { type: Boolean as PropType<boolean>, default: true },
  /** Auto-collapse if there are more than 3 rows */
  autoAdvancedLine: {
    type: Number as PropType<number>,
    default: 3,
  },
  /** Number of lines unaffected by collapse */
  alwaysShowLines: {
    type: Number as PropType<number>,
    default: 1,
  },

  /** Show action buttons */
  showActionButtonGroup: { type: Boolean as PropType<boolean>, default: true },
  /** Column configuration for action buttons */
  actionColOptions: Object as PropType<Partial<ColEx>>,
  /** Display reset button */
  showResetButton: { type: Boolean as PropType<boolean>, default: true },
  /** Auto-focus the first input field (only works if the first form item is an input) */
  autoFocusFirstItem: { type: Boolean as PropType<boolean> },
  /** Configuration for reset button */
  resetButtonOptions: Object as PropType<Partial<ButtonProps>>,

  /** Display submit button */
  showSubmitButton: { type: Boolean as PropType<boolean>, default: true },
  /** Configuration for submit button */
  submitButtonOptions: Object as PropType<Partial<ButtonProps>>,

  /** Custom reset function */
  resetFunc: Function as PropType<() => Promise<void>>,
  submitFunc: Function as PropType<() => Promise<void>>,
  /** Dynamic table instance */
  tableInstance: {
    type: Object as PropType<TableActionType>,
  },

  rowProps: Object as PropType<RowProps>,
};

export const schemaFormEmits = {
  register: (exposed: ComponentInternalInstance["exposed"]) =>
    isObject(exposed),
  reset: (formModel: Recordable<any>) => isObject(formModel),
  submit: (formModel: Recordable<any>) => isObject(formModel),
  "advanced-change": () => true,
};

export type SchemaFormEmits = typeof schemaFormEmits;

export type SchemaFormEmitFn = EmitFn<SchemaFormEmits>;

export type SchemaFormProps<T extends object = any> = Partial<
  ExtractPublicPropTypes<Omit<typeof schemaFormProps, "schemas">> & {
    schemas: FormSchema<T>[];
  } & EmitsToProps<SchemaFormEmits>
>;
