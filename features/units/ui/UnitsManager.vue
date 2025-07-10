<template>
  <div class="units-manager">
    <!-- Header -->
    <div class="manager-header">
      <div class="header-title">
        <md-icon>straighten</md-icon>
        <h2>Единицы измерения</h2>
      </div>
      <!-- <div class="header-actions">
        <md-outlined-button @click="createDemoUnits" v-if="units.length === 0">
          <md-icon slot="icon">rule</md-icon>
          Демо-единицы
        </md-outlined-button>
        <md-filled-button @click="showCreateDialog = true">
          <md-icon slot="icon">add</md-icon>
          Добавить единицу
        </md-filled-button>
      </div> -->
    </div>

    <!-- Search and Filters -->
    <div class="manager-filters">
      <md-outlined-text-field
        v-model="searchQuery"
        label="Поиск единиц"
        class="search-field"
      >
        <md-icon slot="leading-icon">search</md-icon>
      </md-outlined-text-field>
      
      <md-outlined-select
        v-model="selectedType"
        label="Фильтр по типу"
        class="type-filter"
        disabled
      >
        <md-select-option value="">Все типы</md-select-option>
        <md-select-option value="weight">Вес</md-select-option>
        <md-select-option value="volume">Объем</md-select-option>
        <md-select-option value="count">Количество</md-select-option>
        <md-select-option value="length">Длина</md-select-option>
      </md-outlined-select>

      <md-outlined-select
        v-model="statusFilter"
        label="Статус"
        class="status-filter"
        disabled
      >
        <md-select-option value="">Все</md-select-option>
        <md-select-option value="active">Активные</md-select-option>
        <md-select-option value="inactive">Неактивные</md-select-option>
      </md-outlined-select>
    </div>

    <!-- Units Grid -->
    <div class="units-grid">
      <div 
        v-for="unit in filteredUnits"
        :key="unit.id"
        class="unit-card"
        :class="{ inactive: unit.isActive === false }"
      >
        <div class="card-header">
          <div class="unit-icon" :class="`type-${unit.unitType}`">
            <md-icon>{{ getTypeIcon(unit.unitType) }}</md-icon>
          </div>
          <div class="unit-info">
            <h3>{{ unit.unitFullname }}</h3>
            <div class="unit-short">{{ unit.unitShortname }}</div>
            <div class="unit-type">{{ getTypeLabel(unit.unitType) }}</div>
          </div>
          <!-- <div class="card-actions">
            <md-icon-button @click="editUnit(unit)" title="Редактировать">
              <md-icon>edit</md-icon>
            </md-icon-button>
            <md-icon-button 
              @click="toggleUnitStatus(unit.id)" 
              :title="unit.isActive ? 'Деактивировать' : 'Активировать'"
            >
              <md-icon>{{ unit.isActive ? 'toggle_on' : 'toggle_off' }}</md-icon>
            </md-icon-button>
          </div> -->
        </div>
        
        <div class="card-content">
          <div v-if="typeof unit.isActive !== 'undefined'" class="unit-status">
            <md-chip 
              :class="unit.isActive ? 'status-active' : 'status-inactive'"
              label
            >
              {{ unit.isActive ? 'Активна' : 'Неактивна' }}
            </md-chip>
          </div>
          
          <div v-if="unit.unitType" class="usage-info">
            <md-icon>info</md-icon>
            <span>Используется для измерения {{ getTypeDescription(unit.unitType) }}</span>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="created-date">
            Создана: {{ formatDate(unit.createdAt) }}
          </div>
          <!-- <md-text-button @click="deleteUnit(unit.id)" class="delete-btn">
            <md-icon slot="icon">delete</md-icon>
            Удалить
          </md-text-button> -->
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredUnits.length === 0" class="empty-state">
        <div class="empty-icon">
          <md-icon>straighten</md-icon>
        </div>
        <h3>{{ searchQuery ? 'Единицы не найдены' : 'Нет единиц измерения' }}</h3>
        <p>{{ searchQuery ? 'Попробуйте изменить условия поиска' : 'Добавьте первую единицу измерения' }}</p>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <md-dialog :open="showCreateDialog || !!editingUnit">
      <div slot="headline">
        {{ editingUnit ? 'Редактировать единицу' : 'Новая единица измерения' }}
      </div>
      
      <form slot="content" @submit.prevent="saveUnit">
        <md-outlined-text-field
          v-model="form.unitFullname"
          label="Полное название"
          required
          class="form-field"
        />
        
        <md-outlined-text-field
          v-model="form.unitShortname"
          label="Сокращение"
          required
          class="form-field"
        />
        
        <md-outlined-select
          v-model="form.unitType"
          label="Тип измерения"
          required
          class="form-field"
        >
          <md-select-option value="weight">Вес</md-select-option>
          <md-select-option value="volume">Объем</md-select-option>
          <md-select-option value="count">Количество</md-select-option>
          <md-select-option value="length">Длина</md-select-option>
        </md-outlined-select>
      </form>
      
      <div slot="actions">
        <md-text-button @click="closeDialog">Отмена</md-text-button>
        <md-filled-button @click="saveUnit" :disabled="!isFormValid">
          {{ editingUnit ? 'Сохранить' : 'Создать' }}
        </md-filled-button>
      </div>
    </md-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, watch } from "vue";
