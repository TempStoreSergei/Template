<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from "vue";
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons-vue";
import { useTableContext } from "../../hooks/useTableContext";

// Get table context from a custom hook
const tableContext = useTableContext();
const isFullscreen = tableContext.isFullscreen;

// A reference to track tooltip visibility
const isTooltipOpen = ref(false);

// Reference to the current Vue component instance
const currentInstance = getCurrentInstance();

// Function to update the style of the application container when toggling fullscreen
const updateAppContainerStyle = () => {
  // Get the app container element; fallback to querying the DOM
  const appElement: HTMLDivElement =
    currentInstance?.appContext.app._container ||
    document.querySelector("#app");

  appElement.style.transition = "opacity 0.5s, visibility 0.5s";

  if (appElement) {
    // Update the container's style based on the fullscreen state
    appElement.style.opacity = isFullscreen.value ? "0" : "1";
    appElement.style.visibility = isFullscreen.value ? "hidden" : "visible";
    appElement.style.position = isFullscreen.value ? "absolute" : "relative";
  }
};

// Toggle fullscreen state and update styles accordingly
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value; // Toggle the fullscreen state
  isTooltipOpen.value = false; // Close the tooltip after the action
  updateAppContainerStyle(); // Apply the new styles
};

// Ensure the container styles are updated when the component is mounted
onMounted(() => {
  updateAppContainerStyle();
});
</script>

<template>
  <!-- Tooltip component wrapping the fullscreen button -->
  <a-tooltip v-model:open="isTooltipOpen" placement="top">
    <!-- Tooltip title changes based on fullscreen state -->
    <template #title>
      {{ isFullscreen ? "Свернуть" : "Открыть во весь экран" }}
    </template>

    <!-- Render the appropriate fullscreen icon based on the current state -->
    <component
      :is="isFullscreen ? FullscreenExitOutlined : FullscreenOutlined"
      @click="toggleFullscreen"
    />
  </a-tooltip>
</template>
