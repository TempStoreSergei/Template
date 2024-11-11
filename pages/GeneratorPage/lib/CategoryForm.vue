<template>
  <div class="generation__form">
    <a-space
      v-for="(category, index) in categories"
      :key="index"
      style="display: flex; margin-bottom: 8px"
      align="baseline"
    >
      <a-form-item
        :name="['categories', index, 'title']"
        label="Название"
        :rules="[
          { required: true, message: 'Название обязательно' },
          { validator: validateUniqueGroccery, message: 'Без повторений' },
        ]"
      >
        <a-input v-model:value="category.title" placeholder="Название" />
      </a-form-item>
      <a-form-item
        label="Срок годности (ч)"
        :name="['categories', index, 'lifeTime']"
      >
        <a-input-number v-model:value="category.lifeTime" :min="1" />
      </a-form-item>
      <a-form-item label="В наличии" :name="['categories', index, 'inStock']">
        <a-switch v-model:checked="category.inStock" />
      </a-form-item>
      <a-tag color="green">{{ category.unitName }}</a-tag>
      <MinusCircleOutlined @click="() => removeCategory(category)" />
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  categories: {
    type: Array as () => {
      title: string;
      lifeTime: number;
      inStock: boolean;
      unitName: string;
    }[],
    required: true,
  },
  removeCategory: {
    type: Function,
    required: true,
  },
  validateUniqueGroccery: {
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
