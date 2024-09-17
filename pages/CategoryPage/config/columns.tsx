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
    title: "Position",
    dataIndex: "title_pos",
    width: 150,
  },
  {
    title: "Title",
    dataIndex: "title",
    width: 150,
  },
  {
    title: "description",
    dataIndex: "description",
    width: 150,
  },
];
