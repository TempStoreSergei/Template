import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request";

export const getInfo = (options?: AxiosRequestConfig) => {
  return request({
    url: "/system/get_data",
    method: "GET",
    ...options,
  });
};
