<script lang="ts" setup>
import { GeneratorPage } from "~/pages/GeneratorPage";

definePageMeta({
  layout: "admin",
  name: "generatorInfo",
  title: "Генерация",
  hideInTabs: true,
});
</script>

<template>
  <GeneratorPage />
</template>
