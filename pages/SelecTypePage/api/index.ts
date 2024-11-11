import { request } from "~/shared/api/request";

export const getAvalibleInfo = () => {
  return request({
    url: "user/get_dishes_and_groceries/",
    method: "GET",
  });
};
