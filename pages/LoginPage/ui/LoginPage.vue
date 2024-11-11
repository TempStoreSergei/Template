<template>
  <div class="login-container">
    <a-card class="login-card" title="Вход">
      <a-form
        :model="loginForm"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
        @finishFailed="onFinishFailed"
      >
        <a-form-item label="Пароль" name="adminPass" :rules="rules.adminPass">
          <a-input-password
            v-model:value="loginForm.adminPass"
            placeholder="Введите пароль"
            aria-label="Пароль"
          />
        </a-form-item>

        <a-form-item>
          <a-flex gap="large">
            <a-button type="primary" html-type="submit" :loading="loading">
              Войти
            </a-button>
            <a-button type="dashed" danger @click="exit"> Выйти </a-button>
          </a-flex>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { authLogin } from "../api";

// Инициализация роутера и текущего маршрута
const router = useRouter();
const route = useRoute();

const loginForm = ref({
  adminPass: "",
});
const loading = ref(false);

const rules = {
  adminPass: [
    { required: true, message: "Пароль обязателен", trigger: "blur" },
  ],
};

const handleSubmit = async (e) => {
  try {
    loading.value = true;
    const response = await authLogin(loginForm.value);

    localStorage.setItem("token", response.data);
    message.success("Вход выполнен успешно!");

    const redirectRoute = route.query.redirect || "user";

    await router.push(redirectRoute);
  } catch (error) {
    message.error(
      error.response?.data?.message || "Ошибка входа. Попробуйте снова.",
    );
  } finally {
    loading.value = false;
  }
};

const exit = async () => {
  await router.push({ name: "UserLogin" });
};

const onFinishFailed = (e) => {
  console.error(e);
};
</script>

<style lang="scss">
@import "styles.module";

// Стили контейнера входа
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

// Стили карточки входа
.login-card {
  width: 100%;
  max-width: 500px;
  box-shadow: var(--login-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.15));
}
</style>
