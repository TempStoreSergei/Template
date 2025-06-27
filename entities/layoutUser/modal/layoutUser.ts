import { defineStore } from "pinia";
import { useTimestamp } from "@vueuse/core";
import {
  getInfoAboutSystem,
  getInfoAboutUser,
  printEmptySticker,
  logoutSesstion,
} from "../api";

const router = useRouter();

export const useLayoutUser = defineStore(
  "layoutUser",
  () => {
    const timestamp = useTimestamp({ offset: 0 });

    // Function to format the timestamp into date and time separately
    const formatDate = (timestamp) => {
      const dateObj = new Date(timestamp);
      const day = dateObj.getDate();
      const monthNames = [
        "Января",
        "Февраля",
        "Марта",
        "Апреля",
        "Мая",
        "Июня",
        "Июля",
        "Августа",
        "Сентября",
        "Октября",
        "Ноября",
        "Декабря",
      ];
      const month = monthNames[dateObj.getMonth()];
      const year = dateObj.getFullYear();

      return `${day} ${month} ${year}`; // Return only the date part
    };

    const formatTime = (timestamp) => {
      const dateObj = new Date(timestamp);
      const hour = dateObj.getHours().toString().padStart(2, "0");
      const min = dateObj.getMinutes().toString().padStart(2, "0");
      const sec = dateObj.getSeconds().toString().padStart(2, "0");

      return `${hour}:${min}:${sec}`; // Return only the time part
    };

    // Computed property for the current formatted date
    const getCurrentDate = computed(() => {
      return formatDate(timestamp.value);
    });

    // Computed property for the current formatted time
    const getCurrentTime = computed(() => {
      return formatTime(timestamp.value);
    });

    const logOut = async () => {
      try {
        await logoutSesstion();
        localStorage.removeItem("token");
        router.push({ name: "UserLogin" });
      } catch {
        message.error("Не удалось завершить смену");
      }
    };

    return {
      printEmptySticker,
      getInfoAboutUser,
      getCurrentDate, // Separate computed property for date
      getCurrentTime, // Separate computed property for time
      getInfoAboutSystem,
      logOut,
    };
  },
  {
    persist: true,
  },
);
