<template>
  <div class="generation__form">
    <a-space
      v-for="(dish, index) in dishes"
      :key="index"
      style="display: flex; margin-bottom: 8px"
      align="baseline"
    >
      <a-form-item
        :name="['dishes', index, 'title']"
        label="Название"
        :rules="[
          { required: true, message: 'Название обязательно' },
          { validator: validateUniqueDish, message: 'Без повторений' },
        ]"
      >
        <a-input v-model:value="dish.title" placeholder="Название" />
      </a-form-item>
      <a-form-item
        label="Срок годности (ч)"
        :name="['dishes', index, 'lifeTime']"
      >
        <a-input-number v-model:value="dish.lifeTime" :min="1" />
      </a-form-item>
      <MinusCircleOutlined @click="() => removeDish(dish)" />
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  dishes: {
    type: Array as () => {
      title: string;
      lifeTime: number;
    }[],
    required: true,
  },
  removeDish: {
    type: Function,
    required: true,
  },
  validateUniqueDish: {
    type: Function,
    required: true,
  },
});
</script>

<style scoped>
.generation__form {
  margin-top: 20px;
}
</style>
