<template>
  <!-- Display the tooltip if formSchemas exist and the search feature is available -->
  <Tooltip v-if="hasSchemasAndSearch" placement="top">
    <template #title>
      <!-- Toggle text between 'Hide Search' and 'Show Search' based on current state -->
      <span>{{ isSearchVisible ? "Hide Search" : "Show Search" }}</span>
    </template>
    <!-- Click event triggers the search visibility toggle -->
     <SearchOutlined @click="toggleSearchVisibility" />
  </Tooltip>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { Tooltip } from "ant-design-vue";
import { useTableContext } from "../../hooks/useTableContext";

// Extract values and methods from the table context
const { getProps, setProps, formSchemas, search } = useTableContext();

// Computed property to check if there are form schemas and the search feature is available
const hasSchemasAndSearch = computed(() => formSchemas?.length && search);

// Computed property to determine if the search input is currently visible
const isSearchVisible = computed(() => getProps.value.search);

// Function to toggle the visibility of the search input
const toggleSearchVisibility = () => {
  setProps({
    search: !isSearchVisible.value, // Invert the current search visibility state
  });
};
</script>
