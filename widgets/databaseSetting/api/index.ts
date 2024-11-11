import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request";

export const deleteDataBase = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/settings/clear_database/",
    method: "DELETE",
    ...options,
  });
};

export const updateContent = async (info: any) => {
  return await request({
    url: "admin/settings/update_database/",
    method: "PUT",
    requestType: "form",
    data: info,
  });
};


export const checkFormat = async (info: any) => {
  return await request({
    url: "/admin/settings/check_update_database_file/",
    method: "PUT",
    requestType: "form",
    data: info,
  });
};