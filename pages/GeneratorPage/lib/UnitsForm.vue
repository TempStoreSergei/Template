<template>
  <a-form ref="formRef" class="generation__form" :model="units">
    <a-form-item
      v-for="(unit, index) in units"
      :key="index"
      :name="[index, 'value']"
      :rules="[
        { required: true, message: 'Еденица измерения не может быть пустой' },
        {
          validator: validateUniqueUnit,
          message: 'Еденица измерения должна быть уникальной',
        },
      ]"
    >
      <a-input
        v-model:value="unit.value"
        style="width: 60%; margin-right: 24px"
        :disabled="unit.value === 'Граммы' && index === 0"
        placeholder="Введите название ед. измерения"
      />
      <MinusCircleOutlined v-if="index !== 0" @click="() => removeUnit(unit)" />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  units: {
    type: Array as () => { value: string }[],
    required: true,
  },
  removeUnit: {
    type: Function,
    required: true,
  },
  validateUniqueUnit: {
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
