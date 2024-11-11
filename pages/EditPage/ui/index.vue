<template>
  <section>
    <MdEditor
      v-model="text"
      style="margin-bottom: 24px"
      editor-id="myId"
      language="en-US"
      @on-change="debouncedSave"
    />
    <NuxtLink to="/dishes">
      <a-button type="dashed">Вернуться к блюдам</a-button>
    </NuxtLink>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { MdEditor } from "md-editor-v3";
import { useDebounceFn } from "@vueuse/core";
import { useRouter } from "vue-router";
import { saveRecipe, getRecipe } from "../api";
import "md-editor-v3/lib/style.css";

const route = useRoute();
const router = useRouter();
const recipeId = ref(null);

const text = ref("");

const onAutoSave = async () => {
  await saveRecipe(recipeId.value, { dishRecipe: text.value });
};

const debouncedSave = useDebounceFn(onAutoSave, 500);

onMounted(async () => {
  recipeId.value = route.params.id;
  text.value = await getRecipe(recipeId.value);
});
</script>
