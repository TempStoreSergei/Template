import { request } from "~/shared/api/request";

export const getInfoAboutUser = () => {
  return request({
    url: `users/get_user`,
    dataName: "userData",
    method: "GET",
  });
};

export const getInfoAboutSystem = () => {
  return request({
    url: `settings_terminal/get_terminal_name`,
    method: "GET",
    dataName: "terminalName",
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
    url: `/auth/user_logout`,
    method: "GET",
  });
};
