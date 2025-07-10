import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request.ts";

export const getCategoryData = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "categories/get_all_categories",
    method: "GET",
    params: options,
    isReturnResult: false,
  });
};



export const categoryCreate = async (body: any) => {
  return await request({
    url: "categories/create_category",
    method: "POST",
    data: body,
  });
};

export const categoryUpdate = async (
  body: any,
) => {
  return await request({
    url: `categories/update_category_by_id`,
    method: "PUT",
    data: body,
  });
};

export const categoryDelete = async (id: number) => {
  return await request({
    url: `categories/delete_category_by_id`,
    method: "DELETE",
    data: { categoryID: id },
  });
};

export const categoriesDelete = async (
  ids: Array<number>,
) => {
  return await request({
    url: `categories/delete_categories`,
    data: ids,
    method: "DELETE",
  });
};
