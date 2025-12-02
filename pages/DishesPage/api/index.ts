import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request";

/**
 * Получение всех элементов (блюд и категорий)
 */
export const getItemsData = async (params?: AxiosRequestConfig['params']) => {
  return request({
    url: "items/get_all_items",
    method: "GET",
    params: params,
    isReturnResult: false,
  });
};

/**
 * Получение информации о конкретном блюде по ID
 */
export const getItem = async (id: string) => {
  return request({
    url: `items/get_item_by_id/${id}`,
    method: "GET",
  });
};

/**
 * Создание нового блюда
 * @param body - FormData с данными нового блюда
 */
export const itemCreate = async (body: FormData) => {
  return request({
    url: "items/create_item",
    method: "POST",
    data: body,
    requestType: "form", // Указываем, что это multipart/form-data
  });
};

/**
 * Обновление блюда по ID
 * @param body - FormData с обновленными данными и itemID
 */
export const itemUpdate = async (body: FormData) => {
  return request({
    url: `items/update_item_by_id`,
    method: "PUT",
    data: body,
    requestType: "form",
  });
};

/**
 * Удаление одного блюда по ID
 */
export const itemDelete = async (id: string) => {
  return request({
    url: `items/delete_item`,
    method: "DELETE",
    data: { itemID: id }, // Для DELETE запросов тело обычно передается так
  });
};

/**
 * Удаление рецепта по ID
 */
export const itemRecipeDelete = async (id: string) => {
  return request({
    url: `items/delete_recipe_by_id`,
    method: "DELETE",
    data: { recipeID: id },
  });
};

/**
 * Массовое удаление блюд по массиву ID
 */
export const itemsDelete = async (ids: Array<string>) => {
  return request({
    url: `items/delete_items`,
    method: "DELETE",
    data: { itemIDs: ids },
  });
};