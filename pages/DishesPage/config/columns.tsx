import { useRouter } from "vue-router";
import { Tag, Image, Button, Typography } from "ant-design-vue";
import { itemRecipeDelete } from "../api";
import { getCategoryData } from "~/pages/CategoryPage";
import type { TableColumn } from "~/shared/core/dynamic-table";

// Define the type for your table's list items
export type TableListItem = {
  dish_name: string;
  dish_recipe: boolean;
  dish_img: string;
  dish_groceries_amount: number;
  dish_life_time: number;
  id: number;
};

export type TableColumnItem = TableColumn<TableListItem>;

const getCountDeclension = (amount: number): string => {
  if (amount < 0) {
    throw new Error("Amount cannot be negative.");
  }

  const declensions = ["ингредиент", "ингредиента", "ингредиентов"]; // singular, genitive singular, genitive plural

  const lastDigit = amount % 10;
  const lastTwoDigits = amount % 100;

  // Determine the correct form based on the rules of Russian grammar
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${amount} ${declensions[0]}`; // 1 ingredient
  } else if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  ) {
    return `${amount} ${declensions[1]}`; // 2-4 ingredients
  } else {
    return `${amount} ${declensions[2]}`; // 0, 5-20, 21, 25, etc. ingredients
  }
};

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
    title: "Название блюда",
    dataIndex: "dish_name",
    width: 200,
  },
  {
    title: "Рецепт блюда",
    hideInSearch: true,
    dataIndex: "dish_recipe",
    width: 200,
    customRender: ({ record }) => {
      const router = useRouter();
      const textButton = record.dish_recipe ? "Изменить" : "Добавить";

      return (
        <div>
          <Button
            type={"link"}
            onClick={() => {
              router.push(`/edit/${record.id}`);
            }}
          >
            {textButton}
          </Button>
          {record.dish_recipe && (
            <Button
              type="link"
              danger
              onClick={() => {
                itemRecipeDelete(record.id);
              }}
            >
              Удалить
            </Button>
          )}
        </div>
      );
    },
  },
  {
    title: "Срок годности",
    hideInSearch: true,
    dataIndex: "itemLifeTime",
    width: 200,
    customRender: ({ record }) => {
      return (
        <Tag>
          {`${record.dish_life_time} ${getHourDeclension(record.dish_life_time)}`}
        </Tag>
      );
    },
  },
  {
    title: "Группа заготовок",
    dataIndex: "category_id_name",
    width: 200,
    customRender: ({ record }) => {
      return <Typography>{record.category_id_name}</Typography>;
    },
  },
  {
    title: "Кол-во ингредиентов",
    hideInSearch: true,
    dataIndex: "dish_grceries_amount",
    width: 200,
    customRender: ({ record }) => {
      return <Tag>{getCountDeclension(record.dish_groceries_amount)}</Tag>;
    },
  },
  {
    title: "Вид готового блюда",
    dataIndex: "dish_img",
    hideInSearch: true,
    width: 200,
    customRender: ({ record }) => {
      const imageUrl = getDataFromServer(record.dish_img);

      return (
        <Image
          src={imageUrl}
          width={120}
          height={120}
          alt="Dish Image"
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
        />
      );
    },
  },
];

export const searchFormSchemas: FormSchema[] = [
  {
    field: "dish_name",
    label: "Название блюда",
    component: "Input",
    colProps: { span: 24 },
    outerWidth: 300,
  },
  {
    field: "category_id",
    label: "Группа блюд",
    component: "Select",
    colProps: { span: 24 },
    componentProps: {
      request: async () => {
        const { categoriesData: categories } = await getCategoryData();
        return categories.map((category) => ({
          label: category.categoryName,
          value: category.id,
        }));
      },
    },
  },
];
