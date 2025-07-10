import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request";

const endpoints = {
  login: "auth/admin_auth",
};

export const authLogin = async (body: any) => {
  try {
    return await request(endpoints.login, {
      method: "POST",
      data: body,
      isReturnResult: false,
    });
  } catch (error: any) {
    throw error;
  }
};
