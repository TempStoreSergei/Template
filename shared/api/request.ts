import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { isString } from "lodash-es";
import { message as $message, Modal } from "ant-design-vue";
import { ResultEnum } from "~/enums/httpEnum";

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
export const serverIp = "http://10.0.0.8:6543/";
export const baseApiUrl = `${serverIp}api/`;

// Abort controller for request cancellation
const controller = new AbortController();

// Axios instance configuration
export const service = axios.create({
  baseURL: baseApiUrl,
  timeout: 10000,
  signal: controller.signal,
});

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    const res = response.data;

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== ResultEnum.SUCCESS) {
      $message.error(res.message || UNKNOWN_ERROR);
      // Illegal token
      if ([401].includes(res.code)) {
        Modal.confirm({
          title: "Внимание",
          content:
            res.message ||
            "Ваша сессия закончиласть. Пожалуйста зайдити еще раз.",
          okText: "Перезайти",
          cancelText: "Отмена",
          onOk: () => {
            localStorage.removeItem("token");
            window.location.replace("/login");
          },
          onCancel: () => {
            window.location.replace("/");
          },
        });
      }

      if (res.code === 403 || res.code === 423) {
        showError({ message: "Not allow", statusCode: res.code });
      }
      // throw other
      const error = new Error(res.message || UNKNOWN_ERROR) as Error & {
        code: any;
      };
      error.code = res.code;
      return Promise.reject(error);
    } else {
      return response;
    }
  },
  (error) => {
    if (!error) {
      const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR;
      $message.error({ content: errMsg, key: errMsg });
      error.message = errMsg;
    }
    return Promise.reject(error);
  },
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
    return Promise.reject(error);
  }
}
