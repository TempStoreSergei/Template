<template>
  <a-dropdown>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="shutdown">
          <span>Выключить</span>
        </a-menu-item>
        <a-menu-item key="restart">
          <span>Перезагрузить</span>
        </a-menu-item>
        <a-menu-item key="close">
          <span>Закрыть приложение</span>
        </a-menu-item>
      </a-menu>
    </template>
    <a-button type="dashed">
      Действия
      <DownOutlined />
    </a-button>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { DownOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import { restartSystem, shutDownSystem, closeApp, logOut } from "./api";
const keySelect = ref();

const handleMenuClick = ({ key }: { key: string }) => {
  keySelect.value = key;
  switch (key) {
    case "shutdown":
      confirmAction("выключить систему");
      break;
    case "restart":
      confirmAction("перезагрузить систему");
      break;
    case "close":
      confirmAction("закрыть приложение");
      break;
  }
};

const confirmAction = (actionText: string) => {
  Modal.confirm({
    title: `Вы уверены, что хотите ${actionText}?`,
    okText: "Да",
    cancelText: "Нет",
    onOk() {
      switch (keySelect.value) {
        case "shutdown":
          shutDownSystem();
          break;
        case "restart":
          restartSystem();
          break;
        case "close":
          closeApp();
          break;
      }
    },
  });
};
</script>

<style lang="less" scoped>
/* MacOS-like minimalistic dropdown */
a-dropdown {
  .ant-btn {
    background: transparent;
    border: none;
    font-size: 14px;
    color: #000;
  }

  .ant-menu-item {
    padding: 10px 20px;
    font-size: 14px;
  }
}

a-menu {
  background-color: #f5f5f7;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.ant-btn:hover {
  color: #007aff;
}

.ant-menu-item:hover {
  background-color: #e9e9e9;
}
</style>
