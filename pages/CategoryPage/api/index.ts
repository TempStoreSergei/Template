import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request.ts";

export const getCategory = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/category/get_all_category",
    method: "GET",
    params: options,
  });
};

export const getLenthOfTable = async () => {
  return await request({
    url: "admin/category/get_groceries_category_len/",
    method: "GET",
  });
};

export const categoryCreate = async (body: any, options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/category/create_category",
    method: "POST",
    data: body,
    ...options,
  });
};

export const categoryUpdate = async (
  id: number,
  body: any,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `admin/category/update_category/${id}`,
    method: "PUT",
    data: body,
    ...options,
  });
};

export const categoryDelete = async (id: number, options?: AxiosRequestConfig) => {
  return await request({
    url: `admin/category/delete_category/${id}`,
    method: "DELETE",
    ...options,
  });
};

export const categoriesDelete = async (
  ids: Array<number>,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `admin/grocery/delete_groceries`,
    data: ids,
    method: "DELETE",
    ...options,
  });
};
