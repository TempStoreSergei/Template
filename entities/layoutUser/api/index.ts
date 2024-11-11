import { request } from "~/shared/api/request";

export const getInfoAboutUser = () => {
  return request({
    url: `user/get_user/`,
    method: "GET",
  });
};

export const getInfoAboutSystem = () => {
  return request({
    url: `user/get_terminal_name/`,
    method: "GET",
  });
};

export const printEmptySticker = () => {
  return request({
    url: `user/print_empty_blank/`,
    method: "GET",
  });
};

export const logoutSesstion = () => {
  return request({
    url: `user/user_logout/`,
    method: "GET",
  });
};
