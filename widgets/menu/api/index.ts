import { request } from "~/shared/api/request";

const endpoints = {
  menu: "admin/get_admin_menu",
};

export const getMenu = async (options?: any) => {
  try {
    return await request(endpoints.menu, {
      method: "Get",
      ...options,
    });
  } catch (error: any) {
    throw error;
  }
};
