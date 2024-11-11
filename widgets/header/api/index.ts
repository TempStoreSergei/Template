import { request } from "~/shared/api/request";

export const logOut = async () => {
  return await request({
    url: "admin/admin_logout/",
    method: "GET",
  });
};
