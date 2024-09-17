import { serverIp } from "~/shared/api/request";

/**
 * Appends query parameters from an object to a base URL.
 * @param baseUrl - The base URL to which parameters will be appended.
 * @param obj - An object representing query parameters.
 * @returns A string containing the base URL with appended query parameters.
 *
 * Example:
 * ```
 * let params = {a: '3', b: '4'};
 * setObjToUrlParams('www.baidu.com', params);
 * // => www.baidu.com?a=3&b=4
 * ```
 */
export const setObjToUrlParams = (
  baseUrl: string,
  obj: Record<string, any>,
): string => {
  // Convert the parameters object to a query string
  const parameters = Object.entries(obj)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  // Check if baseUrl already has a query string or needs to be appended
  if (baseUrl.includes("?")) {
    return `${baseUrl}${parameters}`;
  } else {
    return `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}?${parameters}`;
  }
};

/**
 * Replaces consecutive slashes in a URL path with a single slash,
 * except for the protocol part (e.g., 'http://').
 * @param path - The URL path to be processed.
 * @returns The URL path with redundant slashes removed.
 *
 * Example:
 * ```
 * let url = 'https://example.com//path//to//resource';
 * uniqueSlash(url);
 * // => https://example.com/path/to/resource
 * ```
 */
export const uniqueSlash = (path: string): string => {
  return path.replace(/(https?:\/\/)(\/)+/g, "$1").replace(/\/{2,}/g, "/");
};

export const getDataFromServer = (path: string): string => {
  return serverIp + path;
};
