import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request";

const endpoints = {
  login: "/login",
};

export const authLogin = async (body: any, options?: AxiosRequestConfig) => {
  try {
    return await request(endpoints.login, {
      method: "POST",
      data: body,
      ...options,
      isReturnResult: false,
    });
  } catch (error: any) {
    throw error;
  }
};
