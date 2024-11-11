import { request } from "~/shared/api/request";

export const getTerminalName = async () => {
  return await request({
    url: "admin/settings/get_terminal_name/",
    method: "GET",
  });
};

export const changeTerminalName = async (body: any) => {
  return await request({
    url: "admin/settings/update_terminal_name",
    method: "PUT",
    data: body,
  });
};

export const changePassword = async (body: any) => {
  return await request({
    url: `admin/settings/update_admin_password`,
    method: "PUT",
    data: body,
  });
};
