import { request } from "~/shared/api/request";

export const getCreatedUsers = () => {
  return request({
    url: "users/get_all_users",
    method: "GET",
    dataName: "usersData",
  });
};

export const getUserCookes = (id: string) => {
  return request({
    url: `auth/user_auth`,
    method: "POST",
    dataName: "sessionToken",
    data: {
      user_id: id,
    },
  });
};
