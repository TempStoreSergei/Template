import { request } from "~/shared/api/request";

export const logOut = async () => {
  return await request({
    url: "auth/admin_logout",
    method: "GET",
  });
};
