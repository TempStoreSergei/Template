<template>
  <div class="counter">
    <a-button type="dashed" class="counter__button" @click="handleDecrement">
      <template #icon>
        <MinusOutlined />
      </template>
    </a-button>
    <transition
      name="fade"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <span :key="count" class="counter__number">{{ count }}</span>
    </transition>
    <a-button type="dashed" class="counter__button" @click="handleIncrement">
      <template #icon>
        <PlusOutlined />
      </template>
    </a-button>
  </div>
</template>

<script setup>
import { Button as AButton } from "ant-design-vue";

const props = defineProps({
  count: {
    type: Number,
  },
});

const emit = defineEmits(["update", "delete"]);
const handleIncrement = () => {
  const value = props.count + 1;
  emit("update", value); // Emit event for increment
};

const handleDecrement = () => {
  const value = props.count - 1;
  if (value > 0) {
    emit("update", value); // Emit event for decrement
  } else {
    emit("delete");
  }
};

// Transition hooks
const beforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = "scale(0.8)";
};

const enter = (el, done) => {
  el.offsetHeight; // trigger reflow
  el.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  el.style.opacity = 1;
  el.style.transform = "scale(1)";
  done();
};

const leave = (el, done) => {
  el.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  el.style.opacity = 0;
  el.style.transform = "scale(0.8)";
  done();
};
</script>

<style scoped lang="scss">
.counter {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff; // White background
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Subtle shadow

  &__button {
    font-size: 1.5rem;
    border-radius: 50%;
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__number {
    font-size: 2rem;
    font-weight: bold;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: scale(0.8);
}
</style>
