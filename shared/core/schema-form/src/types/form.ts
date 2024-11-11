import type { RowProps } from "ant-design-vue";
import type { RuleObject } from "ant-design-vue/es/form/interface";
import type { FormItemProps } from "ant-design-vue/es/form/FormItem";
import type { Component, ComputedRef, UnwrapRef, VNode } from "vue";
import type { ButtonProps as AntdButtonProps } from "~/shared/basic/button";
import type { ColEx, ComponentType, ComponentProps } from "./component";
import type { SchemaFormType } from "../hooks";
import type { TableActionType } from "~/shared/core/dynamic-table";

// Exporting RowProps for use in other modules
export type { RowProps };

// Mapping field names to their types and optional descriptions
export type FieldMapToTime = [string, [string, string], string?][];

// Extended rule type with custom triggers
export type Rule = RuleObject & {
  trigger?: "blur" | "change" | ["change", "blur"];
};

/**
 * Extract all field names excluding symbols and numbers.
 */
export type GetFieldKeys<T> = Exclude<keyof T, symbol | number>;

/**
 * Parameters for rendering callbacks in forms.
 */
export interface RenderCallbackParams<
  T extends object = Recordable,
  P extends ComponentProps = ComponentProps,
> {
  schema: ComputedRef<
    FormSchema<T> & {
      componentProps: P;
    }
  >;
  /** Reactive form data object */
  formModel: Objectable<T>;
  field: GetFieldKeys<T>;
  /** Non-reactive form data object (final data for submission) */
  values: any;
  /** Dynamic form instance */
  formInstance: SchemaFormType;
  /** Dynamic table instance, optional */
  tableInstance?: TableActionType;
  /** Row key for the dynamic table, optional */
  tableRowKey?: Key;
  /** Scoped slot data */
  slotData?: Recordable;
}

/**
 * Custom VNode renderer function type.
 */
export type CustomRenderFn<T extends object = Recordable> = (
  renderCallbackParams: RenderCallbackParams<T>,
) => VNode | VNode[] | string;

/**
 * Properties for button components, extending AntdButtonProps.
 */
export interface ButtonProps extends AntdButtonProps {
  text?: string;
}

/**
 * Unwraps a FormSchema type.
 */
export type UnwrapFormSchema<T extends object = Recordable> = UnwrapRef<
  FormSchema<T>
>;

/**
 * Schema definition for form components.
 */
type ComponentSchema<T extends object = Recordable> =
  | {
      [K in ComponentType]: {
        /** Associated form component, e.g., Input */
        component: K;
        /** Component properties */
        componentProps?:
          | ComponentProps<K>
          | ((
              opt: RenderCallbackParams<T, ComponentProps<K>>,
            ) => ComponentProps<K>);
      };
    }[ComponentType]
  | {
      /** Custom renderer function or component */
      component:
        | CustomRenderFn<T>
        | ((opt: RenderCallbackParams<T>) => Component);
      componentProps?:
        | ComponentProps
        | ((opt: RenderCallbackParams<T>) => ComponentProps);
    };

/**
 * Definition for form schema items.
 */
export type FormSchema<T extends object = Recordable> = ComponentSchema<T> & {
  /** Field name */
  field: GetFieldKeys<T>;

  /** Event name triggered by internal value changes; defaults to 'change' */
  changeEvent?: string;

  /** Name of the variable bound to v-model; default value */
  valueField?: string;

  /** Label text or a function to derive label text */
  label?: string | ((v: RenderCallbackParams<T>) => string);

  /** Auxiliary text displayed alongside the label */
  subLabel?: string;

  /** Help text, either as a string/array or as a function */
  helpMessage?:
    | string
    | string[]
    | ((params: RenderCallbackParams<T>) => string | string[]);

  /** Props for help component */
  helpComponentProps?: Partial<HelpComponentProps>;

  /** Fixed label width; overrides labelCol and wrapperCol */
  labelWidth?: string | number;

  /** Prevent label width adjustments from global settings */
  disabledLabelWidth?: boolean;

  /** Component slots; can be functions or static objects */
  componentSlots?:
    | ((params: RenderCallbackParams<T>) => Recordable<CustomRenderFn<T>>)
    | Recordable<CustomRenderFn<T>>
    | ReturnType<CustomRenderFn>;

  /** Indicates if the field is required */
  required?: boolean | ((params: RenderCallbackParams<T>) => boolean);

  /** Suffix text or value */
  suffix?:
    | string
    | number
    | ((values: RenderCallbackParams<T>) => string | number);

  /** Validation rules for the field */
  rules?: Rule[];

  /** Join rules messages with the label */
  rulesMessageJoinLabel?: boolean;

  /** Loading state of the component */
  loading?: boolean;

  /** Reference to FormItem props */
  formItemProps?: Partial<FormItemProps>;

  /** Column configuration outside FormItem */
  colProps?: Partial<ColEx>;

  /** Order for sorting form items */
  order?: number;

  /** Default value for the field */
  defaultValue?: any;

  /** Indicator if the item is part of an advanced search */
  isAdvanced?: boolean;

  /** Column span for layout */
  span?: number;

  /** Condition to show the component (similar to v-show) */
  vShow?: boolean | ((params: RenderCallbackParams<T>) => any);

  /** Condition to include the component (similar to v-if) */
  vIf?: boolean | ((params: RenderCallbackParams<T>) => any);

  /** Value transformation function */
  transform?: (value: any) => any;

  /** Rendered content of the column, wrapped in FormItem */
  renderColContent?: CustomRenderFn<T>;

  /** Custom slot name for FormItem */
  slot?: string;

  /** Prepend slot for the form component */
  beforeSlot?: string | ((params: RenderCallbackParams<T>) => any);

  /** Append slot for the form component */
  afterSlot?: string | ((params: RenderCallbackParams<T>) => any);

  /** Custom column slot, similar to renderColContent */
  colSlot?: string;

  /** Dynamically disable the field */
  dynamicDisabled?: boolean | ((params: RenderCallbackParams<T>) => boolean);

  /** Dynamic validation rules */
  dynamicRules?: (params: RenderCallbackParams<T>) => Rule[];
};

/**
 * Props for help components in the form.
 */
export interface HelpComponentProps {
  maxWidth: string;
  /** Indicates whether to show index */
  showIndex: boolean;
  /** List of help text */
  text: any;
  /** Color of the help text */
  color: string;
  /** Font size of the help text */
  fontSize: string;
  /** Icon displayed in the help component */
  icon: string;
  /** Absolute positioning of the help text */
  absolute: boolean;
  /** Positioning of the help text */
  position: any;
}
