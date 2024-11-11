import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request.ts";

export const getGroceries = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/grocery/get_all_groceries/",
    method: "GET",
    params: options,
  });
};

export const getLenthOfTable = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/grocery/get_groceries_len",
    method: "GET",
    params: options,
  });
};

export const grocerieCreate = async (body: any) => {
  return await request({
    url: "admin/grocery/create_grocery",
    method: "POST",
    data: body,
    requestType: "form",
  });
};

export const grocerieUpdate = async (id: number, body: any) => {
  return await request({
    url: `admin/grocery/update_grocery/${id}`,
    method: "PUT",
    data: body,
    requestType: "form",
  });
};

export const grocerieInStokUpdate = async (
  id: number,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `admin/grocery/update_grocery_in_stock/${id}`,
    method: "PUT",
    ...options,
  });
};

export const grocerieDelete = async (
  id: number,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `admin/grocery/delete_grocery/${id}`,
    method: "DELETE",
    ...options,
  });
};

export const groceriesDelete = async (
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
