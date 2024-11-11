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
    title: "Полное название велечины",
    dataIndex: "unit_fullname",
    width: 150,
  },
  {
    title: "Сокращенное название величены",
    dataIndex: "unit_shortname",
    width: 150,
  },
];
