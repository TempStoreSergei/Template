import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request";

export const getItemsData = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "items/get_all_items",
    method: "GET",
    params: options,
    isReturnResult: false,
  });
};


export const getItem = async (id: string) => {
  return await request({
    url: `items/get_item_by_id/${id}`,
    method: "GET",
  });
};

export const itemCreate = async (body: any) => {
  return await request({
    url: "items/create_item",
    method: "POST",
    requestType: "form",
    data: body,
  });
};

export const itemUpdate = async (id: string, body: any) => {
  return await request({
    url: `items/update_item_by_id`,
    method: "PUT",
    data: body,
  });
};

export const itemDelete = async (id: string) => {
  return await request({
    url: `items/delete_item`,
    data: { itemID: id },
    method: "DELETE",
  });
};

export const itemRecipeDelete = async (id: string) => {
  return await request({
    url: `items/delete_recipe_by_id`,
    data: { recipeID: id },
    method: "DELETE",
  });
};

export const itemsDelete = async (ids: Array<string>) => {
  return await request({
    url: `items/delete_items`,
    data: ids,
    method: "DELETE",
  });
};
