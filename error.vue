<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const subtitle = computed(() => {
  switch (props.error.statusCode) {
    case 403:
      return "Извините, у вас нет доступа к этой странице.";
    case 404:
      return "Извините, страница, которую вы ищете, не найдена.";
    case 500:
      return "Извините, на сервере произошла ошибка.";
    default:
      return "Произошла ошибка.";
  }
});
</script>

<template>
  <section class="error-page">
    <a-result
      :status="error.statusCode"
      :title="error.statusCode"
      :sub-title="subtitle"
    >
      <NuxtLink to="/">
        <a-button block type="primary">Вернуться на главную</a-button>
      </NuxtLink>
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
