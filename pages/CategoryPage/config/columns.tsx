import type { TableColumn } from "~/shared/core/dynamic-table";
import { Tag } from "ant-design-vue";

// Define the type for your table's list items
export type TableListItem = {
  clientName: string;
  categoryExpirationDate: number;
  categoryShortname: string;
  clientConfig: string; // URL to download the configuration
};

export type TableColumnItem = TableColumn<TableListItem>;

const getHourDeclension = (hours: number): string => {
  const lastDigit = hours % 10;
  const lastTwoDigits = hours % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "часов";
  }

  switch (lastDigit) {
    case 1:
      return "час";
    case 2:
    case 3:
    case 4:
      return "часа";
    default:
      return "часов";
  }
};
// Configuration for table columns
export const baseColumns: TableColumnItem[] = [
  {
    title: "Группа заготовок",
    dataIndex: "categoryName",
    width: 60,
    align: "left",
  },
  {
    title: "Короткое название",
    dataIndex: "categoryShortname",
    width: 60,
    align: "left",
  },
  {
    title: "Срок годности",
    hideInSearch: true,
    dataIndex: "categoryExpirationDate",
    width: 200,
    customRender: ({ record }) => {
      return (
        <Tag>
          {`${record.categoryExpirationDate} ${getHourDeclension(record.categoryExpirationDate)}`}
        </Tag>
      );
    },
  },
];

export const searchFormSchema = [
  {
    field: "categoryName",
    label: "Группа заготовок",
    component: "Input",
    colProps: { span: 24 },
    outerWidth: 300,
  },
];
