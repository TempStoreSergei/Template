import { request } from "~/shared/api/request";

export const getCategoriesHierarchy = () => {
  return request({
    url: "categories/get_all_categories_hierarchy",
    method: "GET",
    dataName: "categoriesData",
  });
};

export const findItems = (searchData: string) => {
  return request({
    url: "search/search_categories_and_items",
    method: "GET",
    params: {
      searchData,
    },
    isReturnResult: false, // Возвращаем полный ответ с categoriesData и itemsData
  });
};
