<template>
  <div class="sign-in-with-google">
    <div class="account-choice-box">
      <!-- Header section with Google branding -->
      <div class="header-section">
        <div class="title-contents">
          <span class="signin-title">fs-tchnology</span>
        </div>
        <md-divider></md-divider>
      </div>

      <!-- Main content section -->
      <div class="main-content">
        <div class="header" :class="headerClassName">
          <CompanyLogo />
          <div class="header-text">
            <h1 class="choose-account-title">Выберите аккаунт</h1>
            <p class="continue-text">
              для входа в <span class="company-name">Этикикту</span>
            </p>
          </div>
        </div>

        <!-- Accounts list using Material Web -->
        <div class="accounts-wrapper">

          <md-list>
            <!-- User accounts from API -->
            <md-list-item
              v-for="user in users"
              :key="user.id"
              type="button"
              @click="handleAccountSelect(user)"
              class="account-option"
            >
              <div 
                slot="start" 
                class="user-avatar" 
                :style="{ backgroundColor: getColorFromName(user) }"
              >
                {{ getInitials(user) }}
              </div>
              <div slot="headline">{{ getFormattedName(user) }}</div>
              <div slot="supporting-text">Повар</div>
              <!-- Chevron Right SVG -->
              <svg slot="end" class="chevron-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </md-list-item>
          </md-list>
        </div>
      </div>
    </div>

    <!-- Footer with Material Web buttons -->
    <div class="footer" :class="footerClassName">
      <div class="footer-buttons">
        <md-text-button>Справка</md-text-button>
        <md-text-button>Конфиденциальность</md-text-button>
        <md-text-button>Условия</md-text-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
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

// Props
const props = defineProps<{
  headerClassName?: string;
  footerClassName?: string;
}>();

// State
const users = ref<User[]>([]);
const router = useRouter();

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
  try {
    const sessionToken = await getUserCookes(user.id);
    localStorage.setItem("token", sessionToken);
    router.push({ name: "screen" });
  } catch (error) {
    console.error("Ошибка входа:", error);
  }
};

const handleUseAnotherAccount = () => {
  console.log("Выбрать другой аккаунт");
  // Здесь можно добавить логику для добавления нового аккаунта
};

// Helper functions
const getColorFromName = (user: User): string => {
  let hash = 0;
  const name = `${user.userFullname}${user.userSurname}`;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 45%, 65%)`;
};

const getFormattedName = (user: User): string => {
  const firstInitial = user.userFullname.charAt(0).toUpperCase();
  const patronymicInitial = user.userPatronymic.charAt(0).toUpperCase();
  return `${user.userSurname} ${firstInitial}. ${patronymicInitial}.`;
};

const getInitials = (user: User): string => {
  const firstInitial = user.userFullname.charAt(0).toUpperCase();
  const patronymicInitial = user.userPatronymic.charAt(0).toUpperCase();
  return `${firstInitial}${patronymicInitial}`;
};

// Lifecycle
onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.sign-in-with-google {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  font-family: 'Roboto', 'Segoe UI', Tahoma, sans-serif;
}

.account-choice-box {
  width: 100%;
  background: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-section {
  padding: 16px 24px 0;
}

.title-contents {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0 16px;
}

.google-icon {
  flex-shrink: 0;
}

.signin-title {
  color: #5f6368;
  font-size: 14px;
  font-weight: 400;
  margin: 0;
}

md-divider {
  --md-divider-color: #dadce0;
}

.main-content {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.header-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.choose-account-title {
  font-size: 24px;
  font-weight: 400;
  color: #202124;
  margin: 0;
  line-height: 1.3;
}

.continue-text {
  font-size: 16px;
  color: #5f6368;
  margin: 0;
  line-height: 1.5;
}

.company-name {
  color: #1a73e8;
  font-weight: 500;
}

.accounts-wrapper {
  overflow-y: auto;
  height: 156px;
  width: 100%;
}

md-list {
  --md-list-container-color: transparent;
  width: 100%;
}

md-list-item {
  --md-list-item-container-shape: 0;
  --md-list-item-one-line-container-height: 64px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 1px;
}

md-list-item:hover {
  --md-list-item-hover-state-layer-color: #f8f9fa;
  --md-list-item-hover-state-layer-opacity: 1;
}

.account-option:not(:last-child) {
  border-bottom: 1px solid #e8eaed;
}

.add-account {
  --md-list-item-label-text-color: #1a73e8;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.chevron-icon {
  color: #5f6368;
  flex-shrink: 0;
}

.person-add-icon {
  color: #1a73e8;
  flex-shrink: 0;
}

.footer {
  width: 100%;
}

.footer-buttons {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 8px;
}

md-text-button {
  --md-text-button-label-text-color: #5f6368;
  --md-text-button-label-text-size: 12px;
  --md-text-button-container-shape: 4px;
}

md-text-button:hover {
  --md-text-button-hover-state-layer-color: #5f6368;
  --md-text-button-hover-state-layer-opacity: 0.08;
}

/* Responsive design */
@media (max-width: 480px) {
  .sign-in-with-google {
    max-width: 100%;
    margin: 0;
  }
  
  .main-content {
    padding: 24px 16px;
  }
  
  .header-section {
    padding: 12px 16px 0;
  }
  
  .footer-buttons {
    gap: 16px;
    flex-wrap: wrap;
  }
}
</style>
  