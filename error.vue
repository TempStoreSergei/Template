<script setup lang="ts">
import type { NuxtError } from "#app";
import { request } from "~/shared/api/request";

const router = useRouter();
const props = defineProps({
  error: Object as () => NuxtError,
});

interface FormState {
  token: string;
}

const setToken = (param: string) => {
  return request({
    url: `defender/create_token?token=${param}`,
    method: "GET",
    isReturnResult: false,
  });
};

const chekcToken = () => {
  return request({
    url: "defender/check_token/",
    method: "GET",
  });
};

const formState = reactive<FormState>({
  token: "",
});

const onFinish = async (values: any) => {
  try {
    await setToken(values.token);
    await chekcToken();
    router.push({ name: "UserLogin" });
  } catch {
    
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const subtitle = computed(() => {
  switch (props.error.statusCode) {
    case 403:
      return "Извините, у вас нет доступа к этой странице.";
    case 423:
      return "Извините, у вас отсутствует лицензия";
    case 404:
      return "Извините, страница, которую вы ищете, не найдена.";
    case 500:
      return "Извините, на сервере произошла ошибка.";
    default:
      return "Произошла ошибка.";
  }
});

const code = computed(() => {
  switch (props.error.statusCode) {
    case 423:
      return 403;
    default:
      return props.error.statusCode;
  }
});
</script>

<template>
  <section class="error-page">
    <a-result :status="code" :title="error.statusCode" :sub-title="subtitle">
      <NuxtLink v-if="error.statusCode !== 423" to="/">
        <a-button block type="primary">Вернуться на главную</a-button>
      </NuxtLink>
      <a-form
        v-else
        :model="formState"
        name="basic"
        layout="vertical"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          name="token"
          :rules="[{ required: true, message: 'Поле не может быть пустым!' }]"
        >
          <a-input v-model:value="formState.token" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button block type="primary" html-type="submit"
            >Проверить ключ</a-button
          >
        </a-form-item>
      </a-form>
    </a-result>
  </section>
</template>

<style lang="scss">
.error-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
