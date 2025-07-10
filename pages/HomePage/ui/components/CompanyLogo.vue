<template>
  <div class="company-logo">
    <div class="logo-icon">🍽️</div>
  </div>
</template>

<script lang="ts" setup>
// Простой компонент логотипа без props
</script>

<style scoped>
.company-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4285f4 0%, #1a73e8 100%);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
  margin-bottom: 8px;
}

.logo-icon {
  font-size: 36px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

@media (max-width: 480px) {
  .company-logo {
    width: 60px;
    height: 60px;
  }
  
  .logo-icon {
    font-size: 28px;
  }
}
</style>
  