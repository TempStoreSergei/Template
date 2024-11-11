import { request } from "~/shared/api/request";

export const getExistedGrociries = () => {
  return request({
    url: "user/get_groceries",
    method: "GET",
  });
};

export const printStikerGroceries = (id: number, body: any) => {
  return request({
    url: `user/print_grocery_blank/${id}`,
    method: "POST",
    data: body,
  });
};
