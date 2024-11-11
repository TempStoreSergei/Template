import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request.ts";

export const getCategory = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/dish/get_all_dishes_category/",
    method: "GET",
    params: options,
  });
};

export const getLenthOfTable = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/category/get_groceries_category_len/",
    method: "GET",
    params: options,
  });
};

export const getAllCategory = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/dish/get_dishes_category/",
    method: "GET",
    params: options,
  });
};

export const getTableCategoryInfo = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/dish/get_dishes_category_len/",
    method: "GET",
    params: options,
  });
};

export const categoryCreate = async (body: any, options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/dish/create_dish_category/",
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
    url: `admin/dishes/update_category/${id}`,
    method: "PUT",
    data: body,
    ...options,
  });
};

export const categoryDelete = async (id: number, options?: AxiosRequestConfig) => {
  return await request({
    url: `admin/dish/delete_category/${id}`,
    method: "DELETE",
    ...options,
  });
};

export const categoriesDelete = async (
  ids: Array<number>,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `admin/dishes/delete_categories`,
    data: ids,
    method: "DELETE",
    ...options,
  });
};
