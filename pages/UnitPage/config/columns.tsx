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
    dataIndex: "unitFullname",
    width: 150,
  },
  {
    title: "Сокращенное название величины",
    dataIndex: "unitShortname",
    width: 150,
  },
];

export const searchFormSchema = [
  {
    field: "unitFullname",
    label: "Полное название величины",
    component: "Input",
    colProps: { span: 24 },
    outerWidth: 300,
  },
  {
    field: "unitShortname",
    label: "Сокращенное название величины",
    component: "Input",
    colProps: { span: 24 },
    outerWidth: 300,
  },
];
