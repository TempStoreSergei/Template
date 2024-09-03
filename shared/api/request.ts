import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { isString } from "lodash-es";
import { message as $message, Modal } from "ant-design-vue";
import { ResultEnum } from "~/enums/httpEnum.ts";

// Define request options with improved typing
export interface RequestOptions extends AxiosRequestConfig {
  isReturnResult?: boolean;
  successMsg?: string;
  errorMsg?: string;
  showSuccessMsg?: boolean;
  showErrorMsg?: boolean;
  requestType?: "json" | "form";
}

// Define base response interface
interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

const UNKNOWN_ERROR = "Unknown error. Please retry.";
export const serverIp = "http://192.168.0.120:1928/";
export const baseApiUrl = `${serverIp}api/`;

// Abort controller for request cancellation
const controller = new AbortController();

// Axios instance configuration
export const service = axios.create({
  baseURL: baseApiUrl,
  timeout: 10000,
  signal: controller.signal,
});


// Error handling function
const handleError = (error: any): Promise<never> => {
  if (error.response?.data?.message) {
    $message.error(error.response.data.message);
  } else {
    $message.error(UNKNOWN_ERROR);
  }
  return Promise.reject(error);
};

// Request interceptor for attaching token to headers
service.interceptors.request.use(
  (config) => {
    const token =  localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => handleError(error),
);

// Response interceptor for handling responses and errors
service.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    const res = response.data;

    if (res.code !== ResultEnum.SUCCESS) {
      $message.error(res.message || UNKNOWN_ERROR);

      if (res.code === 401) {
        Modal.confirm({
          title: "Warning",
          content: res.message || "Your session has expired. Please re-login.",
          okText: "Re-login",
          cancelText: "Cancel",
          onOk: () => {
            localstore.value = "";
            window.location.reload();
          },
        });
      }

      return Promise.reject(new Error(res.message || UNKNOWN_ERROR));
    }

    return response;
  },
  (error) => handleError(error),
);

/**
 * General request function
 * @param _url - The URL or configuration object
 * @param _config - Additional request options
 */
export async function request<T = any>(
  _url: string | RequestOptions,
  _config: RequestOptions = {},
): Promise<BaseResponse<T> | T> {
  const url = isString(_url) ? _url : _url.url;
  const config = isString(_url) ? _config : _url;

  try {
    const { requestType, isReturnResult = true, ...rest } = config;

    const response = await service.request({
      url,
      ...rest,
      headers: {
        ...rest.headers,
        ...(requestType === "form"
           ? { "Content-Type": "multipart/form-data" }
          : {}),
      },
    });

    const { data } = response;
    const { code, message } = data || {};

    const hasSuccess =
      data && Reflect.has(data, "code") && code === ResultEnum.SUCCESS;

    if (hasSuccess) {
      const { successMsg, showSuccessMsg } = config;
      if (successMsg) {
        $message.success(successMsg);
      } else if (showSuccessMsg && message) {
        $message.success(message);
      }
    }

    return isReturnResult ? data.data : data;
  } catch (error: any) {
    return handleError(error);
  }
}
