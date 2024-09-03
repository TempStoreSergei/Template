<template>
  <div class="logo">
    <img class="logo__image" src="" alt="Logo" />
    <h2 v-show="!collapsed" class="logo__title">Кассир</h2>
  </div>
</template>

<script setup>
defineProps({
  collapsed: {
    type: Boolean,
  },
});
</script>

<style lang="scss">
.logo {
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;

  height: 64px;
  padding-left: 24px;
  line-height: 64px;

  &__image {
    height: 32px;
    margin-right: 8px;
  }

  &__title {
    margin: 0;
    font-size: 1.25rem;
    color: var(--app-primary-color);
  }
}
</style>
