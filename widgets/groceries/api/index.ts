import { request } from "~/shared/api/request";

export const getExistedGrociries = () => {
  return request({
    url: "user/get_groceries",
    method: "GET",
  });
};

export const printStikerGroceries = ( item_id: string, weight: number, count: number) => {
  return request({
    url: `print/print_item_blank`,
    method: "GET",
    params: { item_id, massa: weight, amount: count },
  });
};
