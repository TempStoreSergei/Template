<template>
  <span> {{ getTitle }}</span>
</template>

<script setup lang="ts">
import { type PropType, computed } from "vue";
import { useLocaleStore } from "~/entities/language/modal/locale";

const props = defineProps({
  title: {
    type: [String, Object] as PropType<string | Title18n>,
    required: true,
    default: "",
  },
});

const localeStore = useLocaleStore();

const getTitle = computed(() => {
  const { title = "" } = props;
  if (typeof title === "object") {
    return title?.[localeStore.locale] ?? title;
  }
  return title;
});
</script>