import type { Unit } from "../model/types";
// import { unitsApi } from "../api";

// Props
const props = defineProps<{
  units: Partial<Unit>[];
}>();

// State
const units = ref<Partial<Unit>[]>(props.units);
const searchQuery = ref("");
const selectedType = ref("");
const statusFilter = ref("");
const showCreateDialog = ref(false);
const editingUnit = ref<Unit | null>(null);

// Form
const form = ref({
  unitFullname: "",
  unitShortname: "",
  unitType: "weight" as "weight" | "volume" | "count" | "length",
});

watch(
  () => props.units,
  (newUnits) => {
    units.value = newUnits || [];
  },
  { immediate: true },
);

// Computed
const filteredUnits = computed(() => {
  let filtered = units.value || [];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(u => 
      u.unitFullname?.toLowerCase().includes(query) ||
      u.unitShortname?.toLowerCase().includes(query)
    );
  }
  
  if (selectedType.value) {
    filtered = filtered.filter(u => u.unitType === selectedType.value);
  }
  
  if (statusFilter.value) {
    const isActive = statusFilter.value === "active";
    filtered = filtered.filter((u) => u.isActive === isActive);
  }
  
  return filtered;
});

const isFormValid = computed(() => {
  return form.value.unitFullname.trim() &&
         form.value.unitShortname.trim() &&
         form.value.unitType;
});

// Methods
/*
const loadUnits = async () => {
  try {
    units.value = await unitsApi.getAll();
  } catch (error) {
    console.error("Error loading units:", error);
  }
};
*/

const getTypeIcon = (type?: string): string => {
  if (!type) return "help";
  const icons: { [key: string]: string } = {
    weight: "scale",
    volume: "water_drop",
    count: "tag",
    length: "straighten",
  };
  return icons[type] || "help";
};

const getTypeLabel = (type?: string): string => {
  if (!type) return "Неизвестно";
  const labels: { [key: string]: string } = {
    weight: "Вес",
    volume: "Объем",
    count: "Количество",
    length: "Длина",
  };
  return labels[type] || type;
};

const getTypeDescription = (type: string): string => {
  const descriptions: { [key: string]: string } = {
    weight: "массы продуктов",
    volume: "жидкостей и объемов",
    count: "количества штук",
    length: "длины и размеров",
  };
  return descriptions[type] || "различных параметров";
};

const formatDate = (timestamp?: number): string => {
  if (!timestamp) return "N/A";
  return new Date(timestamp).toLocaleDateString("ru-RU");
};

const editUnit = (unit: Unit) => {
  editingUnit.value = unit;
  form.value = {
    unitFullname: unit.unitFullname,
    unitShortname: unit.unitShortname,
    unitType: unit.unitType,
  };
  showCreateDialog.value = true;
};

/*
const saveUnit = async () => {
  if (!isFormValid.value) return;

  try {
    const request: CreateUnitRequest = { ...form.value };

    if (editingUnit.value) {
      await unitsApi.update({
        id: editingUnit.value.id,
        ...request,
      });
    } else {
      await unitsApi.create(request);
    }

    await loadUnits();
    closeDialog();
  } catch (error) {
    console.error("Error saving unit:", error);
  }
};

const deleteUnit = async (id: string) => {
  if (!confirm("Удалить эту единицу измерения?")) return;

  try {
    await unitsApi.delete(id);
    await loadUnits();
  } catch (error) {
    console.error("Error deleting unit:", error);
  }
};

const toggleUnitStatus = async (id: string) => {
  try {
    await unitsApi.toggleActive(id);
    await loadUnits();
  } catch (error) {
    console.error("Error toggling unit status:", error);
  }
};

const createDemoUnits = async () => {
  try {
    await unitsApi.createDemoUnits();
    await loadUnits();
  } catch (error) {
    console.error("Error creating demo units:", error);
  }
};
*/

const closeDialog = () => {
  showCreateDialog.value = false;
  editingUnit.value = null;
  form.value = {
    unitFullname: "",
    unitShortname: "",
    unitType: "weight",
  };
};

