import { request } from "~/shared/api/request";

export const getExistedGrociries = () => {
  return request({
    url: "user/get_groceries",
    method: "GET",
  });
};

export const printStikerGroceries = (id: number, body: any) => {
  return request({
    url: `user/print_dish_blank/${id}`,
    method: "POST",
    data: body,
  });
};

export const getExistedDishe = () => {
  return request({
    url: "user/get_dishes",
    method: "GET",
  });
};

export const getAllUnits = () => {
  return request({
    url: "user/get_units",
    method: "GET",
  });
};
