<script lang="ts" setup>
import { UserPage } from "~/pages/UserPage";

definePageMeta({
  layout: "admin",
  name: "users",
  title: "Пользователи",
});
</script>

<template>
  <UserPage />
</template>
