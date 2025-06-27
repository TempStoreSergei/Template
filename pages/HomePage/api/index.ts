import { request } from "~/shared/api/request";

export const getCreatedUsers = () => {
  return request({
    url: "user/get_all_users/",
    method: "GET",
  });
};

export const getUserCookes = (id) => {
  return request({
    url: `user/login_user/${id}`,
    method: "POST",
  });
};