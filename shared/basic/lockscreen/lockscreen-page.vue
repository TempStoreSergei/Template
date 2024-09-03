<template>
  <div
    :class="{ unLockLogin: isShowForm }"
    class="lockscreen"
    @keyup="isShowForm = true"
    @mousedown.stop
    @contextmenu.prevent
  >
    <template v-if="!isShowForm">
      <div class="lock-box">
        <div class="lock">
          <span
            class="lock-icon"
            title="Unlock Screen"
            @click="isShowForm = true"
          >
            <Icon icon="ant-design:lock-outlined" size="30" />
          </span>
        </div>
        <h6 class="tips">Click to unlock</h6>
      </div>
      <!-- Xiaomi / Huawei Charging -->
      <component
        :is="BatteryComp"
        :battery="battery"
        :battery-status="batteryStatus"
        :calc-discharging-time="calcDischargingTime"
      />
      <div class="local-time">
        <div class="time">{{ hour }}:{{ minute }}</div>
        <div class="date">{{ month }} month {{ day }} day, {{ week }} week</div>
      </div>
      <div class="computer-status">
        <span :class="{ offline: !online }" class="network">
          <Icon icon="ant-design:wifi-outlined" size="30" class="network" />
        </span>
        <Icon icon="ant-design:api-outlined" size="30" />
      </div>
    </template>
    <template v-else>
      <div class="login-box">
        <Avatar :size="80">
          <template #icon>
            <Icon icon="ant-design:user-outlined" size="50" />
          </template>
        </Avatar>
        <div class="username">test</div>
        <a-input-password
          v-model:value="password"
          autofocus
          :placeholder="pwdPlaceholder"
        />
        <div class="flex justify-between w-full">
          <template v-if="lockscreenStore.lockPassword">
            <a-button type="link" size="small" @click="hideLockForm"
              >Back</a-button
            >
            <a-button type="link" size="small" @click="nav2login"
              >Back to Login</a-button
            >
            <a-button type="link" size="small" @click="onLogin"
              >Enter System</a-button
            >
          </template>
          <template v-else>
            <a-button type="link" size="small" @click="cancelLock"
              >Cancel Lock</a-button
            >
            <a-button type="link" size="small" @click="lockScreen"
              >Confirm Lock</a-button
            >
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useOnline } from "@vueuse/core";
import { Avatar, message } from "ant-design-vue";
import { useTime } from "~/hooks/useTime";
import { useBattery } from "~/hooks/useBattery";
import { useLockscreenStore } from "~/entities/lockscreen/modal/lockscreen";
import { LOGIN_NAME } from "~/constants";
import { Icon } from "~/shared/basic/icon";

const lockscreenStore = useLockscreenStore();
const { month, day, hour, minute, week } = useTime();
const online = useOnline();

const router = useRouter();
const route = useRoute();

const { battery, batteryStatus, calcDischargingTime } = useBattery();

const BatteryComp = defineAsyncComponent(() => {
  return Math.random() > 0.49
    ? import("./xiaomi-charge.vue")
    : import("./xiaomi-charge.vue");
});

const isShowForm = ref(!lockscreenStore.lockPassword);
const password = ref("");

const pwdPlaceholder = computed(() => {
  return lockscreenStore.lockPassword
    ? "Please enter lock screen password or user password"
    : "Please enter lock screen password (optional)";
});

// Login
const onLogin = async () => {
  const pwd = password.value.trim();

  if (pwd === "") return message.warn("Password cannot be empty");

  if (lockscreenStore.verifyLockPassword(pwd)) {
    unlockScreen();
  } else {
    return message.warn("Incorrect password, please try again");
  }
};

/** Hide the lock screen input form */
const hideLockForm = () => {
  isShowForm.value = false;
  password.value = "";
};

/** Cancel the lock screen */
const cancelLock = () => {
  isShowForm.value = false;
  lockscreenStore.setLock(false);
};

// Confirm lock screen
const lockScreen = () => {
  const pwd = password.value.trim();
  lockscreenStore.setLockPassword(pwd);
  hideLockForm();
};

// Cancel lock screen / Unlock screen
const unlockScreen = () => {
  isShowForm.value = false;
  lockscreenStore.setLock(false);
};

// Navigate to login
const nav2login = () => {
  isShowForm.value = false;
  lockscreenStore.setLock(false);
  router.replace({
    name: LOGIN_NAME,
    query: {
      redirect: route.fullPath,
    },
  });
};
</script>

<style lang="less" scoped>
.lockscreen {
  display: flex;
  position: fixed;
  z-index: 9999;
  inset: 0;
  overflow: hidden;
  background: #000;
  color: white;

  &.unLockLogin {
    background-color: rgb(25 28 34 / 78%);
    backdrop-filter: blur(7px);
  }

  .setting-box,
  .login-box {
    display: flex;
    position: absolute;
    top: 45%;
    left: 50%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 260px;
    transform: translate(-50%, -50%);

    > * {
      margin-bottom: 14px;
    }

    .username {
      font-size: 22px;
      font-weight: 700;
    }
  }

  .lock-box {
    position: absolute;
    top: 12vh;
    left: 50%;
    transform: translateX(-50%);
    font-size: 34px;

    .tips {
      color: white;
      cursor: text;
    }

    .lock {
      display: flex;
      justify-content: center;

      .lock-icon {
        cursor: pointer;

        .anticon-unlock {
          display: none;
        }

        &:hover .anticon-unlock {
          display: initial;
        }

        &:hover .anticon-lock {
          display: none;
        }
      }
    }
  }

  .local-time {
    position: absolute;
    bottom: 60px;
    left: 60px;
    font-family: helvetica;

    .time {
      font-size: 70px;
    }

    .date {
      font-size: 40px;
    }
  }

  .computer-status {
    position: absolute;
    right: 60px;
    bottom: 60px;
    font-size: 24px;

    > * {
      margin-left: 14px;
    }

    .network {
      position: relative;

      &.offline::before {
        content: "";
        position: absolute;
        z-index: 10;
        top: 50%;
        left: 50%;
        width: 2px;
        height: 28px;
        transform: translate(-50%, -50%) rotate(45deg);
        background-color: red;
      }
    }
  }
}
</style>
