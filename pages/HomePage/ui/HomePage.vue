<template>
  <a-card title="Вход в приложение Этикетка продукта">
    <main class="login-user__container">
      <div class="login-user__logo-section">
        <div class="login-user__logo">Этикетка</div>
      </div>

      <div class="login-user__list-section">
        <a-list
          bordered
          class="login-user__list"
          ghost
          item-layout="horizontal"
          :data-source="list"
        >
          <template #renderItem="{ item }">
            <a-list-item @click="goToUserScreen(item)">
              <a-list-item-meta description="Повар">
                <template #title>
                  {{ getFormattedName(item) }}
                </template>
                <template #avatar>
                  <a-avatar
                    :style="{
                      backgroundColor: getColorFromId(
                        item.user_first_name,
                        item.user_surname,
                      ),
                    }"
                  >
                    {{ !item.avatar ? getInitials(item) : "" }}
                  </a-avatar>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
          <div v-if="list.length === 0" class="login-user__list-refresh">
            <a-typography-title :level="4"
              >Пользователей нет</a-typography-title
            >
            <a-button type="primary" block @click="init"
              >Попробывать еще раз</a-button
            >
          </div>
        </a-list>
      </div>
    </main>
    <a-card-meta>
      <template #description>
        <article class="login-user__footer">
          <div
            style="display: flex; flex-direction: column; align-items: center"
          >
            <div>
              <a-typography-text>
                © 2024 Все права защищены
              </a-typography-text>

              <a-typography-text type="secondary"
                >Версия приложения: 0.0.3</a-typography-text
              >
            </div>
            <a-typography-link href="#" target="_self"
              >FS-TECHNOLOGY</a-typography-link
            >
          </div>
        </article></template
      >
    </a-card-meta>
  </a-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getUserCookes, getCreatedUsers } from "../api";

const list = ref([]);
const router = useRouter();

const init = async () => {
  list.value = await getCreatedUsers();
};

onMounted(async () => {
  await init();
});

// Generates a consistent color based on user ID
const getColorFromId = (id: string, id2: string): string => {
  let hash = 0;
  const combinedString = id + id2;

  for (let i = 0; i < combinedString.length; i++) {
    hash = combinedString.charCodeAt(i) + ((hash << 5) - hash);
  }

  hash = Math.abs(hash);

  const color = `hsl(${hash % 360}, 70%, 75%)`;
  return color;
};

const getFormattedName = (user) => {
  const firstInitial = user.user_first_name.charAt(0).toUpperCase();
  const patronymicInitial = user.user_patronymic.charAt(0).toUpperCase();

  return `${user.user_surname} ${firstInitial}.${patronymicInitial}.`;
};

// Returns user initials for the avatar
const getInitials = (user) => {
  const firstInitial = user.user_first_name.charAt(0).toUpperCase();
  const patronymicInitial = user.user_patronymic.charAt(0).toUpperCase();
  return `${firstInitial}${patronymicInitial}`;
};

const goToUserScreen = async (user) => {
  const token = await getUserCookes(user.id);
  localStorage.setItem("token", token);
  router.push({ name: "screen" });
};
</script>

<style lang="scss">
.login-user__container {
  .ant-avatar {
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
  }

  .ant-avatar-string {
    font-size: 32px !important;
  }
}

.login-user {
  &__container {
    display: flex;
    height: 75vh;
    aspect-ratio: 1.618 / 1;
    background-color: #f5f5f5;
  }

  &__footer {
    .ant-typography {
      font-size: 10px;
    }

    text-align: center;
  }

  &__logo-section {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
  }

  &__logo {
    width: 200px;
    font-size: 48px !important;
    height: auto;
  }

  &__list-section {
    width: 100%;
    padding: 20px;
    display: flex;
    background-color: white;
    justify-content: center;
    align-items: center;
  }

  &__list {
    overflow-y: auto;
    height: 100%;
    width: 100%;
  }

  &__list-refresh {
    margin-top: 32px;
    width: max-content;
    margin: auto;
  }
}
</style>
