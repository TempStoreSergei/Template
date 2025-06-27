<template>
  <a-config-provider
    component-size="large"
    :theme="{
      token: {
        borderRadius: 6,
        fontSize: 24,
        lineWidth: 2,
        colorBorder: '#1677ff',
        colorSplit: '#1677ff',
        colorBorderSecondary: '#1677ff',
      },
    }"
  >
    <a-layout class="app-layout">
      <a-layout-header class="app-layout__header">
        <a-page-header title="Этикетка - Продукта">
          <template #extra>
            <a-button
              key="2"
              type="dashed"
              danger
              size="large"
              @click="layoutUserStore.logOut"
            >
              Завершить смену
            </a-button>
            <a-button
              key="1"
              type="primary"
              @click="layoutUserStore.printEmptySticker"
            >
              <template #icon> <PrinterOutlined /></template>
              Напечатать пустую этикетку
            </a-button>
          </template>
          <a-flex gap="large" justify="space-between">
            <a-statistic title="ФИО" :value="userName" />
            <a-statistic title="Название цеха" :value="terminalName" />
            <a-statistic
              title="Текущая дата"
              :value="layoutUserStore.getCurrentDate"
            />
            <a-statistic
              title="Текущее время"
              style="width: 280px"
              :value="layoutUserStore.getCurrentTime"
            />
          </a-flex>
          <div>
            <template v-for="item in iconLinks" :key="item.src">
              <a class="example-link">
                <img
                  class="example-link-icon"
                  :src="item.src"
                  :alt="item.text"
                />
                {{ item.text }}
              </a>
            </template>
          </div>
        </a-page-header>
      </a-layout-header>

      <a-layout-content class="app-layout__content">
        <div class="app-layout__content-inner">
          <slot />
        </div>
      </a-layout-content>
    </a-layout>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useLayoutUser } from "~/entities/layoutUser/modal/layoutUser";

const layoutUserStore = useLayoutUser();
const userName = ref("Загрузка...");
const terminalName = ref("Загрузка...");

const getUserName = async () => {
  try {
    const response = await layoutUserStore.getInfoAboutUser();
    const firstInitial = response.user_first_name.charAt(0).toUpperCase();
    const patronymicInitial = response.user_patronymic.charAt(0).toUpperCase();
    userName.value = `${response.user_surname} ${firstInitial}.${patronymicInitial}.`;
  } catch (error) {
    console.error("Error fetching user info:", error);
    userName.value = "Ошибка загрузки";
  }
};

const getTerminalName = async () => {
  try {
    const response = await layoutUserStore.getInfoAboutSystem();
    terminalName.value = response;
  } catch (error) {
    console.error("Error fetching user info:", error);
    terminalName.value = "Ошибка загрузки";
  }
};

// Fetch user info when component is mounted
onMounted(() => {
  getUserName();
  getTerminalName();
});
</script>
<style lang="scss">
.app-layout {
  height: 100vh;
  width: 100vw;

  &__header {
    padding: 0 !important;
  }

  &__content {
    min-height: 100%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__content-inner {
    width: 100%;
    height: 100%;
  }
}
</style>
