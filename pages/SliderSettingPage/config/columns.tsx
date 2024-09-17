import { ref } from "vue";
import type { TableColumn } from "~/shared/core/dynamic-table";
import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request";

// Define the type for your table's list items
export type TableListItem = {
  clientName: string;
  clientConfig: string; // URL to download the configuration
  order: number;
  format_type: string;
  file_path: string;
};

export type TableColumnItem = TableColumn<TableListItem>;

// Configuration for table columns
export const baseColumns: TableColumnItem[] = [
  {
    title: "Очередность",
    dataIndex: "order",
    width: 150,
    customRender({ record }) {
      const order = ref(record.id);
      const tempValue = ref("");

      const updateCategory = async (
        id: number,
        body: any,
        options?: AxiosRequestConfig,
      ) => {
        return await request({
          url: `update_order_by_file/${id}`,
          method: "PUT",
          data: body,
          ...options,
        });
      };

      return (
        <a-typography-paragraph
          content={record.order}
          editable={{
            onChange: (val: string) => (tempValue.value = val),
            onEnd: () =>
              updateCategory(order.value, {
                order: Number(tempValue.value),
              }),
          }}
        >
          <template editableTooltip> Нажми для редактирования</template>
        </a-typography-paragraph>
      );
    },
  },
  {
    title: "Формат",
    dataIndex: "format_type",
    width: 150,
  },
  {
    title: "Файл",
    dataIndex: "file_path",
    width: 150,
    hideInSearch: true,
    customRender: ({ record }) => {
      const isImage = (path: string) => {
        return (
          path.endsWith(".png") ||
          path.endsWith(".jpg") ||
          path.endsWith(".jpeg")
        );
      };

      return isImage(record.file_path) ? (
        <a-image width={164} src={getDataFromServer(record.file_path)} />
      ) : (
        <video style="width: 100%" controls>
          <source src={getDataFromServer(record.file_path)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    },
  },
];
