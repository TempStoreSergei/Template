/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from "dayjs";

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm";
const DATE_FORMAT = "YYYY-MM-DD";

export const formatToDateTime = (
  date?: dayjs.ConfigType,
  format = DATE_TIME_FORMAT,
): string => {
  return dayjs(date).format(format);
};

export const formatToDate = (
  date?: dayjs.ConfigType,
  format = DATE_FORMAT,
): string => {
  return dayjs(date).format(format);
};

export const createDateTimeFromParts = (
  year: string,
  month: string,
  day: string,
  hours: string,
  mins: string,
): string => {
  const data = dayjs(
    `${year}-${month}-${day} ${hours}:${mins}`,
    DATE_TIME_FORMAT,
  );
  return data.toString();
};

export const dateUtil = dayjs;
