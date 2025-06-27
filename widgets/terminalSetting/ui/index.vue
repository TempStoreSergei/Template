<template>
  <section class="device-settings">
    <a-divider>Настройки устройства</a-divider>

    <a-button
      type="primary"
      class="device-settings__button"
      @click="openChangePasswordModal"
    >
      Изменить пароль
    </a-button>

    <a-divider>Название цеха: {{ name }}</a-divider>
    <a-button
      type="primary"
      class="device-settings__button"
      @click="openChangeTerminalNameModal"
    >
      Поменять название цеха
    </a-button>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { changePassword, getTerminalName, changeTerminalName } from "../api";
import { passwordForm } from "../config/passwordSchemas";
import { terminalForm } from "../config/terminalSchemas";
import { useFormModal } from "~/hooks/useModal";

const name = ref("");
const [showModal] = useFormModal();

const openChangePasswordModal = async () => {
  await showModal({
    modalProps: {
      title: "Сменить пароль",
      width: 700,
      onFinish: async (values) => {
        await changePassword(values);
      },
    },
    formProps: {
      labelWidth: 100,
      schemas: passwordForm,
      autoSubmitOnEnter: true,
    },
  });
};

const openChangeTerminalNameModal = async () => {
  await showModal({
    modalProps: {
      title: "Сменить пароль",
      width: 700,
      onFinish: async (values) => {
        await changeTerminalName({ terminalName: values.terminalName });
        name.value = await getTerminalName();
      },
    },
    formProps: {
      labelWidth: 100,
      schemas: terminalForm,
      autoSubmitOnEnter: true,
    },
  });
};

onMounted(async () => {
  name.value = await getTerminalName();
});
</script>

<style scoped lang="scss">
.device-settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  &__button {
    margin-bottom: 20px;
  }

  &__info {
    text-align: center;
  }
}
</style>
