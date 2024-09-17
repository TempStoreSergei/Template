import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request.ts";

export const getSliders = async (options?: AxiosRequestConfig) => {
  const responce = await request({
    url: "get_welcome_screen",
    method: "GET",
    ...options,
  });
  return responce.welcomeScreenContent;
};

export const getSlidersConfig = async (options?: AxiosRequestConfig) => {
  const responce = await request({
    url: "get_welcome_screen",
    method: "GET",
    ...options,
  });
  return responce.welcomeScreenContent;
};

export const changeSliderSetting = async (
  body: any,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: "update_welcome_screen",
    method: "PUT",
    data: body,
    ...options,
  });
};

export const creteSlide = async (body: any, options?: AxiosRequestConfig) => {
  return await request({
    url: "create_files_for_welcome_screen",
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

export const removeSlide = async (
  id: number,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: `delete_file_for_welcome_screen/${id}`,
    method: "DELETE",
    ...options,
  });
};
