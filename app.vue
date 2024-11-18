<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { onBeforeMount } from "vue";
import { request } from "~/shared/api/request";

const chekcToken = () => {
  return request({
    url: "defender/check_token/",
    method: "GET",
  });
};

onBeforeMount(() => {
  chekcToken();
});
</script>
