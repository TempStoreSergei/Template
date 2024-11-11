import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request.ts";

export const getUnits = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/unit/get_all_units",
    method: "GET",
    params: options,
  });
};

export const getLenthOfTable = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/unit/get_units_len",
    method: "GET",
    params: options,
  });
};

export const unitCreate = async (body: any, options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/unit/create_unit",
    method: "POST",
    data: body,
    ...options,
  });
};

export const unitUpdate = async (
  id: number,
  body: any,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `admin/unit/update_unit/${id}`,
    method: "PUT",
    data: body,
    ...options,
  });
};

export const unitDelete = async (id: number, options?: AxiosRequestConfig) => {
  return await request({
    url: `admin/unit/delete_unit/${id}`,
    method: "DELETE",
    ...options,
  });
};

export const unitsDelete = async (
  ids: Array<number>,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `admin/unit/delete_units`,
    data: ids,
    method: "DELETE",
    ...options,
  });
};
