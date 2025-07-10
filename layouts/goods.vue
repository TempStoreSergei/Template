<template>
  <div class="floating-layout">
    <!-- Header elements that appear to float -->
    <header class="floating-header">
      <div class="floating-title">
        <span class="material-icons">label</span>
        <h1>Этикетка</h1>
      </div>
      <div class="user-info-chip">
        <span class="material-icons">person</span>
        <span>{{ userName }}</span>
      </div>
      <div class="terminal-info-chip">
        <span class="material-icons">dns</span>
        <span>{{ terminalName }}</span>
      </div>
      <div class="time-info-chip">
        <span class="material-icons">schedule</span>
        <span>
          {{ layoutUserStore.getCurrentDate }}
          {{ layoutUserStore.getCurrentTime }}
        </span>
      </div>
      <div class="header-actions">
        <md-filled-button @click="layoutUserStore.printEmptySticker">
          <span slot="icon" class="material-icons">print</span>
          Печать
        </md-filled-button>
        <md-outlined-button @click="layoutUserStore.logOut">
          Выход
        </md-outlined-button>
      </div>
    </header>

    <!-- The main content area -->
    <main class="floating-content">
      <slot />
    </main>
  </div>
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
    const firstInitial = response.userFullname.charAt(0).toUpperCase();
    const patronymicInitial = response.userPatronymic.charAt(0).toUpperCase();
    userName.value = `${response.userSurname} ${firstInitial}.${patronymicInitial}.`;
  } catch (error) {
    console.error("Error fetching user info:", error);
    userName.value = "Ошибка";
  }
};

const getTerminalName = async () => {
  try {
    const response = await layoutUserStore.getInfoAboutSystem();
    terminalName.value = response;
  } catch (error) {
    console.error("Error fetching terminal info:", error);
    terminalName.value = "Ошибка";
  }
};

onMounted(() => {
  getUserName();
  getTerminalName();
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

.floating-layout {
  height: 100vh;
  width: 100%;
  background: var(--md-sys-color-surface, #fef7ff);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.floating-header {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  gap: 16px;
  flex-wrap: wrap; // Allow chips to wrap on smaller screens
  border-bottom: 1px solid var(--md-sys-color-surface-container-outline, #e0e0e0);
}

.floating-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: auto; // Pushes other items to the right

  h1 {
    font-size: 26px;
    font-weight: 600;
    margin: 0;
    color: var(--md-sys-color-on-surface, #1d1b20);
  }
  .material-icons {
    color: var(--md-sys-color-primary, #6750a4);
    font-size: 32px;
  }
}

%info-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 24px;
  background: var(--md-sys-color-surface-container, #f3edf7);
  color: var(--md-sys-color-on-surface-variant, #49454f);
  font-size: 16px;
  font-weight: 500;

  .material-icons {
    font-size: 24px;
  }
}

.user-info-chip,
.terminal-info-chip,
.time-info-chip {
  @extend %info-chip;
}

.header-actions {
  display: flex;
  gap: 8px;
  margin-left: 16px;
}

.floating-content {
  flex-grow: 1;
  overflow: auto;
  padding: 4px; // Small padding to avoid content touching the edges
}

// Style Material Web components
md-filled-button {
  --md-filled-button-container-height: 56px;
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  font-size: 16px;
}

md-outlined-button {
  --md-outlined-button-container-height: 56px;
  --md-sys-color-primary: #6750a4;
  --md-outlined-button-outline-color: #79747e;
  font-size: 16px;
}
</style>
