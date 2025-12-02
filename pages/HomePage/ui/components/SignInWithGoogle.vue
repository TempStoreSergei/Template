<template>
  <div class="sign-in-screen">
    <!-- Минималистичный фон -->
    <div class="background-pattern">
      <div class="pattern-grid"></div>
    </div>

    <!-- Основной контейнер с асимметричной компоновкой -->
    <div class="main-layout">

      <!-- Левая панель с брендингом -->
      <div class="brand-panel">
        <div class="brand-content">
          <CompanyLogo class="brand-logo" />
          <h1 class="brand-name">Этикетка</h1>
          <p class="brand-tagline">Система управления производством</p>
        </div>

        <div class="decorative-elements">
          <div class="circle-element circle-1"></div>
          <div class="circle-element circle-2"></div>
          <div class="circle-element circle-3"></div>
        </div>
      </div>

      <!-- Правая панель с пользователями -->
      <div class="users-panel">
        <div class="panel-header">
          <h2 class="greeting">Добрый день</h2>
          <p class="instruction">Выберите профиль для входа</p>
        </div>

        <!-- Сетка пользователей -->
        <div class="users-grid">
          <button
            v-for="user in users"
            :key="user.id"
            @click="handleAccountSelect(user)"
            @touchstart="handleTouchStart(user.id)"
            @touchend="handleTouchEnd"
            class="user-card"
            :class="{ 'user-card-pressed': selectedUserId === user.id }"
          >
            <div class="user-avatar" :style="{ backgroundColor: getUserColor(user) }">
              <span class="user-initials">{{ getInitials(user) }}</span>
            </div>
            <div class="user-details">
              <div class="user-name">{{ getFormattedName(user) }}</div>
              <div class="user-role">Повар</div>
            </div>
          </button>
        </div>

        <!-- Футер с информацией -->
        <div class="panel-footer">
          <div class="time-display">{{ currentTime }}</div>
          <div class="date-display">{{ currentDate }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import CompanyLogo from "./CompanyLogo.vue";
import { getCreatedUsers, getUserCookes } from "../../api";

interface User {
  id: string;
  userFullname: string;
  userName: string;
  userPatronymic: string;
  userSurname: string;
  avatar?: string;
}

// State
const users = ref<User[]>([]);
const router = useRouter();
const selectedUserId = ref<string | null>(null);
const currentTime = ref("");
const currentDate = ref("");

// Время и дата
const updateDateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
  currentDate.value = now.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};

let timeInterval: number;

// Methods
const loadUsers = async () => {
  try {
    const data = await getCreatedUsers();
    users.value = data;
  } catch (error) {
    console.error("Не удалось получить пользователей:", error);
  }
};

const handleAccountSelect = async (user: User) => {
  selectedUserId.value = user.id;

  // Анимация перед переходом
  setTimeout(async () => {
    try {
      const sessionToken = await getUserCookes(user.id);
      localStorage.setItem("token", sessionToken);
      router.push({ name: "screen" });
    } catch (error) {
      console.error("Ошибка входа:", error);
      selectedUserId.value = null;
    }
  }, 200);
};

const handleAddAccount = () => {
  console.log("Добавить нового пользователя");
};

// Touch handlers
const handleTouchStart = (userId: string) => {
  selectedUserId.value = userId;
};

const handleTouchEnd = () => {
  setTimeout(() => {
    selectedUserId.value = null;
  }, 100);
};

