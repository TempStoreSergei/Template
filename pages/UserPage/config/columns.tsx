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
    title: "Фамилия",
    dataIndex: "userSurname",
    width: 30,
  },
  {
    title: "Имя",
    dataIndex: "userFullname",
    width: 30,
  },
  {
    title: "Отчество",
    dataIndex: "userPatronymic",
    width: 30,
  },
];

export const searchFormSchema = [
  {
    field: "user_surname",
    label: "Фамилия",
    component: "Input",
    colProps: { span: 24 },
    outerWidth: 300,
  },
  {
    field: "user_first_name",
    label: "Имя",
    component: "Input",
    colProps: { span: 24 },
    outerWidth: 300,
  },
  {
    field: "user_patronymic",
    label: "Отчество",
    component: "Input",
    colProps: { span: 24 },
    outerWidth: 300,
  },
];

