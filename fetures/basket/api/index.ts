import type { AxiosRequestConfig } from "axios";
import { request } from "~/shared/api/request";

export const getInfoAboutGoods = async (
  body: any,
  options?: AxiosRequestConfig,
) => {
  return await request({
    url: "system/get_several_goods_by_id",
    method: "POST",
    data: body,
    ...options,
  });
};