// Helper functions
const getUserColor = (user: User): string => {
  // Палитра приглушенных цветов в стиле Google
  const colors = [
    '#4285F4', // Google Blue
    '#34A853', // Google Green
    '#FBBC04', // Google Yellow
    '#EA4335', // Google Red
    '#9E9E9E', // Grey
    '#607D8B', // Blue Grey
    '#795548', // Brown
    '#FF6F00', // Amber
  ];

  let hash = 0;
  const name = `${user.userFullname}${user.userSurname}`;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

const getFormattedName = (user: User): string => {
  const firstInitial = user.userFullname.charAt(0).toUpperCase();
  const patronymicInitial = user.userPatronymic.charAt(0).toUpperCase();
  return `${user.userSurname} ${firstInitial}.${patronymicInitial}.`;
};

const getInitials = (user: User): string => {
  const firstInitial = user.userFullname.charAt(0).toUpperCase();
  const surnameInitial = user.userSurname.charAt(0).toUpperCase();
  return `${surnameInitial}${firstInitial}`;
};

// Lifecycle
onMounted(() => {
  loadUsers();
  updateDateTime();
  timeInterval = setInterval(updateDateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.sign-in-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Google Sans', 'Roboto', 'Segoe UI', -apple-system, sans-serif;
  background: #f8f9fa;
}

/* Фоновый паттерн */
.background-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  pointer-events: none;
}

.pattern-grid {
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(0deg, #202124 1px, transparent 1px),
    linear-gradient(90deg, #202124 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Основная компоновка */
.main-layout {
  display: flex;
  height: 100%;
  position: relative;
}

/* Левая панель с брендингом */
.brand-panel {
  flex: 0 0 45%;
  background: linear-gradient(135deg, #ffffff 0%, #f1f3f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-right: 1px solid #e8eaed;
}

.brand-content {
  text-align: center;
  z-index: 2;
  position: relative;
}

.brand-logo {
  width: 120px;
  height: 120px;
  margin: 0 auto 32px;
  filter: grayscale(20%);
}

.brand-name {
  font-size: 48px;
  font-weight: 400;
  color: #202124;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.brand-tagline {
  font-size: 18px;
  color: #5f6368;
  font-weight: 300;
}

/* Декоративные элементы */
.decorative-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle-element {
  position: absolute;
  border-radius: 50%;
  opacity: 0.05;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: #4285F4;
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  background: #34A853;
  bottom: -50px;
  left: 100px;
}

.circle-3 {
  width: 150px;
  height: 150px;
  background: #FBBC04;
  top: 50%;
  right: -75px;
}

/* Правая панель с пользователями */
.users-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 60px;
  background: #ffffff;
  overflow-y: auto;
}

.panel-header {
  margin-bottom: 48px;
}

.greeting {
  font-size: 32px;
  font-weight: 400;
  color: #202124;
  margin-bottom: 8px;
}

.instruction {
  font-size: 16px;
  color: #5f6368;
}

/* Сетка пользователей */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  flex: 1;
  align-content: start;
}

/* Карточка пользователя */
.user-card {
  background: #ffffff;
  border: 2px solid #e8eaed;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 200px;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent, rgba(66, 133, 244, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.user-card:hover {
  border-color: #dadce0;
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.user-card:hover::before {
  opacity: 1;
}

.user-card:active,
.user-card-pressed {
  transform: scale(0.98);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

/* Аватар пользователя */
.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  font-weight: 400;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.user-initials {
  letter-spacing: 1px;
}

/* Детали пользователя */
.user-details {
  text-align: center;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  color: #202124;
  margin-bottom: 4px;
}

.user-role {
  font-size: 14px;
  color: #5f6368;
}

/* Карточка добавления */
.add-card {
  border-style: dashed;
  background: #fafafa;
}

.add-card:hover {
  background: #f8f9fa;
  border-color: #4285F4;
}

.add-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8f0fe;
  border-radius: 50%;
}

.add-icon svg {
  color: #4285F4;
}

.add-text {
  font-size: 16px;
  color: #4285F4;
  font-weight: 500;
}

/* Футер панели */
.panel-footer {
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e8eaed;
  position: fixed;
  bottom: 0;
  width: 50vw;
  background: #ffffff;
}

.time-display {
  font-size: 28px;
  font-weight: 300;
  color: #202124;
}

.date-display {
  font-size: 16px;
  color: #5f6368;
}

/* Альтернативная компоновка для широких экранов */
@media (min-width: 1920px) {
  .users-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  .user-card {
    min-height: 220px;
  }

  .user-avatar {
    width: 90px;
    height: 90px;
    font-size: 32px;
  }
}

/* Компоновка для квадратных экранов */
@media (max-aspect-ratio: 4/3) {
  .brand-panel {
    flex: 0 0 35%;
  }

  .users-panel {
    padding: 40px;
  }

  .users-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
}

/* Анимации при загрузке */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-card {
  animation: fadeIn 0.5s ease-out backwards;
}

.user-card:nth-child(1) { animation-delay: 0.1s; }
.user-card:nth-child(2) { animation-delay: 0.2s; }
.user-card:nth-child(3) { animation-delay: 0.3s; }
.user-card:nth-child(4) { animation-delay: 0.4s; }
.user-card:nth-child(5) { animation-delay: 0.5s; }
.user-card:nth-child(6) { animation-delay: 0.6s; }

.brand-content {
  animation: fadeIn 0.8s ease-out;
}
</style>