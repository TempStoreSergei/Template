import { request } from "~/shared/api/request";

export const getInfoAboutPrinter = async () => {
  return await request({
    url: "admin/settings/get_terminal_printer_settings/",
    method: "GET",
  });
};

export const getInfoAboutSticker = async () => {
  return await request({
    url: "admin/settings/get_printer_size/",
    method: "GET",
  });
};

export const testPagePrint = async () => {
  return await request({
    url: "admin/settings/print_test_page/",
    method: "GET",
  });
};

export const chagePrinterSpeed = async (body: any) => {
  return await request({
    url: `admin/settings/update_printer_speed`,
    method: "PUT",
    data: body,
  });
};

export const chagePrinterDarknes = async (body: any) => {
  return await request({
    url: `admin/settings/update_printer_darkness`,
    method: "PUT",
    data: body,
  });
};

export const chagePrinterPapperSize = async (body: any) => {
  return await request({
    url: `admin/settings/update_printer_size`,
    method: "PUT",
    data: body,
  });
};
