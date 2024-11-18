import { useRouter } from "vue-router";
import {
  LOGIN_NAME,
  PAGE_NOT_FOUND_NAME,
  REDIRECT_NAME,
} from "~/constants/router";
import { defineNuxtPlugin } from "#app";

const defaultRoutePath = "UserLogin";

export default defineNuxtPlugin(() => {
  const router = useRouter();

  router.beforeEach(async (to, from, next) => {
    const userStoreToken = localStorage.getItem("token");

    if (userStoreToken) {
      if (to.name === LOGIN_NAME) {
        next({ name: defaultRoutePath });
      } else {
        const hasRoute = router.hasRoute(to.name!);
        if (!hasRoute) {
          next({ name: PAGE_NOT_FOUND_NAME });
        } else {
          next();
        }
      }
    } else {
      console.log(to.name);
      const whiteNameList = ["UserLogin", LOGIN_NAME, PAGE_NOT_FOUND_NAME];
      if (whiteNameList.some((name) => name === to.name)) {
        next();
      } else {
        next({
          name: LOGIN_NAME,
          query: { redirect: to.fullPath },
          replace: true,
        });
      }
    }
  });

  router.afterEach((to, from) => {
    if (to.meta?.title) {
      document.title = to.meta.title as string;
    }
    if (to.name === REDIRECT_NAME) {
      // Add custom cache clearing or other actions here
    }
  });

  router.onError((error) => {
    console.error("Router error:", error);
  });
});
