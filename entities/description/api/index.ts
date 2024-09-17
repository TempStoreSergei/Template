import { request } from "~/shared/api/request";

export const getGoodInfo = async (goodId: number, options?: any) => {
  try {
    return await request(`/system/get_good/${goodId}`, {
      method: "Get",
      ...options,
    });
  } catch (error: any) {
    throw error;
  }
};
