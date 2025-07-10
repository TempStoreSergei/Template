<template>
  <div class="home-page">
    <div class="hero-section">
      <md-icon class="hero-icon">label</md-icon>
      <h1>Создатель этикеток</h1>
      <p>Создавайте и управляйте шаблонами этикеток</p>
      
      <div class="action-buttons">
        <md-filled-button @click="goToTemplates" class="primary-button">
          <md-icon slot="icon">folder_open</md-icon>
          Мои шаблоны
        </md-filled-button>
        
        <md-outlined-button @click="goToSettings" class="secondary-button">
          <md-icon slot="icon">settings</md-icon>
          Настройки
        </md-outlined-button>
      </div>
    </div>

    <div class="features-section">
      <md-card class="feature-card">
        <div class="card-content">
          <md-icon class="feature-icon">create_new_folder</md-icon>
          <h3>Организация</h3>
          <p>Создавайте папки и упорядочивайте шаблоны</p>
        </div>
      </md-card>

      <md-card class="feature-card">
        <div class="card-content">
          <md-icon class="feature-icon">description</md-icon>
          <h3>Шаблоны</h3>
          <p>Создавайте и редактируйте файлы шаблонов</p>
        </div>
      </md-card>

      <md-card class="feature-card">
        <div class="card-content">
          <md-icon class="feature-icon">search</md-icon>
          <h3>Поиск</h3>
          <p>Быстро находите нужные шаблоны</p>
        </div>
      </md-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
const goToTemplates = () => {
  navigateTo('/screen')
}

const goToSettings = () => {
  navigateTo('/setting')
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 32px 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  padding: 48px 16px;
}

.hero-icon {
  font-size: 64px;
  color: var(--md-sys-color-primary);
}

h1 {
  font-size: 48px;
  font-weight: 600;
  margin: 0;
  color: var(--md-sys-color-on-surface);
}

p {
  font-size: 18px;
  color: var(--md-sys-color-on-surface-variant);
  margin: 0;
  max-width: 600px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.primary-button,
.secondary-button {
  min-width: 160px;
  --md-filled-button-container-height: 56px;
  --md-outlined-button-container-height: 56px;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-card {
  --md-elevated-card-container-shape: 16px;
  cursor: default;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 32px 24px;
}

.feature-icon {
  font-size: 48px;
  color: var(--md-sys-color-primary);
}

h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--md-sys-color-on-surface);
}

.card-content p {
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
}

@media (max-width: 768px) {
  h1 {
    font-size: 36px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .primary-button,
  .secondary-button {
    width: 100%;
    max-width: 280px;
  }
}
</style>
