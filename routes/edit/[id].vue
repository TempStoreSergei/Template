<script lang="ts" setup>
import { EditPage } from "~/pages/EditPage";

definePageMeta({
  layout: "admin",
  name: "Edit",
  title: "Редактор",
  hideInTabs: true,
});
</script>

<template>
  <EditPage />
</template>
