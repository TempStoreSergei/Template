import antdLocale from "ant-design-vue/es/locale/ru_RU";
import { genMessage } from "../helper";

const modulesFiles = import.meta.glob("./ru/**/*.json", {
  eager: true,
});

export default {
  message: {
    ...genMessage(modulesFiles, "ru"),
    antdLocale,
  },
  dateLocale: null,
  dateLocaleName: "ru",
};
