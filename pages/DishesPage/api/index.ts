import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request";

export const getDishes = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/dish/get_all_dishes",
    method: "GET",
    params: options,
  });
};

export const getLenthOfTable = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/dish/get_dishes_len/",
    method: "GET",
    params: options,
  });
};

export const getDish = async (id: number) => {
  return await request({
    url: `admin/dish/get_dish/${id}`,
    method: "GET",
  });
};

export const dishCreate = async (body: any) => {
  return await request({
    url: "admin/dish/create_dish",
    method: "POST",
    requestType: "form",
    data: body,
  });
};

export const dishUpdate = async (id: number, body: any) => {
  return await request({
    url: `admin/dish/update_dish/${id}`,
    method: "PUT",
    data: body,
  });
};

export const dishDelete = async (id: number) => {
  return await request({
    url: `admin/dish/delete_dish/${id}`,
    method: "DELETE",
  });
};

export const dishRecipeDelete = async (id: number) => {
  return await request({
    url: `admin/dish/delete_recipe/${id}`,
    method: "DELETE",
  });
};

export const dishesDelete = async (ids: Array<number>) => {
  return await request({
    url: `admin/dish/delete_dishes`,
    data: ids,
    method: "DELETE",
  });
};
