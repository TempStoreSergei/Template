<template>
  <div class="users-manager">
    <!-- Header -->
    <div class="manager-header">
      <div class="header-title">
        <md-icon>people</md-icon>
        <h2>Пользователи</h2>
      </div>
      <div class="header-actions">
        <md-filled-button @click="showCreateDialog = true">
          <md-icon slot="icon">person_add</md-icon>
          Добавить пользователя
        </md-filled-button>
      </div>
    </div>

    <!-- Users Grid -->
    <div class="users-grid">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="user-card"
      >
        <div class="card-header">
          <div class="user-avatar">
            <md-icon>person</md-icon>
          </div>
          <div class="user-info">
            <h3>{{ user.userSurname }} {{ user.userFullname }}</h3>
            <p v-if="user.userPatronymic">{{ user.userPatronymic }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!filteredUsers.length" class="empty-state">
        <div class="empty-icon">
          <md-icon>people</md-icon>
        </div>
        <h3>Нет пользователей</h3>
        <p>Добавьте первого пользователя</p>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <md-dialog :open="showCreateDialog">
      <div slot="headline">Новый пользователь</div>

      <form slot="content" @submit.prevent="saveUser">
        <md-outlined-text-field
          v-model="form.userSurname"
          label="Фамилия"
          required
          class="form-field"
        />
        <md-outlined-text-field
          v-model="form.userFullname"
          label="Имя"
          required
          class="form-field"
        />
        <md-outlined-text-field
          v-model="form.userPatronymic"
          label="Отчество"
          class="form-field"
        />
      </form>

      <div slot="actions">
        <md-text-button @click="closeDialog">Отмена</md-text-button>
        <md-filled-button @click="saveUser" :disabled="!isFormValid">
          Создать
        </md-filled-button>
      </div>
    </md-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, watch, defineEmits } from "vue";
import type { User } from "../model/types";

const emit = defineEmits(["add-user"]);

// Props
const props = defineProps<{
  users: Partial<User>[];
}>();

// State
const users = ref<Partial<User>[]>(props.users);
const searchQuery = ref("");
const showCreateDialog = ref(false);

// Form
const form = ref({
  userFullname: "",
  userSurname: "",
  userPatronymic: "",
});

watch(
  () => props.users,
  (newUsers) => {
    users.value = newUsers || [];
  },
  { immediate: true },
);

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value || [];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.userFullname?.toLowerCase().includes(query) ||
        u.userSurname?.toLowerCase().includes(query),
    );
  }

  return filtered;
});

const isFormValid = computed(() => {
  return form.value.userFullname.trim() && form.value.userSurname.trim();
});

const saveUser = () => {
  if (!isFormValid.value) return;

  emit("add-user", {
    id: `new_${Date.now()}_${Math.random()}`,
    ...form.value,
  });

  closeDialog();
};

const closeDialog = () => {
  showCreateDialog.value = false;
  form.value = {
    userFullname: "",
    userSurname: "",
    userPatronymic: "",
  };
};
</script>

<style lang="scss" scoped>
.users-manager {
  padding: 20px;
}

.manager-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  .header-title {
    display: flex;
    align-items: center;
    gap: 12px;

    md-icon {
      color: #1a73e8;
      font-size: 28px;
    }

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: #3c4043;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.user-card {
  background: #fff;
  border: 1px solid #dadce0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: #1a73e8;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #e8f0fe;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      md-icon {
        color: #1a73e8;
        font-size: 24px;
      }
    }

    .user-info {
      flex: 1;

      h3 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 500;
        color: #3c4043;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: #5f6368;
      }
    }
  }
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;

  .empty-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #f1f3f4;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;

    md-icon {
      font-size: 32px;
      color: #5f6368;
    }
  }

  h3 {
    font-size: 18px;
    font-weight: 400;
    color: #3c4043;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: #5f6368;
    margin: 0;
  }
}

.form-field {
  width: 100%;
  margin-bottom: 16px;
}

md-dialog {
  --md-dialog-container-shape: 12px;

  form {
    display: flex;
    flex-direction: column;
    min-width: 480px;
  }
}
</style> 