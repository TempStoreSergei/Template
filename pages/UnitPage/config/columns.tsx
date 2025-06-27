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
    title: "Полное название величины",
    dataIndex: "unit_fullname",
    width: 150,
  },
  {
    title: "Сокращенное название величины",
    dataIndex: "unit_shortname",
    width: 150,
  },
];

export const searchFormSchema = [
  {
    field: "unit_fullname",
    label: "Полное название величины",
    component: "Input",
    colProps: { span: 24 },
    outerWidth: 300,
  },
  {
    field: "unit_shortname",
    label: "Сокращенное название величины",
    component: "Input",
    colProps: { span: 24 },
    outerWidth: 300,
  },
];
