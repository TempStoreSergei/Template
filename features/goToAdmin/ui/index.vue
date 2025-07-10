<template>
  <a-button class="admin-redirect" @click="goToAdmin">Назад</a-button>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToAdmin = () => {
  router.push("/admin");
};
</script>

<style lang="scss">
@import "./styles.module";
</style>
