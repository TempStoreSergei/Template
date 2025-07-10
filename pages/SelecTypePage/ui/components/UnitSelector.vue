<template>
  <div class="unit-selector">
    <md-outlined-text-field
      :label="label"
      :value="modelValue"
      @input="handleInput"
      :list="datalistId"
      autocomplete="off"
    />
    <datalist :id="datalistId">
      <option
        v-for="unit in units"
        :key="unit.id"
        :value="unit.unitFullname"
      />
    </datalist>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "#imports";
import type { Unit } from "~/pages/SelecTypePage/model/types";

const props = defineProps<{
  modelValue: string;
  units: Unit[];
  label?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const datalistId = computed(
  () => `unit-options-${Math.random().toString(36).substr(2, 9)}`,
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<style scoped>
.unit-selector {
  width: 100%;
}
</style> 