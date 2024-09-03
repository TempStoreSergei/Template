import { ref, watch } from "vue";
import { defineStore } from "pinia";
import MD5 from "crypto-js/md5";
import { useIdle } from "@vueuse/core";
import { useRoute } from "vue-router";
import { store } from "~/app/providers/store";
import { LOGIN_NAME } from "~/constants";

// Default idle time before locking the screen (in milliseconds)
const DEFAULT_IDLE_TIME = 60 * 60 * 1000; // 60 minutes

export type LockscreenState = {
  isLocked: boolean; // Whether the screen is locked
  lockPassword: string; // Password used for locking
};

export const useLockscreenStore = defineStore(
  "lockscreen",
  () => {
    const route = useRoute();
    const { idle } = useIdle(DEFAULT_IDLE_TIME);
    const loginPassword = ref("");
    const lockPassword = ref("");
    const isLocked = ref(false);

    /**
     * Encrypt and save the login password locally for screen unlocking
     * @param password - The password to save
     */
    const saveLoginPassword = (password: string) => {
      loginPassword.value = MD5(password).toString();
    };

    /**
     * Set the lock screen status
     * @param locked - Boolean indicating whether to lock or unlock
     */
    const setLock = (locked: boolean) => {
      isLocked.value = locked;
      if (!locked) {
        resetLockPassword();
      }
    };

    /**
     * Set the lock screen password. If none is provided, use the login password.
     * @param password - The password to set
     */
    const setLockPassword = (password?: string) => {
      lockPassword.value = password
        ? MD5(password).toString()
        : loginPassword.value;
    };

    /**
     * Reset the lock screen password
     */
    const resetLockPassword = () => {
      lockPassword.value = "";
    };

    /**
     * Verify the provided password against the lock and login passwords
     * @param password - The password to verify
     * @returns True if the password matches either the lock or login password
     */
    const verifyLockPassword = (password: string) => {
      const hashedPassword = MD5(password).toString();
      return [lockPassword, loginPassword].some(
        (pw) => pw.value === hashedPassword,
      );
    };

    // Handle screen lock when the user is idle or before the page unloads
    window.addEventListener("beforeunload", () => {
      if (isLocked.value && !lockPassword.value) {
        setLock(false);
      }
    });

    watch(idle, (isIdle) => {
      if (route.name === LOGIN_NAME) {
        setLock(false);
        return;
      }

      if (isIdle) {
        setLock(true);
        setLockPassword();
      }
    });

    return {
      isLocked,
      lockPassword,
      loginPassword,
      setLock,
      setLockPassword,
      verifyLockPassword,
      saveLoginPassword,
      resetLockPassword,
    };
  },
  {
    persist: true, // Persist store data across page reloads
  },
);

// For use outside of component setup functions
export function useLockscreenStoreWithout() {
  return useLockscreenStore(store);
}
