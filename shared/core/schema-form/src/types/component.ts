import type { CSSProperties, WatchOptions } from "vue";
import type { RenderCallbackParams } from "./form";
import type { ComponentMapProps, ComponentType } from "../componentMap";

// Exporting ComponentType for use in other modules
export type { ComponentType };

type ColSpanType = number | string;

/**
 * Configuration for asynchronous component requests.
 */
type RequestConfig =
  | PromiseFn<RenderCallbackParams, any>
  | {
      /**
       * Fields to watch; when any of these change, the callback will be invoked.
       */
      watchFields: string[];
      /**
       * Callback to be invoked on field changes.
       */
      callback: PromiseFn<RenderCallbackParams, any>;
      /**
       * Options for the watcher.
       */
      options?: WatchOptions;
      /**
       * Debounce duration for the request, in milliseconds.
       */
      wait?: number;
    };

/**
 * Component properties.
 */
export type ComponentProps<T extends ComponentType = ComponentType> =
  ComponentMapProps[T] & {
    /**
     * Configuration for asynchronous data requests.
     */
    request?: RequestConfig;
    /**
     * Result of the asynchronous request.
     */
    requestResult?: any;
    /**
     * Additional CSS styles for the component.
     */
    style?: CSSProperties;
    /**
     * Custom key for v-model binding.
     */
    vModelKey?: string;
    /**
     * Additional properties.
     */
    [key: string]: any;
  };

/**
 * Extended column properties for layout configuration.
 */
export interface ColEx {
  /**
   * Custom styles for the column.
   */
  style?: any;

  /**
   * Number of grid columns the component occupies; 0 means it won't be displayed.
   * @default 0
   */
  span?: ColSpanType;

  /**
   * Order of the column in a flex layout.
   * @default 0
   */
  order?: ColSpanType;

  /**
   * Flex-grow value for the column.
   * @default 'none'
   */
  flex?: ColSpanType;

  /**
   * Number of columns to offset the column from the left.
   * @default 0
   */
  offset?: ColSpanType;

  /**
   * Number of columns the raster is pushed to the right.
   * @default 0
   */
  push?: ColSpanType;

  /**
   * Number of columns the raster is pulled to the left.
   * @default 0
   */
  pull?: ColSpanType;

  /**
   * Responsive settings for <576px; can be a span value or an object.
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xs?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * Responsive settings for ≥576px; can be a span value or an object.
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  sm?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * Responsive settings for ≥768px; can be a span value or an object.
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  md?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * Responsive settings for ≥992px; can be a span value or an object.
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  lg?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * Responsive settings for ≥1200px; can be a span value or an object.
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * Responsive settings for ≥1600px; can be a span value or an object.
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xxl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;
}
