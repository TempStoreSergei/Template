import type { TableActionType } from "~/shared/core/dynamic-table"; // Importing TableActionType from the dynamic-table module
import type { UnwrapFormSchema } from "./types"; // Importing the UnwrapFormSchema type from the local types module

/**
 * @description: Defines the props for a schema form item.
 */
export const schemaFormItemProps = {
  /**
   * The model representing the form's data.
   * @type {Record<string, any>}
   * @default {}
   */
  formModel: {
    type: Object as PropType<Record<string, any>>, // Expecting an object for form model
    default: () => ({}), // Default to an empty object
  },

  /**
   * The schema that defines the structure and validation of the form.
   * @type {UnwrapFormSchema}
   * @default {}
   */
  schema: {
    type: Object as PropType<UnwrapFormSchema>, // Expecting a schema object
    default: () => ({}), // Default to an empty object
  },

  /**
   * The instance of the dynamic table for additional operations.
   * @type {TableActionType}
   */
  tableInstance: {
    type: Object as PropType<TableActionType>, // Expecting an instance of the dynamic table actions
  },

  /**
   * The key used for identifying rows in the dynamic table.
   * @type {Key}
   */
  tableRowKey: {
    type: [String, Number] as PropType<Key>, // Expecting a string or number for row key
  },
};

/**
 * Type definition for the props of the SchemaFormItem component.
 * @type {typeof schemaFormItemProps}
 */
export type SchemaFormItemProps = typeof schemaFormItemProps; // Creating a type from the props definition
