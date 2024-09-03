/**
 * @description Enum for HTTP response status codes.
 */
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = -1,
  TIMEOUT = 10042,
  TYPE = "success",
}

/**
 * @description Enum for HTTP request methods.
 */
export enum RequestEnum {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

/**
 * @description Enum for common content types used in HTTP requests.
 */
export enum ContentTypeEnum {
  // JSON format
  JSON = "application/json;charset=UTF-8",
  // Plain text format
  TEXT = "text/plain;charset=UTF-8",
  // URL-encoded form data, typically used with qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // Form data, typically used for file uploads
  FORM_DATA = "multipart/form-data;charset=UTF-8",
}