// Lifecycle
/*
onMounted(() => {
  loadUnits();
});
*/
</script>

<style lang="scss" scoped>
.units-manager {
  padding: 24px;
}

.manager-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  
  .header-title {
    display: flex;
    align-items: center;
    gap: 16px;
    
    md-icon {
      color: var(--md-sys-color-primary, #6750a4);
      font-size: 32px;
    }
    
    h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 500;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }
  }
  
  .header-actions {
    display: flex;
    gap: 16px;
  }
}

.manager-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  
  .search-field {
    flex: 1;
    min-width: 320px;
  }
  
  .type-filter,
  .status-filter {
    min-width: 180px;
  }
}

.units-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.unit-card {
  background: var(--md-sys-color-surface-container-low, #f7f2fa);
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: var(--md-sys-elevation-2, 0 3px 6px rgba(0, 0, 0, 0.16));
    border-color: var(--md-sys-color-primary, #6750a4);
  }
  
  &.inactive {
    opacity: 0.7;
    background: var(--md-sys-color-surface-variant, #e7e0ec);
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    
    .unit-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.type-weight {
        background: var(--md-sys-color-primary-container, #eaddff);
        md-icon {
          color: var(--md-sys-color-on-primary-container, #21005d);
        }
      }
      
      &.type-volume {
        background: var(--md-sys-color-secondary-container, #e8def8);
        md-icon {
          color: var(--md-sys-color-on-secondary-container, #1d192b);
        }
      }
      
      &.type-count {
        background: var(--md-sys-color-tertiary-container, #ffd8e4);
        md-icon {
          color: var(--md-sys-color-on-tertiary-container, #31111d);
        }
      }
      
      &.type-length {
        background: var(--md-sys-color-error-container, #f9dedc);
        md-icon {
          color: var(--md-sys-color-on-error-container, #410e0b);
        }
      }
      
      md-icon {
        font-size: 28px;
      }
    }
    
    .unit-info {
      flex: 1;
      
      h3 {
        margin: 0 0 6px 0;
        font-size: 18px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface, #1d1b20);
      }
      
      .unit-short {
        font-size: 14px;
        font-weight: 600;
        color: var(--md-sys-color-primary, #6750a4);
        margin-bottom: 4px;
      }
      
      .unit-type {
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--md-sys-color-on-surface-variant, #49454f);
      }
    }
    
    .card-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .card-content {
    margin-bottom: 20px;
    
    .unit-status {
      margin-bottom: 16px;
      
      md-chip {
        &.status-active {
          --md-chip-container-color: var(--md-sys-color-primary-container, #eaddff);
          --md-chip-label-text-color: var(--md-sys-color-on-primary-container, #21005d);
        }
        
        &.status-inactive {
          --md-chip-container-color: var(--md-sys-color-error-container, #f9dedc);
          --md-chip-label-text-color: var(--md-sys-color-on-error-container, #410e0b);
        }
      }
    }
    
    .usage-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      
      md-icon {
        font-size: 18px;
      }
    }
  }
  
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    
    .created-date {
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
    
    .delete-btn {
      --md-text-button-label-text-color: var(--md-sys-color-error, #ba1a1a);
    }
  }
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--md-sys-color-surface-container-highest, #e6e0e9);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    
    md-icon {
      font-size: 40px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
  }
  
  h3 {
    font-size: 22px;
    font-weight: 400;
    color: var(--md-sys-color-on-surface, #1d1b20);
    margin: 0 0 12px 0;
  }
  
  p {
    font-size: 16px;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    margin: 0;
  }
}

.form-field {
  width: 100%;
  margin-bottom: 20px;
}

md-dialog {
  --md-dialog-container-shape: 16px;
  
  form {
    display: flex;
    flex-direction: column;
    min-width: 480px;
  }
}

md-filled-button {
  --md-filled-button-container-height: 56px;
  --md-filled-button-container-shape: 16px;
  font-size: 16px;
}

md-outlined-button {
  --md-outlined-button-container-height: 56px;
  --md-outlined-button-container-shape: 16px;
  font-size: 16px;
}

md-text-button {
  --md-text-button-container-height: 48px;
  --md-text-button-container-shape: 12px;
  font-size: 14px;
}

md-outlined-text-field {
  --md-outlined-text-field-container-shape: 12px;
  --md-outlined-text-field-container-height: 56px;
}

md-outlined-select {
  --md-outlined-select-text-field-container-shape: 12px;
  --md-outlined-select-text-field-container-height: 56px;
}

md-icon-button {
  --md-icon-button-size: 48px;
  --md-icon-button-state-layer-shape: 12px;
}
</style> 