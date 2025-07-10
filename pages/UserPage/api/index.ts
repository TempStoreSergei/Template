import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request.ts";

export const getUserInfo = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "users/get_all_users",
    method: "GET",
    params: options,
    isReturnResult: false,
  });
};

export const userCreate = async (body: any) => {
  return await request({
    url: "users/create_user",
    method: "POST",
    data: body,
  });
};

export const userUpdate = async (body: any) => {
  return await request({
    url: `users/update_user`,
    method: "PUT",
    data: body,
  });
};

export const userDelete = async (id: number) => {
  return await request({
    url: `users/delete_user`,
    method: "DELETE",
    data: { userID: id },
  });
};

export const usersDelete = async (
  ids: Array<number>,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `admin/users/delete_users`,
    data: ids,
    method: "DELETE",
    ...options,
  });
};
