import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request.ts";

export const getCategory = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "/system/get_category",
    method: "GET",
    ...options,
  });
};

export const creteVPNConfig = async (
  body: any,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: "system/create_category",
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
    url: `system/update_category/${id}`,
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
    url: `system/delete_category/${id}`,
    method: "DELETE",
    ...options,
  });
};
