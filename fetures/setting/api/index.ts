import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request.ts";

export const shutDownSystem = async () => {
  return await request({
    url: "admin/completion_work/power_off",
    method: "GET",
  });
};

export const closeApp = async () => {
  return await request({
    url: "admin/completion_work/close_app",
    method: "GET",
  });
};

export const restartSystem = async () => {
  return await request({
    url: "admin/completion_work/restart",
    method: "GET",
  });
};

export const logOut = async () => {
  return await request({
    url: "auth/admin_logout",
    method: "GET",
  });
};
