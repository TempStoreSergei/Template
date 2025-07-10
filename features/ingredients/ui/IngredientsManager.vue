<template>
  <div class="ingredients-manager">
    <!-- Header -->
    <div class="manager-header">
      <div class="header-title">
        <md-icon>restaurant</md-icon>
        <h2>Ингредиенты</h2>
      </div>
      <!-- <md-filled-button @click="showCreateDialog = true">
        <md-icon slot="icon">add</md-icon>
        Добавить ингредиент
      </md-filled-button> -->
    </div>

    <!-- Search and Filters -->
    <div class="manager-filters">
      <md-outlined-text-field
        v-model="searchQuery"
        label="Поиск ингредиентов"
        class="search-field"
      >
        <md-icon slot="leading-icon">search</md-icon>
      </md-outlined-text-field>
      
      <md-outlined-select
        v-model="selectedUnit"
        label="Фильтр по единице"
        class="unit-filter"
      >
        <md-select-option value="">Все единицы</md-select-option>
        <md-select-option 
          v-for="unit in units" 
          :key="unit.id" 
          :value="unit.id"
        >
          {{ unit.unitFullname }} ({{ unit.unitShortname }})
        </md-select-option>
      </md-outlined-select>
    </div>

    <!-- Ingredients Grid -->
    <div class="ingredients-grid">
      <div 
        v-for="ingredient in filteredIngredients"
        :key="ingredient.id"
        class="ingredient-card"
      >
        <div class="card-header">
          <div class="ingredient-name">
            <md-icon>inventory_2</md-icon>
            <span>{{ ingredient.ingredientName }}</span>
          </div>
          <!-- <md-icon-button @click="editIngredient(ingredient)">
            <md-icon>edit</md-icon>
          </md-icon-button> -->
        </div>
        
        <div class="card-content">
          <div class="ingredient-weight">
            <strong>{{ ingredient.ingredientWeight }}</strong>
          </div>
          <div class="ingredient-unit">
            <span>{{ ingredient.unit }}</span>
          </div>
        </div>
        
        <!-- <div class="card-actions">
          <md-text-button @click="editIngredient(ingredient)">
            <md-icon slot="icon">edit</md-icon>
            Изменить
          </md-text-button>
          <md-text-button @click="deleteIngredient(ingredient.id)" class="delete-btn">
            <md-icon slot="icon">delete</md-icon>
            Удалить
          </md-text-button>
        </div> -->
      </div>

      <!-- Empty State -->
      <div v-if="filteredIngredients.length === 0" class="empty-state">
        <div class="empty-icon">
          <md-icon>restaurant</md-icon>
        </div>
        <h3>{{ searchQuery ? 'Ингредиенты не найдены' : 'Нет ингредиентов' }}</h3>
        <p>{{ searchQuery ? 'Попробуйте изменить условия поиска' : 'Добавьте первый ингредиент' }}</p>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <md-dialog :open="showCreateDialog || !!editingIngredient">
      <div slot="headline">
        {{ editingIngredient ? 'Редактировать ингредиент' : 'Новый ингредиент' }}
      </div>
      
      <form slot="content" @submit.prevent="saveIngredient">
        <md-outlined-text-field
          v-model="form.ingredientName"
          label="Название ингредиента"
          required
          class="form-field"
        />
        
        <md-outlined-text-field
          v-model.number="form.ingredientWeight"
          label="Количество"
          type="number"
          step="0.01"
          min="0"
          required
          class="form-field"
        />
        
        <md-outlined-select
          v-model="form.unitId"
          label="Единица измерения"
          required
          class="form-field"
        >
          <md-select-option 
            v-for="unit in units" 
            :key="unit.id" 
            :value="unit.id"
          >
            {{ unit.unitFullname }} ({{ unit.unitShortname }})
          </md-select-option>
        </md-outlined-select>
      </form>
      
      <div slot="actions">
        <md-text-button @click="closeDialog">Отмена</md-text-button>
        <md-filled-button @click="saveIngredient" :disabled="!isFormValid">
          {{ editingIngredient ? 'Сохранить' : 'Создать' }}
        </md-filled-button>
      </div>
    </md-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, defineProps, watch } from "vue";
