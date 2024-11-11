import type { TableColumn } from "~/shared/core/dynamic-table";

// Define the type for your table's list items
export type TableListItem = {
  clientName: string;
  clientConfig: string; // URL to download the configuration
};

export type TableColumnItem = TableColumn<TableListItem>;

// Configuration for table columns
export const baseColumns: TableColumnItem[] = [
  {
    title: "Группа блюд",
    dataIndex: "category_name",
    width: 60,
    align: "left",
  },
];

export const searchFormSchema = [
  {
    field: "category_dish_name",
    label: "Группа блюд",
    component: "Input",
    colProps: { span: 24 },
    outerWidth: 300,
  },
];