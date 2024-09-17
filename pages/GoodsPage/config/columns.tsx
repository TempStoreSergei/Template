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
    title: "Название",
    dataIndex: "title",
    width: 150,
  },
  {
    title: "Описание",
    dataIndex: "description",
    width: 150,
  },
  {
    title: "Цена",
    dataIndex: "price",
    width: 150,
  },
  {
    title: "Скидка (%)",
    dataIndex: "sale",
    width: 150,
  },
  {
    title: "Цвет карточки",
    dataIndex: "main_color",
    width: 150,
  },
];
