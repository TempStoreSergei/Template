<template>
  <div class="admin-panel">
    <a-row justify="center">
      <a-col :span="20">
        <div class="admin-panel__cards">
          <a-card
            v-for="card in cards"
            :key="card.id"
            :title="card.title"
            class="admin-panel__card"
            @click="handlerSelect(card.route)"
          >
            <p>{{ card.content }}</p>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const cards = ref([
  {
    id: 1,
    title: "Setting Terminal",
    content: "Manage terminal settings here.",
    route: "terminal-settings",
  },
  {
    id: 2,
    title: "Setting Slider",
    content: "Manage slider settings here.",
    route: "slider-settings",
  },
]);

const handlerSelect = (routeName: string) => {
  router.push({ name: routeName });
};

</script>

<style lang="scss">
@import "styles.module";
</style>
