/**
 * Component list: Register components here to use them in the form.
 */
import {
  Input,
  Select,
  Radio,
  Checkbox,
  AutoComplete,
  Cascader,
  DatePicker,
  InputNumber,
  Switch,
  TimePicker,
  TreeSelect,
  Tree,
  Slider,
  Rate,
  Divider,
  Upload,
} from "ant-design-vue"; // Importing components from Ant Design Vue
import type { Component, VNodeProps } from "vue"; // Importing types from Vue

// Map of components for easy access in forms
const componentMap = {
  Input,
  InputGroup: Input.Group,
  InputPassword: Input.Password,
  InputSearch: Input.Search,
  InputTextArea: Input.TextArea,
  InputNumber,
  AutoComplete,
  Select,
  TreeSelect,
  Tree,
  Switch,
  RadioGroup: Radio.Group,
  Checkbox,
  CheckboxGroup: Checkbox.Group,
  Cascader,
  Slider,
  Rate,
  DatePicker,
  MonthPicker: DatePicker.MonthPicker,
  RangePicker: DatePicker.RangePicker,
  WeekPicker: DatePicker.WeekPicker,
  TimePicker,
  Upload,
  Divider,
};

// Type to extract prop types from components
type ExtractPropTypes<T extends Component> = T extends new (...args: any) => any
  ? Writable<Omit<InstanceType<T>["$props"], keyof VNodeProps>> // Omit VNodeProps from component props
  : never;

// Type for the component map
type ComponentMapType = typeof componentMap;

// Type representing the keys of componentMap
export type ComponentType = keyof ComponentMapType;

// Mapping each component type to its props
export type ComponentMapProps = {
  [K in ComponentType]: ExtractPropTypes<ComponentMapType[K]>;
};

// Combined props type for all components
export type AllComponentProps = ComponentMapProps[ComponentType];

// Export the component map for use in forms
export { componentMap };
