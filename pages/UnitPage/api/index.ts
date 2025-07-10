import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request.ts";

export const getUnitsData = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "units/get_all_units",
    method: "GET",
    params: options,
    isReturnResult: false,
  });
};

export const unitCreate = async (body: any) => {
  return await request({
    url: "units/create_unit",
    method: "POST",
    data: body,
  });
};

export const unitUpdate = async (
  body: any,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `units/update_unit`,
    method: "PUT",
    data: body,
    ...options,
  });
};

export const unitDelete = async (id: number) => {
  return await request({
    url: `units/delete_unit`,
    method: "DELETE",
    data: { unitID: id },
  });
};

export const unitsDelete = async (
  ids: Array<number>,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `units/delete_units`,
    data: ids,
    method: "DELETE",
    ...options,
  });
};