import type { Ingredient } from "../model/types";
import type { Unit } from "~/features/units/model/types";
// import { ingredientsApi } from "../api";

// Props
const props = defineProps<{
  units: Unit[];
  ingredients: Ingredient[];
  itemId?: string;
}>();

// State
const ingredients = ref<Ingredient[]>(props.ingredients);
const searchQuery = ref("");
const selectedUnit = ref("");
const showCreateDialog = ref(false);
const editingIngredient = ref<Ingredient | null>(null);

watch(
  () => props.ingredients,
  (newIngredients) => {
    ingredients.value = newIngredients || [];
  },
  { immediate: true }
);

// Form
const form = ref({
  ingredientName: "",
  ingredientWeight: 0,
  unitId: "",
});

// Computed
const filteredIngredients = computed(() => {
  let filtered = ingredients.value;
  
  if (props.itemId) {
    filtered = filtered.filter(i => i.itemId === props.itemId);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(i => 
      i.ingredientName.toLowerCase().includes(query)
    );
  }
  
  if (selectedUnit.value) {
    filtered = filtered.filter(i => i.unitId === selectedUnit.value);
  }
  
  return filtered;
});

const isFormValid = computed(() => {
  return form.value.ingredientName.trim() &&
         form.value.ingredientWeight > 0 &&
         form.value.unitId;
});

// Methods
/* const loadIngredients = async () => {
  try {
    ingredients.value = await ingredientsApi.getAll();
  } catch (error) {
    console.error("Error loading ingredients:", error);
  }
}; */

const getUnitShortName = (unitId: string): string => {
  const unit = props.units.find(u => u.id === unitId);
  return unit?.unitShortname || "";
};

const getUnitFullName = (unitId: string): string => {
  const unit = props.units.find(u => u.id === unitId);
  return unit?.unitFullname || "";
};

const editIngredient = (ingredient: Ingredient) => {
  editingIngredient.value = ingredient;
  form.value = {
    ingredientName: ingredient.ingredientName,
    ingredientWeight: ingredient.ingredientWeight,
    unitId: ingredient.unitId,
  };
  showCreateDialog.value = true;
};

/* const saveIngredient = async () => {
  if (!isFormValid.value) return;

  try {
    const request: CreateIngredientRequest = {
      ...form.value,
      itemId: props.itemId,
    };

    if (editingIngredient.value) {
      await ingredientsApi.update({
        id: editingIngredient.value.id,
        ...request,
      });
    } else {
      await ingredientsApi.create(request);
    }

    await loadIngredients();
    closeDialog();
  } catch (error) {
    console.error("Error saving ingredient:", error);
  }
};

const deleteIngredient = async (id: string) => {
  if (!confirm("Удалить этот ингредиент?")) return;

  try {
    await ingredientsApi.delete(id);
    await loadIngredients();
  } catch (error) {
    console.error("Error deleting ingredient:", error);
  }
}; */

const closeDialog = () => {
  showCreateDialog.value = false;
  editingIngredient.value = null;
  form.value = {
    ingredientName: "",
    ingredientWeight: 0,
    unitId: "",
  };
};

// Lifecycle
/* onMounted(() => {
  loadIngredients();
}); */
</script>

<style lang="scss" scoped>
.ingredients-manager {
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
}

.manager-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  
  .search-field {
    flex: 1;
    min-width: 280px;
  }
  
  .unit-filter {
    min-width: 200px;
  }
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.ingredient-card {
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
    justify-content: space-between;
    margin-bottom: 12px;
    
    .ingredient-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: #3c4043;
      
      md-icon {
        color: #34a853;
        font-size: 20px;
      }
    }
  }
  
  .card-content {
    margin-bottom: 16px;
    
    .ingredient-weight {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 4px;
      
      strong {
        font-size: 18px;
        color: #1a73e8;
      }
      
      span {
        font-size: 14px;
        color: #5f6368;
      }
    }
    
    .ingredient-unit {
      font-size: 12px;
      color: #5f6368;
    }
  }
  
  .card-actions {
    display: flex;
    gap: 8px;
    
    .delete-btn {
      --md-text-button-label-text-color: #ea4335;
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
    min-width: 400px;
  }
}
</style> 