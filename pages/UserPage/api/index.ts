import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request.ts";

export const getUser = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/users/get_all_users",
    method: "GET",
    params: options,
  });
};

export const getLenthOfTable = async (options?: AxiosRequestConfig) => {
  return await request({
    url: "admin/users/get_users_len/",
    method: "GET",
    params: options,
  });
};

export const userCreate = async (body: any) => {
  return await request({
    url: "admin/users/create_user",
    method: "POST",
    data: body,
  });
};

export const userUpdate = async (id: number, body: any) => {
  return await request({
    url: `admin/users/update_user/${id}`,
    method: "PUT",
    data: body,
  });
};

export const userDelete = async (id: number) => {
  return await request({
    url: `admin/users/delete_user/${id}`,
    method: "DELETE",
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
