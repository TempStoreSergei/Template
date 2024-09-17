<template>
  <div class="login-container">
    <a-card class="login-card" title="Login">
      <a-form :model="loginForm" layout="vertical" @submit="handleSubmit">
        <a-form-item label="Username" required>
          <a-input
            v-model:value="loginForm.userName"
            placeholder="Enter your username"
          />
        </a-form-item>

        <a-form-item label="Password" required>
          <a-input-password
            v-model:value="loginForm.userPass"
            placeholder="Enter your password"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" block :loading="loading">
            Login
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { authLogin } from "../api";

const router = useRouter();

// State for login form data
const loginForm = ref({
  userName: "",
  userPass: "",
});

// State for error message and loading state
const loading = ref(false);

// Handle form submission
const handleSubmit = async (e) => {
  try {
    e.preventDefault();
    loading.value = true;
    const responce = await authLogin(loginForm.value);
    localStorage.setItem("token", responce.token);
    message.success("Login successful!");
    await router.push("/admin");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss">
@import "styles.module";

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
