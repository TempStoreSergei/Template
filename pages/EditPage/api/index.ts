import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request";

export const getRecipe = async (id: number, options?: AxiosRequestConfig) => {
  return await request({
    url: `admin/dish/get_dish_recipe/${id}`,
    method: "GET",
    ...options,
  });
};

export const saveRecipe = async (
  id: number,
  body: any,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `admin/dish/update_dish_recipe/${id}`,
    method: "PUT",
    data: body,
    ...options,
  });
};
