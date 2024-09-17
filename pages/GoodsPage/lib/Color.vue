<template>
  <a-avatar-group :max-count="5">
    <a-avatar
      v-for="element in elements"
      :key="element.titleId"
      :style="getAvatarStyle(element.color, isSelected(element.titleId))"
      @click="handleColorChange(element.titleId)"
    />
  </a-avatar-group>
</template>

<script setup lang="ts">
defineOptions({
  name: "ColorUpload",
  inheritAttrs: false,
});

const modelValue = defineModel<string>("value");

const elements = [
  {
    color: ["#FF5733", "#33FF57"],
    titleId: "default",
  },
  {
    color: ["#FFD700", "#ADFF2F"],
    titleId: "green",
  },
  {
    color: ["#33A1FF", "#FF33A1"],
    titleId: "raspberry",
  },
  {
    color: ["#FF6347", "#4682B4"],
    titleId: "police",
  },
  {
    color: ["#DAA520", "#5F9EA0"],
    titleId: "taxi",
  },
];

// Function to get the avatar style
const getAvatarStyle = (
  [color1, color2]: [string, string],
  isSelected: boolean,
) => ({
  background: `linear-gradient(45deg, ${color1} 50%, ${color2} 50%)`,
  width: "40px",
  height: "40px",
  cursor: "pointer",
  border: isSelected ? "2px solid #1890ff" : "", // Highlight selected avatar
  boxShadow: isSelected ? "0 0 0 2px rgba(24, 144, 255, 0.2)" : "none",
});

// Check if the index is selected
const isSelected = (index: string) => index === modelValue.value;

// Handle the color selection
const handleColorChange = (index: string) => {
  modelValue.value = index;
};
</script>
