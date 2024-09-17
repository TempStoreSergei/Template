import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request";

export const getCategory = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "/system/get_goods",
    method: "GET",
    ...options,
  });
};

export const creteVPNConfig = async (
  body: any,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: "system/create_good",
    method: "POST",
    requestType: "form",
    data: body,
    ...options,
  });
};

export const updateCategory = async (
  id: number,
  body: any,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `system/update_good/${id}`,
    method: "PUT",
    requestType: "form",
    data: body,
    ...options,
  });
};

export const removeVPNConfig = async (
  id: number,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `system/delete_good/${id}`,
    method: "DELETE",
    ...options,
  });
};
