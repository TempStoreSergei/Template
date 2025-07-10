<template>
  <div class="select-type-page">
    <!-- Top Navigation Bar -->
    <nav class="select-type-nav">
      <div class="nav-left">
        <div class="app-logo">
          <span>Шаблоны</span>
        </div>

        <div class="nav-search">
          <div class="search-box">
            <md-icon>search</md-icon>
            <input
              v-model="searchQuery"
              placeholder="Поиск шаблонов"
              class="search-input"
              @keydown.escape="searchQuery = ''"
              @keydown.enter="handleSearch"
            />
            <md-icon-button
              v-if="searchQuery"
              @click="searchQuery = ''"
              title="Очистить поиск"
              class="clear-search-btn"
            >
              <md-icon>close</md-icon>
            </md-icon-button>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <md-icon-button
          @click="toggleView"
          :title="`Переключить на ${viewMode === 'grid' ? 'список' : 'сетку'}`"
        >
          <md-icon>
            {{ viewMode === "grid" ? "view_list" : "grid_view" }}
          </md-icon>
        </md-icon-button>

        <md-icon-button
          title="Настройки"
          @click="showSettingsDialog = true"
        >
          <md-icon>settings</md-icon>
        </md-icon-button>
      </div>
    </nav>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <md-circular-progress indeterminate></md-circular-progress>
      <span>{{ loadingMessage }}</span>
    </div>

    <!-- Main Content Area -->
    <div class="select-type-main">
      <!-- Sidebar -->
      <aside class="select-type-sidebar">
        <md-filled-button
          @click="showCreateDialog = true"
          class="create-btn"
          :disabled="isLoading"
        >
          <md-icon>add</md-icon>
          Создать шаблон
        </md-filled-button>

        <div class="sidebar-menu">
          <div class="menu-section">
            <div class="menu-title">Управление</div>
            <button
              @click="setCurrentView('templates')"
              :class="['menu-item', { 'menu-item--active': currentView === 'templates' }]"
              type="button"
            >
              <md-icon>description</md-icon>
              <span>Шаблоны</span>
            </button>
            <button
              @click="setCurrentView('ingredients')"
              :class="['menu-item', { 'menu-item--active': currentView === 'ingredients' }]"
              type="button"
            >
              <md-icon>restaurant</md-icon>
              <span>Ингредиенты</span>
            </button>
            <button
              @click="setCurrentView('users')"
              :class="['menu-item', { 'menu-item--active': currentView === 'users' }]"
              type="button"
            >
              <md-icon>people</md-icon>
              <span>Пользователи</span>
            </button>
            <button
              @click="setCurrentView('units')"
              :class="['menu-item', { 'menu-item--active': currentView === 'units' }]"
              type="button"
            >
              <md-icon>straighten</md-icon>
              <span>Единицы</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Content Area -->
      <main class="select-type-content">
        <!-- Content Header -->
        <div class="content-header">
          <!-- Improved Breadcrumb -->
          <div class="breadcrumb-container">
            <div v-if="currentView === 'templates' && selectedTemplate" class="breadcrumb">
              <md-chip-set>
                <md-assist-chip
                  @click="selectTemplate(selectedTemplate)"
                  class="breadcrumb-chip"
                >
                  <md-icon slot="icon">home</md-icon>
                  {{ selectedTemplate.name }}
                </md-assist-chip>
              </md-chip-set>

              <!-- Category Path -->
              <template v-if="categoryPath.length > 0">
                <md-icon class="breadcrumb-separator">chevron_right</md-icon>
                <md-chip-set>
                  <md-assist-chip
                    v-for="(category, index) in categoryPath"
                    :key="category.id"
                    @click="navigateToCategory(index)"
                    :class="[
                      'breadcrumb-chip',
                      { 'breadcrumb-chip--current': index === categoryPath.length - 1 }
                    ]"
                  >
                    <md-icon slot="icon">folder</md-icon>
                    {{ category.categoryName }}
                  </md-assist-chip>
                </md-chip-set>
              </template>
            </div>

            <!-- Section Indicators -->
            <div v-else-if="currentView !== 'templates'" class="breadcrumb">
              <md-chip-set>
                <md-assist-chip class="breadcrumb-chip breadcrumb-chip--active">
                    <md-icon slot="icon">
                      {{
                        currentView === "ingredients"
                          ? "restaurant"
                          : currentView === "users"
                          ? "people"
                          : "straighten"
                      }}
                    </md-icon>
                  {{
                    currentView === "ingredients"
                      ? "Ингредиенты"
                      : currentView === "users"
                      ? "Пользователи"
                      : "Единицы измерения"
                  }}
                </md-assist-chip>
              </md-chip-set>
            </div>
          </div>

          <!-- Improved Actions Bar -->
          <div v-if="currentView === 'templates'" class="actions-bar">
            <div class="actions-bar__primary">
              <md-icon-button
                v-if="categoryPath.length > 0"
                @click="navigateBack"
                title="Назад"
                class="back-btn"
              >
                <md-icon>arrow_back</md-icon>
              </md-icon-button>

              <!-- Template Selector -->
              <md-outlined-select
                v-model="selectedTemplateId"
                @change="selectTemplateById"
                label="Выберите шаблон"
                class="template-selector"
                :disabled="isLoading"
              >
                <md-select-option
                  v-for="template in templates"
                  :key="template.id"
                  :value="template.id"
                >
                  {{ template.name }}
                </md-select-option>
              </md-outlined-select>
            </div>

            <div v-if="selectedTemplate" class="actions-bar__secondary">
              <!-- Quick Actions -->
              <div class="quick-actions">
                <md-filled-button
                  v-if="categoryPath.length === 0"
                  @click="showCategoryDialog = true"
                  class="quick-action-btn"
                  :disabled="isLoading"
                >
                  <md-icon>create_new_folder</md-icon>
                  Категория
                </md-filled-button>

                <md-filled-button
                  v-if="categoryPath.length > 0"
                  @click="showSubcategoryDialog = true"
                  class="quick-action-btn"
                  :disabled="isLoading"
                >
                  <md-icon>create_new_folder</md-icon>
                  Подкатегория
                </md-filled-button>

                <md-filled-button
                  v-if="categoryPath.length > 0"
                  @click="showItemDialog = true"
                  class="quick-action-btn"
                  :disabled="isLoading"
                >
                  <md-icon>note_add</md-icon>
                  Элемент
                </md-filled-button>
              </div>

              <!-- Save Button -->
              <md-filled-button
                @click="saveCurrentTemplate"
                class="save-btn"
                :disabled="isLoading || !hasUnsavedChanges"
              >
                <md-icon>{{ hasUnsavedChanges ? 'save' : 'check' }}</md-icon>
                {{ hasUnsavedChanges ? 'Сохранить' : 'Сохранено' }}
              </md-filled-button>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div v-if="currentView === 'templates'" class="templates-content">
          <div v-if="!selectedTemplate" class="empty-state">
            <div class="empty-state__icon">
              <md-icon>description</md-icon>
            </div>
            <h2 class="empty-state__title">Добро пожаловать!</h2>
            <p class="empty-state__description">
              Выберите шаблон из списка слева или создайте новый
            </p>
            <md-filled-button
              @click="showCreateDialog = true"
              class="empty-state__action"
            >
              <md-icon>add</md-icon>
              Создать первый шаблон
            </md-filled-button>
          </div>

          <div v-else class="content-grid" :class="`content-grid--${viewMode}`">
            <!-- Categories/Subcategories -->
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              @click="selectCategory(category)"
              @keydown.enter="selectCategory(category)"
              @keydown.space.prevent="selectCategory(category)"
              :class="['grid-card', 'grid-card--folder', `grid-card--${viewMode}`]"
              tabindex="0"
              role="button"
              :aria-label="`Открыть категорию ${category.categoryName}`"
            >
              <div class="grid-card__icon grid-card__icon--folder">
                <md-icon>folder</md-icon>
              </div>
              <div class="grid-card__content">
                <h3 class="grid-card__title">{{ category.categoryName }}</h3>
                <p class="grid-card__subtitle">{{ category.categoryShortName }}</p>
                <div class="grid-card__meta">
                  <span class="grid-card__meta-item">
                    {{ getTotalItemsCount(category) }} элементов
                  </span>
                  <span
                    v-if="category.subcategories && category.subcategories.length > 0"
                    class="grid-card__meta-item"
                  >
                    {{ category.subcategories.length }} подкатегорий
                  </span>
                </div>
              </div>
              <md-icon-button
                @click.stop="showCategoryMenu($event, category)"
                class="grid-card__menu"
                title="Меню категории"
              >
                <md-icon>more_vert</md-icon>
              </md-icon-button>
            </div>

            <!-- Items in current category -->
            <div
              v-for="item in filteredItems"
              :key="item.id"
              @click="selectItem(item)"
              @keydown.enter="selectItem(item)"
              @keydown.space.prevent="selectItem(item)"
              :class="['grid-card', 'grid-card--item', `grid-card--${viewMode}`]"
              tabindex="0"
              role="button"
              :aria-label="`Открыть элемент ${item.itemName}`"
            >
              <div class="grid-card__icon grid-card__icon--item">
                <md-icon>
                  {{ item.itemInStock ? "inventory" : "inventory_2" }}
                </md-icon>
              </div>
              <div class="grid-card__content">
                <h3 class="grid-card__title">{{ item.itemName }}</h3>
                <p class="grid-card__subtitle">{{ item.itemShortName }}</p>
                <div class="grid-card__meta">
                  <span class="grid-card__meta-item">
                    {{ item.ingredients.length }} ингредиентов
                  </span>
                  <span
                    :class="[
                      'grid-card__meta-item',
                      'stock-status',
                      { 'stock-status--in-stock': item.itemInStock }
                    ]"
                  >
                    {{ item.itemInStock ? "В наличии" : "Нет в наличии" }}
                  </span>
                </div>
              </div>
              <md-icon-button
                @click.stop="showItemMenu($event, item)"
                class="grid-card__menu"
                title="Меню элемента"
              >
                <md-icon>more_vert</md-icon>
              </md-icon-button>
            </div>

            <!-- Empty state for categories -->
            <div
              v-if="
                currentView === 'templates' &&
                filteredCategories.length === 0 &&
                filteredItems.length === 0
              "
              class="empty-folder-state"
            >
              <div class="empty-folder-state__icon">
                <md-icon>folder_open</md-icon>
              </div>
              <h3 class="empty-folder-state__title">
                {{
                  categoryPath.length === 0 ? "Нет категорий" : "Пустая категория"
                }}
              </h3>
              <p class="empty-folder-state__description">
                {{
                  categoryPath.length === 0
                    ? "Создайте первую категорию"
                    : "Добавьте подкатегории или элементы"
                }}
              </p>
              <md-filled-button
                @click="
                  categoryPath.length === 0
                    ? (showCategoryDialog = true)
                    : (showSubcategoryDialog = true)
                "
                class="empty-folder-state__action"
              >
                <md-icon>add</md-icon>
                {{
                  categoryPath.length === 0
                    ? "Создать категорию"
                    : "Создать подкатегорию"
                }}
              </md-filled-button>
            </div>
          </div>
        </div>

        <!-- Ingredients Manager -->
        <IngredientsManager v-if="currentView === 'ingredients'" />

        <!-- Users Manager -->
        <UsersManager v-if="currentView === 'users'" />

        <!-- Units Manager -->
        <UnitsManager v-if="currentView === 'units'" />
      </main>
    </div>

    <!-- Create Template Dialog -->
    <md-dialog :open="showCreateDialog" @closed="resetCreateTemplateForm">
      <div slot="headline">Создать новый шаблон</div>
      <form @submit.prevent="createTemplate" slot="content">
        <md-outlined-text-field
          v-model="newTemplateName"
          label="Название шаблона"
          required
          :error="newTemplateNameError"
          :error-text="newTemplateNameError"
          @input="validateTemplateName"
        />
      </form>
      <div slot="actions">
        <md-text-button @click="showCreateDialog = false" :disabled="isLoading">
          Отмена
        </md-text-button>
        <md-filled-button
          @click="createTemplate"
          :disabled="!newTemplateName.trim() || !!newTemplateNameError || isLoading"
        >
          Создать
        </md-filled-button>
      </div>
    </md-dialog>

    <!-- Create Category Dialog -->
    <md-dialog :open="showCategoryDialog" @closed="resetCategoryForm">
      <div slot="headline">Добавить категорию</div>
      <form @submit.prevent="createCategory" slot="content">
        <md-outlined-text-field
          v-model="newCategory.categoryName"
          label="Название категории"
          required
          :error="categoryNameError"
          :error-text="categoryNameError"
          @input="validateCategoryName"
        />
        <md-outlined-text-field
          v-model="newCategory.categoryShortName"
          label="Короткое название"
          required
        />
      </form>
      <div slot="actions">
        <md-text-button @click="showCategoryDialog = false" :disabled="isLoading">
          Отмена
        </md-text-button>
        <md-filled-button
          @click="createCategory"
          :disabled="!newCategory.categoryName.trim() || !!categoryNameError || isLoading"
        >
          Создать
        </md-filled-button>
      </div>
    </md-dialog>

    <!-- Create Subcategory Dialog -->
    <md-dialog :open="showSubcategoryDialog" @closed="resetCategoryForm">
      <div slot="headline">Добавить подкатегорию</div>
      <form @submit.prevent="createCategory" slot="content">
        <md-outlined-text-field
          v-model="newCategory.categoryName"
          label="Название подкатегории"
          required
          :error="categoryNameError"
          :error-text="categoryNameError"
          @input="validateCategoryName"
        />
        <md-outlined-text-field
          v-model="newCategory.categoryShortName"
          label="Короткое название"
          required
        />
      </form>
      <div slot="actions">
        <md-text-button @click="showSubcategoryDialog = false" :disabled="isLoading">
          Отмена
        </md-text-button>
        <md-filled-button
          @click="createCategory"
          :disabled="!newCategory.categoryName.trim() || !!categoryNameError || isLoading"
        >
          Создать
        </md-filled-button>
      </div>
    </md-dialog>

    <!-- Create Item Dialog -->
    <md-dialog :open="showItemDialog" @closed="resetItemForm">
      <div slot="headline">Добавить элемент</div>
      <form @submit.prevent="createItem" slot="content">
        <md-outlined-text-field
          v-model="newItem.itemName"
          label="Название элемента"
          required
          :error="itemNameError"
          :error-text="itemNameError"
          @input="validateItemName"
        />
        <md-outlined-text-field
          v-model="newItem.itemShortName"
          label="Короткое название"
          required
        />
        <md-outlined-text-field
          v-model="newItem.itemRecipe"
          label="Рецепт/Описание"
          type="textarea"
          rows="3"
        />
        <label class="checkbox-label">
          <md-checkbox v-model="newItem.itemInStock" />
          В наличии
        </label>
      </form>
      <div slot="actions">
        <md-text-button @click="showItemDialog = false" :disabled="isLoading">
          Отмена
        </md-text-button>
        <md-filled-button
          @click="createItem"
          :disabled="!newItem.itemName.trim() || !!itemNameError || isLoading"
        >
          Создать
        </md-filled-button>
      </div>
    </md-dialog>

    <!-- Item Details Dialog -->
    <md-dialog :open="!!selectedItem" @closed="selectedItem = null">
      <div slot="headline">{{ selectedItem?.itemName }}</div>
      <div slot="content" class="item-details">
        <div class="item-details__section">
          <h4 class="item-details__section-title">Основная информация</h4>
          <div class="item-details__info-grid">
            <div class="item-details__info-item">
              <strong>Полное название:</strong>
              <span>{{ selectedItem?.itemName }}</span>
            </div>
            <div class="item-details__info-item">
              <strong>Короткое название:</strong>
              <span>{{ selectedItem?.itemShortName }}</span>
            </div>
            <div class="item-details__info-item">
              <strong>Статус:</strong>
              <span
                :class="[
                  'stock-status',
                  { 'stock-status--in-stock': selectedItem?.itemInStock }
                ]"
              >
                {{ selectedItem?.itemInStock ? "В наличии" : "Нет в наличии" }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="selectedItem?.itemRecipe" class="item-details__section">
          <h4 class="item-details__section-title">Рецепт</h4>
          <p class="item-details__recipe">{{ selectedItem.itemRecipe }}</p>
        </div>

        <div v-if="selectedItem?.ingredients?.length" class="item-details__section">
          <h4 class="item-details__section-title">Ингредиенты</h4>
          <div class="ingredients-list">
            <div
              v-for="ing in selectedItem.ingredients"
              :key="ing.id"
              class="ingredients-list__item"
            >
              <span class="ingredients-list__name">{{ ing.ingredientName }}</span>
              <span class="ingredients-list__weight">
                {{ ing.ingredientWeight }}
                {{ getUnitShortName(ing.unitId) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div slot="actions">
        <md-text-button @click="selectedItem = null">Закрыть</md-text-button>
        <md-filled-button @click="editItem">Редактировать</md-filled-button>
      </div>
    </md-dialog>

    <!-- Settings Dialog -->
    <md-dialog :open="showSettingsDialog" @closed="showSettingsDialog = false">
      <div slot="headline">Настройки</div>
      <div slot="content" class="settings-content">
        <div class="settings-section">
          <h4>Отображение</h4>
          <label class="settings-option">
            <md-switch v-model="settings.autoSave" />
            Автоматическое сохранение
          </label>
          <label class="settings-option">
            <md-switch v-model="settings.showPreview" />
            Показывать превью
          </label>
        </div>
      </div>
      <div slot="actions">
        <md-text-button @click="showSettingsDialog = false">Закрыть</md-text-button>
        <md-filled-button @click="saveSettings">Сохранить</md-filled-button>
      </div>
    </md-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, toRaw, watch } from "#imports";
import { templateDB } from "../lib/database";
import type { Template, Category, Item } from "../model/types";
import { IngredientsManager, ingredientsApi } from "../../../features/ingredients";
import { UsersManager } from "../../../features/users";
import { UnitsManager, unitsApi } from "../../../features/units";

// Loading state
const isLoading = ref(false);
const loadingMessage = ref("");

// State
const currentView = ref<"templates" | "ingredients" | "users" | "units">("templates");
const templates = ref<Template[]>([]);
const selectedTemplate = ref<Template | null>(null);
const selectedTemplateId = ref<string>("");
const categoryPath = ref<Category[]>([]);
const selectedItem = ref<Item | null>(null);
const searchQuery = ref("");
const viewMode = ref<"grid" | "list">("grid");
const createActionType = ref<string>("");

// Dialogs
const showCreateDialog = ref(false);
const showCategoryDialog = ref(false);
const showSubcategoryDialog = ref(false);
const showItemDialog = ref(false);
const showSettingsDialog = ref(false);

// Form data
const newTemplateName = ref("");
const newCategory = ref({
  categoryName: "",
  categoryShortName: "",
});
const newItem = ref({
  itemName: "",
  itemShortName: "",
  itemRecipe: "",
  itemInStock: true,
});

// Validation errors
const newTemplateNameError = ref("");
const categoryNameError = ref("");
const itemNameError = ref("");

// Settings
const settings = ref({
  autoSave: true,
  showPreview: true,
});

// Computed properties
const hasUnsavedChanges = ref(false);

const filteredCategories = computed(() => {
  const categories = getCurrentCategories();
  if (!searchQuery.value) return categories;
  
  return categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    category.categoryShortName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredItems = computed(() => {
  const items = getCurrentItems();
  if (!searchQuery.value) return items;
  
  return items.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.itemShortName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Utility functions
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const setLoading = (loading: boolean, message = "") => {
  isLoading.value = loading;
  loadingMessage.value = message;
};

// Validation functions
const validateTemplateName = () => {
  const name = newTemplateName.value.trim();
  if (!name) {
    newTemplateNameError.value = "Название шаблона не может быть пустым";
    return false;
  }
  if (templates.value.some(t => t.name === name)) {
    newTemplateNameError.value = "Шаблон с таким названием уже существует";
    return false;
  }
  newTemplateNameError.value = "";
  return true;
};

const validateCategoryName = () => {
  const name = newCategory.value.categoryName.trim();
  if (!name) {
    categoryNameError.value = "Название категории не может быть пустым";
    return false;
  }
  
  // Check for duplicates in current level
  const existingCategories = getCurrentCategories();
  if (existingCategories.some(cat => cat.categoryName === name)) {
    categoryNameError.value = "Категория с таким названием уже существует";
    return false;
  }
  
  categoryNameError.value = "";
  return true;
};

const validateItemName = () => {
  const name = newItem.value.itemName.trim();
  if (!name) {
    itemNameError.value = "Название элемента не может быть пустым";
    return false;
  }
  
  // Check for duplicates in current category
  const existingItems = getCurrentItems();
  if (existingItems.some(item => item.itemName === name)) {
    itemNameError.value = "Элемент с таким названием уже существует";
    return false;
  }
  
  itemNameError.value = "";
  return true;
};

// Form reset functions
const resetCreateTemplateForm = () => {
  newTemplateName.value = "";
  newTemplateNameError.value = "";
};

const resetCategoryForm = () => {
  newCategory.value = { categoryName: "", categoryShortName: "" };
  categoryNameError.value = "";
};

const resetItemForm = () => {
  newItem.value = {
    itemName: "",
    itemShortName: "",
    itemRecipe: "",
    itemInStock: true,
  };
  itemNameError.value = "";
};

// Navigation functions
const setCurrentView = (view: "templates" | "ingredients" | "users" | "units") => {
  currentView.value = view;
  selectedItem.value = null;
  categoryPath.value = [];
  createActionType.value = "";
  searchQuery.value = "";
};

const handleSearch = () => {
  // Search is handled reactively by computed properties
  console.log("Searching for:", searchQuery.value);
};

// Template functions
const loadTemplates = async () => {
  setLoading(true, "Загрузка шаблонов...");
  try {
    const loadedTemplates = await templateDB.getAllTemplates();
    templates.value = loadedTemplates;

    if (loadedTemplates.length === 0) {
      setLoading(true, "Создание демо данных...");
      await templateDB.createDemoData();
      const demoTemplates = await templateDB.getAllTemplates();
      templates.value = demoTemplates;
    }
  } catch (error) {
    console.error("Error loading templates:", error);
  } finally {
    setLoading(false);
  }
};

const selectTemplate = async (template: Template) => {
  if (selectedTemplate.value && selectedTemplate.value.id !== template.id) {
    if (hasUnsavedChanges.value && settings.value.autoSave) {
      setLoading(true, "Автосохранение...");
      try {
        await templateDB.saveTemplate(toRaw(selectedTemplate.value));
        hasUnsavedChanges.value = false;
      } catch (error) {
        console.error("Error auto-saving template:", error);
      }
    } else if (hasUnsavedChanges.value) {
      const shouldSave = confirm(
        `Сохранить изменения в шаблоне "${selectedTemplate.value.name}"?`,
      );
      
      if (shouldSave) {
        setLoading(true, "Сохранение изменений...");
        try {
          await templateDB.saveTemplate(toRaw(selectedTemplate.value));
          hasUnsavedChanges.value = false;
        } catch (error) {
          console.error("Error saving template:", error);
        }
      } else {
        // Reload template from database (cancel changes)
        try {
          const savedTemplates = await templateDB.getAllTemplates();
          const savedTemplate = savedTemplates.find(
            (t: Template) => t.id === selectedTemplate.value!.id,
          );
          if (savedTemplate) {
            const index = templates.value.findIndex(
              (t: Template) => t.id === savedTemplate.id,
            );
            if (index !== -1) {
              templates.value[index] = savedTemplate;
            }
          }
        } catch (error) {
          console.error("Error reloading template:", error);
        }
      }
    }
  }

  currentView.value = "templates";
  selectedTemplate.value = template;
  selectedTemplateId.value = template.id;
  categoryPath.value = [];
  selectedItem.value = null;
  createActionType.value = "";
  hasUnsavedChanges.value = false;
  setLoading(false);
};

const selectTemplateById = async () => {
  if (selectedTemplateId.value) {
    const template = templates.value.find(
      (t: Template) => t.id === selectedTemplateId.value,
    );
    if (template) {
      await selectTemplate(template);
    }
  }
};

const createTemplate = async () => {
  if (!validateTemplateName()) return;

  setLoading(true, "Создание шаблона...");
  
  const newTemplate: Template = {
    id: generateId(),
    name: newTemplateName.value.trim(),
    categories: [],
    users: [],
    units: [],
  };

  try {
    await templateDB.saveTemplate(newTemplate);
    templates.value.push(newTemplate);
    showCreateDialog.value = false;
    await selectTemplate(newTemplate);
  } catch (error) {
    console.error("Error creating template:", error);
  } finally {
    setLoading(false);
  }
};

// API transform functions
const transformCategoryForAPI = (category: any): any => {
  const rawCategory = toRaw(category);
  
  return {
    id: rawCategory.id,
    patentId: rawCategory.patentId,
    categoryName: rawCategory.categoryName,
    categoryShortName: rawCategory.categoryShortName,
    categoryExpirationDate: rawCategory.categoryExpirationDate,
    items: rawCategory.items.map((item: any) => {
      const rawItem = toRaw(item);
      return {
        id: rawItem.id,
        categoryId: rawItem.categoryId,
        itemName: rawItem.itemName,
        itemShortName: rawItem.itemShortName,
        itemInStock: rawItem.itemInStock,
        itemExpirationDate: rawItem.itemExpirationDate,
        itemImage: rawItem.itemImage,
        itemRecipe: rawItem.itemRecipe,
        ingredients: rawItem.ingredients.map((ing: any) => {
          const rawIng = toRaw(ing);
          return {
            id: rawIng.id,
            unitId: rawIng.unitId,
            ingredientName: rawIng.ingredientName,
            ingredientWeight: rawIng.ingredientWeight,
          };
        }),
      };
    }),
    children: rawCategory.subcategories
      ? rawCategory.subcategories.map((subcat: any) =>
          transformCategoryForAPI(toRaw(subcat)),
        )
      : [],
  };
};

const transformTemplateForAPI = (template: Template) => {
  const rawTemplate = toRaw(template);
  
  return {
    id: rawTemplate.id,
    name: rawTemplate.name,
    categories: rawTemplate.categories.map((cat: any) =>
      transformCategoryForAPI(toRaw(cat)),
    ),
    users: rawTemplate.users.map((user: any) => ({
      id: user.id,
      userSurname: user.userSurname,
      userFullname: user.user_fullname,
      userPatronymic: user.userPatronymic,
    })),
    units: rawTemplate.units.map((unit: any) => ({
      id: unit.id,
      unitFullname: unit.unitFullname,
      unitShortname: unit.unitShortname,
    })),
  };
};

const saveCurrentTemplate = async () => {
  if (!selectedTemplate.value) return;

  setLoading(true, "Сохранение шаблона...");
  
  try {
    // Save locally in IndexedDB
    await templateDB.saveTemplate(toRaw(selectedTemplate.value));
    
    // Transform data for API
    const apiData = transformTemplateForAPI(selectedTemplate.value);
    
    // Send to server
    const response = await fetch(
      "http://192.168.0.100:8002/templates/create_template",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Template saved successfully:", result);
    hasUnsavedChanges.value = false;
    alert(`Шаблон "${selectedTemplate.value.name}" сохранен на сервере!`);
  } catch (error: any) {
    console.error("Error saving template:", error);
    alert(`Ошибка при сохранении шаблона: ${error?.message || error}`);
  } finally {
    setLoading(false);
  }
};

// Navigation functions
const selectCategory = (category: Category) => {
  categoryPath.value.push(category);
  selectedItem.value = null;
};

const navigateToCategory = (index: number) => {
  categoryPath.value = categoryPath.value.slice(0, index + 1);
  selectedItem.value = null;
};

const navigateBack = () => {
  if (categoryPath.value.length > 0) {
    categoryPath.value.pop();
  }
  selectedItem.value = null;
};

const selectItem = (item: Item) => {
  selectedItem.value = item;
};

// Category functions
const createCategory = async () => {
  if (!validateCategoryName() || !selectedTemplate.value) return;

  setLoading(true, "Создание категории...");
  
  const category: Category = {
    id: generateId(),
    patentId: generateId(),
    categoryName: newCategory.value.categoryName.trim(),
    categoryShortName: newCategory.value.categoryShortName.trim(),
    categoryExpirationDate: Date.now() + 86400000 * 365,
    items: [],
    subcategories: [],
  };

  try {
    const rawTemplate = toRaw(selectedTemplate.value);
    const templateClone = structuredClone
      ? structuredClone(rawTemplate)
      : JSON.parse(JSON.stringify(rawTemplate));
    
    if (categoryPath.value.length === 0) {
      templateClone.categories.push(category);
    } else {
      const currentCategoryId = categoryPath.value[categoryPath.value.length - 1].id;
      
      const findAndAddToCategory = (categories: Category[]): boolean => {
        for (const cat of categories) {
          if (cat.id === currentCategoryId) {
            category.parentCategoryId = cat.id;
            cat.subcategories.push(category);
            return true;
          }
          if (findAndAddToCategory(cat.subcategories)) {
            return true;
          }
        }
        return false;
      };
      findAndAddToCategory(templateClone.categories);
    }

    await templateDB.saveTemplate(templateClone);
    await refreshTemplate();

    showCategoryDialog.value = false;
    showSubcategoryDialog.value = false;
    hasUnsavedChanges.value = true;
  } catch (error) {
    console.error("Error creating category:", error);
  } finally {
    setLoading(false);
  }
};

const getCurrentCategory = (): Category | null => {
  return categoryPath.value.length > 0
    ? categoryPath.value[categoryPath.value.length - 1]
    : null;
};

const getCurrentCategories = (): Category[] => {
  if (!selectedTemplate.value) return [];

  if (categoryPath.value.length === 0) {
    return selectedTemplate.value.categories;
  } else {
    const currentCategory = getCurrentCategory();
    return currentCategory ? currentCategory.subcategories : [];
  }
};

const getCurrentItems = (): Item[] => {
  const currentCategory = getCurrentCategory();
  return currentCategory ? currentCategory.items : [];
};

const getTotalItemsCount = (category: Category): number => {
  if (!category || !category.items) return 0;
  let count = category.items.length;
  if (category.subcategories && category.subcategories.length > 0) {
    for (const subcategory of category.subcategories) {
      count += getTotalItemsCount(subcategory);
    }
  }
  return count;
};

// Item functions
const createItem = async () => {
  if (!validateItemName()) return;
  
  const currentCategory = getCurrentCategory();
  if (!currentCategory || !selectedTemplate.value) return;

  setLoading(true, "Создание элемента...");
  
  const item: Item = {
    id: generateId(),
    categoryId: currentCategory.id,
    itemName: newItem.value.itemName.trim(),
    itemShortName: newItem.value.itemShortName.trim(),
    itemInStock: newItem.value.itemInStock,
    itemExpirationDate: Date.now() + 86400000 * 30,
    itemImage: "",
    itemRecipe: newItem.value.itemRecipe,
    ingredients: [],
  };

  try {
    currentCategory.items.push(item);
    await templateDB.saveTemplate(toRaw(selectedTemplate.value));
    await refreshTemplate();

    showItemDialog.value = false;
    hasUnsavedChanges.value = true;
  } catch (error) {
    console.error("Error creating item:", error);
  } finally {
    setLoading(false);
  }
};

// Template management
const refreshTemplate = async () => {
  const updatedTemplates = await templateDB.getAllTemplates();
  templates.value = updatedTemplates;

  const updatedTemplate = templates.value.find(
    (t: Template) => t.id === selectedTemplate.value!.id,
  );
  if (updatedTemplate) {
    selectedTemplate.value = updatedTemplate;
    refreshCategoryPath();
  }
};

const refreshCategoryPath = () => {
  if (categoryPath.value.length === 0) return;

  const newPath: Category[] = [];
  let currentCategories = selectedTemplate.value?.categories || [];

  for (const pathCategory of categoryPath.value) {
    const found = findCategoryById(currentCategories, pathCategory.id);
    if (found) {
      newPath.push(found);
      currentCategories = found.subcategories;
    } else {
      break;
    }
  }

  categoryPath.value = newPath;
};

const findCategoryById = (categories: Category[], id: string): Category | null => {
  for (const category of categories) {
    if (category.id === id) return category;
    const found = findCategoryById(category.subcategories, id);
    if (found) return found;
  }
  return null;
};

// Menu functions
const showCategoryMenu = (event: Event, category: Category) => {
  console.log("Category menu:", category.categoryName);
  // TODO: Implement context menu
};

const showItemMenu = (event: Event, item: Item) => {
  console.log("Item menu:", item.itemName);
  // TODO: Implement context menu
};

// View functions
const toggleView = () => {
  viewMode.value = viewMode.value === "grid" ? "list" : "grid";
};

// Utility functions
const getUnitShortName = (unitId: string) => {
  if (!selectedTemplate.value) return "";
  const unit = selectedTemplate.value.units.find((u: any) => u.id === unitId);
  return unit ? unit.unitShortname : "";
};

const editItem = () => {
  console.log("Edit item:", selectedItem.value?.itemName);
  // TODO: Implement item editing
};

const saveSettings = () => {
  console.log("Settings saved:", settings.value);
  showSettingsDialog.value = false;
  // TODO: Persist settings
};

// Watchers
watch(selectedTemplate, () => {
  hasUnsavedChanges.value = false;
}, { deep: true });

// Lifecycle
onMounted(async () => {
  try {
    await templateDB.init();
    await loadTemplates();
    
    // Auto-select first template if available
    if (templates.value.length > 0 && !selectedTemplate.value) {
      await selectTemplate(templates.value[0]);
    }
  } catch (error) {
    console.error("Error initializing:", error);
  }
});
</script>

<style lang="scss" scoped>
// Colors and variables following BEM naming
:root {
  --select-type-primary-color: var(--md-sys-color-primary, #6750a4);
  --select-type-surface-color: var(--md-sys-color-surface, #fffbfe);
  --select-type-outline-color: var(--md-sys-color-outline-variant, #cac4d0);
  --select-type-border-radius: 16px;
  --select-type-transition: all 0.2s ease;
}

// Main container - BEM Block
.select-type-page {
  height: 100vh;
  display: flex;
  width: 100vw;
  flex-direction: column;
  background: var(--select-type-surface-color);
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  overflow: hidden;
}

// Navigation - BEM Block
.select-type-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 32px;
  border-bottom: 1px solid var(--select-type-outline-color);
  background: var(--select-type-surface-color);
  z-index: 100;
  box-shadow: var(--md-sys-elevation-1, 0 1px 3px rgba(0, 0, 0, 0.12));

  @media (max-width: 768px) {
    height: 64px;
    padding: 0 16px;
  }
}

// Navigation elements
.nav-left {
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;

  @media (max-width: 768px) {
    gap: 16px;
  }
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface, #1d1b20);
  cursor: pointer;
  transition: var(--select-type-transition);

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 40px;
    height: 40px;
    transition: transform 0.3s ease;

    @media (max-width: 768px) {
      width: 32px;
      height: 32px;
    }
  }

  &:hover svg {
    transform: scale(1.05);
  }

  span {
    @media (max-width: 576px) {
      display: none;
    }
  }
}

.nav-search {
  flex: 1;
  max-width: 640px;

  @media (max-width: 768px) {
    max-width: 300px;
  }
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  height: 56px;
  background: var(--md-sys-color-surface-container-high, #ece6f0);
  border-radius: 28px;
  padding: 0 24px;
  transition: var(--select-type-transition);

  &:focus-within {
    background: var(--select-type-surface-color);
    box-shadow: var(--md-sys-elevation-2, 0 3px 6px rgba(0, 0, 0, 0.16));
    transform: translateY(-1px);
  }

  md-icon {
    color: var(--md-sys-color-on-surface-variant, #49454f);
    margin-right: 16px;
    font-size: 24px;
    transition: color 0.2s ease;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 18px;
    color: var(--md-sys-color-on-surface, #1d1b20);

    &::placeholder {
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
  }

  .clear-search-btn {
    --md-icon-button-size: 32px;
    --md-icon-button-state-layer-shape: 16px;
    margin-left: 8px;
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;

  md-icon-button {
    --md-icon-button-size: 48px;
    --md-icon-button-state-layer-shape: 24px;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}

// Loading overlay
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  md-circular-progress {
    margin-bottom: 24px;
    --md-circular-progress-size: 48px;
  }

  span {
    font-size: 18px;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    font-weight: 500;
  }
}

// Main content area
.select-type-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

// Sidebar - BEM Block
.select-type-sidebar {
  width: 320px;
  background: var(--md-sys-color-surface-container-low, #f7f2fa);
  border-right: 1px solid var(--select-type-outline-color);
  padding: 32px;
  overflow-y: auto;
  transition: transform 0.3s ease;

  @media (max-width: 1024px) {
    width: 280px;
    padding: 24px;
  }

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 80px;
    height: calc(100vh - 80px);
    z-index: 50;
    transform: translateX(-100%);

    &.select-type-sidebar--open {
      transform: translateX(0);
    }
  }
}

.create-btn {
  width: 100%;
  --md-filled-button-container-color: var(--select-type-primary-color);
  --md-filled-button-label-text-color: var(--md-sys-color-on-primary, #ffffff);
  --md-filled-button-container-shape: 28px;
  --md-filled-button-container-height: 56px;
  margin-bottom: 32px;
  font-size: 16px;
  font-weight: 500;
  transition: var(--select-type-transition);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--md-sys-elevation-3, 0 6px 12px rgba(0, 0, 0, 0.15));
  }

  &:disabled {
    opacity: 0.6;
    transform: none;
  }

  md-icon {
    margin-right: 12px;
    font-size: 20px;
  }
}

// Sidebar menu - BEM Elements
.sidebar-menu {
  .menu-section {
    margin-bottom: 32px;
  }

  .menu-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    padding: 0 20px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    margin-bottom: 8px;
    border-radius: 12px;
    cursor: pointer;
    transition: var(--select-type-transition);
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    font-family: inherit;
    font-size: 16px;
    color: var(--md-sys-color-on-surface, #1d1b20);

    &:hover {
      background: var(--md-sys-color-secondary-container, #e8def8);
      transform: translateX(4px);
    }

    &:focus {
      outline: 2px solid var(--select-type-primary-color);
      outline-offset: 2px;
    }

    // BEM Modifier
    &.menu-item--active {
      background: var(--md-sys-color-primary-container, #eaddff);
      color: var(--md-sys-color-on-primary-container, #21005d);
      font-weight: 500;

      md-icon {
        color: var(--md-sys-color-on-primary-container, #21005d);
      }
    }

    md-icon {
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-size: 24px;
      transition: color 0.2s ease;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

// Content area
.select-type-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background: var(--select-type-surface-color);

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
}

// Content header
.content-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--select-type-outline-color);

  @media (max-width: 768px) {
    margin-bottom: 24px;
    padding-bottom: 16px;
  }
}

// Breadcrumb - BEM Block
.breadcrumb-container {
  margin-bottom: 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 0;

  md-chip-set {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .breadcrumb-chip {
    --md-assist-chip-container-height: 40px;
    --md-assist-chip-container-shape: 20px;
    --md-assist-chip-label-text-color: var(--md-sys-color-on-surface, #1d1b20);
    --md-assist-chip-with-icon-label-text-color: var(--md-sys-color-on-surface, #1d1b20);
    cursor: pointer;
    transition: var(--select-type-transition);

    &:hover {
      --md-assist-chip-container-color: var(--md-sys-color-secondary-container, #e8def8);
      transform: translateY(-1px);
    }

    // BEM Modifiers
    &.breadcrumb-chip--active {
      --md-assist-chip-container-color: var(--md-sys-color-primary-container, #eaddff);
      --md-assist-chip-label-text-color: var(--md-sys-color-on-primary-container, #21005d);
    }

    &.breadcrumb-chip--current {
      --md-assist-chip-container-color: var(--md-sys-color-tertiary-container, #ffd8e4);
      --md-assist-chip-label-text-color: var(--md-sys-color-on-tertiary-container, #31111d);
      cursor: default;
    }
  }

  .breadcrumb-separator {
    color: var(--md-sys-color-on-surface-variant, #49454f);
    font-size: 20px;
    margin: 0 8px;
  }
}

// Actions bar - BEM Block
.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  &__primary {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      justify-content: stretch;
    }
  }

  &__secondary {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      justify-content: stretch;
    }
  }
}

.template-selector {
  min-width: 220px;
  --md-outlined-select-text-field-container-shape: 16px;
  --md-outlined-select-text-field-container-height: 56px;
  --md-outlined-select-text-field-label-text-color: var(--select-type-primary-color);

  @media (max-width: 768px) {
    min-width: auto;
    flex: 1;
  }
}

.back-btn {
  --md-icon-button-size: 48px;
  --md-icon-button-state-layer-shape: 24px;
  margin-right: 16px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(-2px);
  }
}

// Quick actions
.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.quick-action-btn {
  --md-filled-button-container-color: var(--md-sys-color-primary-container, #eaddff);
  --md-filled-button-label-text-color: var(--md-sys-color-on-primary-container, #21005d);
  --md-filled-button-container-shape: 24px;
  --md-filled-button-container-height: 48px;
  font-size: 14px;
  font-weight: 500;
  transition: var(--select-type-transition);

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--md-sys-elevation-2, 0 3px 6px rgba(0, 0, 0, 0.16));
  }

  md-icon {
    margin-right: 8px;
    font-size: 20px;
  }

  @media (max-width: 768px) {
    flex: 1;
    font-size: 12px;
  }
}

.save-btn {
  --md-filled-button-container-color: var(--md-sys-color-secondary, #625b71);
  --md-filled-button-label-text-color: var(--md-sys-color-on-secondary, #ffffff);
  --md-filled-button-container-height: 56px;
  --md-filled-button-container-shape: 16px;
  font-size: 16px;
  font-weight: 500;
  transition: var(--select-type-transition);
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--md-sys-elevation-3, 0 6px 12px rgba(0, 0, 0, 0.15));
  }

  &:disabled {
    opacity: 0.6;
    transform: none;
  }

  md-icon {
    margin-right: 8px;
    font-size: 20px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
}

// Templates content
.templates-content {
  animation: fadeInUp 0.4s ease;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

// Empty states - BEM Block
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 480px;
  text-align: center;
  animation: fadeIn 0.5s ease;

  &__icon {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: var(--md-sys-color-surface-container-highest, #e6e0e9);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
    animation: bounce 2s infinite;

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    md-icon {
      font-size: 48px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
  }

  &__title {
    font-size: 28px;
    font-weight: 400;
    color: var(--md-sys-color-on-surface, #1d1b20);
    margin: 0 0 12px 0;
  }

  &__description {
    font-size: 18px;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    margin: 0 0 32px 0;
    max-width: 400px;
    line-height: 1.5;
  }

  &__action {
    --md-filled-button-container-color: var(--select-type-primary-color);
    --md-filled-button-label-text-color: var(--md-sys-color-on-primary, #ffffff);
    --md-filled-button-container-shape: 24px;
    --md-filled-button-container-height: 56px;
    font-size: 16px;
    font-weight: 500;
    transition: var(--select-type-transition);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--md-sys-elevation-3, 0 6px 12px rgba(0, 0, 0, 0.15));
    }

    md-icon {
      margin-right: 12px;
      font-size: 20px;
    }
  }
}

.empty-folder-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
  animation: fadeIn 0.5s ease;

  &__icon {
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

  &__title {
    font-size: 22px;
    font-weight: 400;
    color: var(--md-sys-color-on-surface, #1d1b20);
    margin: 0 0 12px 0;
  }

  &__description {
    font-size: 16px;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    margin: 0 0 24px 0;
    max-width: 360px;
    line-height: 1.5;
  }

  &__action {
    --md-filled-button-container-color: var(--select-type-primary-color);
    --md-filled-button-label-text-color: var(--md-sys-color-on-primary, #ffffff);
    --md-filled-button-container-shape: 24px;
    --md-filled-button-container-height: 56px;
    font-size: 16px;
    font-weight: 500;
    transition: var(--select-type-transition);

    &:hover {
      transform: translateY(-2px);
    }

    md-icon {
      margin-right: 12px;
      font-size: 20px;
    }
  }
}

// Content grid - BEM Block
.content-grid {
  display: grid;
  gap: 20px;
  padding: 12px 0;
  animation: fadeInUp 0.4s ease;

  // BEM Modifiers for different views
  &.content-grid--grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
  }

  &.content-grid--list {
    grid-template-columns: 1fr;
    gap: 12px;

    .grid-card {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 16px 24px;
      height: auto;

      &__icon {
        width: 48px;
        height: 48px;
        margin-bottom: 0;
        margin-right: 16px;
        flex-shrink: 0;
      }

      &__content {
        flex: 1;
        margin-right: 16px;

        h3 {
          margin-bottom: 4px;
        }

        p {
          margin-bottom: 8px;
        }
      }

      &__meta {
        flex-direction: row;
        gap: 16px;
        align-items: center;
      }

      &__menu {
        position: static;
        opacity: 1;
      }
    }
  }
}

// Grid card - BEM Block
.grid-card {
  position: relative;
  background: var(--md-sys-color-surface-container-low, #f7f2fa);
  border: 1px solid var(--select-type-outline-color);
  border-radius: var(--select-type-border-radius);
  padding: 24px;
  cursor: pointer;
  transition: var(--select-type-transition);
  animation: cardSlideIn 0.3s ease;

  @keyframes cardSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    box-shadow: var(--md-sys-elevation-2, 0 3px 6px rgba(0, 0, 0, 0.16));
    border-color: var(--select-type-primary-color);
    transform: translateY(-4px);
  }

  &:focus {
    outline: 2px solid var(--select-type-primary-color);
    outline-offset: 2px;
  }

  // BEM Modifiers
  &.grid-card--folder {
    .grid-card__icon {
      background: var(--md-sys-color-tertiary-container, #ffd8e4);

      md-icon {
        color: var(--md-sys-color-on-tertiary-container, #31111d);
      }
    }

    &:hover .grid-card__icon {
      background: var(--md-sys-color-tertiary, #c58af9);

      md-icon {
        color: var(--md-sys-color-on-tertiary, #ffffff);
      }
    }
  }

  &.grid-card--item {
    .grid-card__icon {
      background: var(--md-sys-color-primary-container, #eaddff);

      md-icon {
        color: var(--md-sys-color-on-primary-container, #21005d);
      }
    }

    &:hover .grid-card__icon {
      background: var(--select-type-primary-color);

      md-icon {
        color: var(--md-sys-color-on-primary, #ffffff);
      }
    }
  }

  // BEM Elements
  &__icon {
    width: 56px;
    height: 56px;
    border-radius: var(--select-type-border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    transition: var(--select-type-transition);

    md-icon {
      font-size: 28px;
      transition: color 0.2s ease;
    }
  }

  &__content {
    min-height: 80px;
  }

  &__title {
    font-size: 18px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface, #1d1b20);
    margin: 0 0 4px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.3;
  }

  &__subtitle {
    font-size: 14px;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    margin: 0 0 12px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.3;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__meta-item {
    font-size: 12px;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    line-height: 1.3;

    &.stock-status {
      font-weight: 500;

      // BEM Modifier
      &.stock-status--in-stock {
        color: var(--md-sys-color-primary, #6750a4);
      }
    }
  }

  &__menu {
    position: absolute;
    top: 12px;
    right: 12px;
    opacity: 0;
    transition: opacity 0.2s ease;
    --md-icon-button-size: 40px;
    --md-icon-button-state-layer-shape: 20px;
  }

  &:hover &__menu {
    opacity: 1;
  }

  &:focus-within &__menu {
    opacity: 1;
  }
}

// Item details - BEM Block
.item-details {
  &__section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__section-title {
    font-size: 18px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface, #1d1b20);
    margin: 0 0 16px 0;
  }

  &__info-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px 16px;
    margin-bottom: 16px;
  }

  &__info-item {
    display: contents;

    strong {
      font-weight: 500;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    span {
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
  }

  &__recipe {
    font-size: 16px;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    line-height: 1.5;
    background: var(--md-sys-color-surface-container-highest, #e6e0e9);
    padding: 16px;
    border-radius: 12px;
    margin: 0;
  }
}

// Ingredients list - BEM Block
.ingredients-list {
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--select-type-outline-color);
    transition: background-color 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: var(--md-sys-color-surface-container-highest, #e6e0e9);
      margin: 0 -16px;
      padding-left: 16px;
      padding-right: 16px;
      border-radius: 8px;
    }
  }

  &__name {
    font-weight: 500;
    color: var(--md-sys-color-on-surface, #1d1b20);
  }

  &__weight {
    color: var(--md-sys-color-on-surface-variant, #49454f);
    font-variant-numeric: tabular-nums;
  }
}

// Dialog improvements
md-dialog {
  --md-dialog-container-shape: var(--select-type-border-radius);
  animation: dialogSlideIn 0.3s ease;

  @keyframes dialogSlideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  form {
    display: flex;
    flex-direction: column;
    min-width: 480px;
    gap: 20px;

    @media (max-width: 576px) {
      min-width: 300px;
    }
  }
}

// Settings content
.settings-content {
  min-width: 400px;

  @media (max-width: 576px) {
    min-width: 300px;
  }

  .settings-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      font-size: 18px;
      font-weight: 500;
      color: var(--md-sys-color-on-surface, #1d1b20);
      margin-bottom: 16px;
    }
  }

  .settings-option {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px;
    border-radius: 8px;
    transition: background-color 0.2s ease;
    cursor: pointer;

    &:hover {
      background-color: var(--md-sys-color-surface-container-highest, #e6e0e9);
    }

    &:last-child {
      margin-bottom: 0;
    }

    md-switch {
      --md-switch-container-color: var(--select-type-outline-color);
      --md-switch-thumb-color: var(--md-sys-color-on-surface, #1d1b20);
      --md-switch-track-color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    span {
      font-size: 16px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      flex: 1;
    }
  }
}

// Form improvements
md-outlined-text-field {
  width: 100%;
  --md-outlined-text-field-container-shape: 12px;
  --md-outlined-text-field-container-height: 56px;
  --md-outlined-text-field-focus-outline-color: var(--select-type-primary-color);
  transition: var(--select-type-transition);

  &:hover {
    transform: translateY(-1px);
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: var(--md-sys-color-on-surface-variant, #49454f);
  cursor: pointer;
  padding: 12px 0;
  transition: color 0.2s ease;

  &:hover {
    color: var(--md-sys-color-on-surface, #1d1b20);
  }

  md-checkbox {
    --md-checkbox-container-shape: 4px;
  }
}

// Button improvements
md-filled-button {
  --md-filled-button-container-shape: 24px;
  --md-filled-button-container-height: 56px;
  font-size: 16px;
  font-weight: 500;
  transition: var(--select-type-transition);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
}

md-text-button {
  --md-text-button-container-shape: 24px;
  --md-text-button-container-height: 48px;
  font-size: 16px;
  font-weight: 500;
}

md-icon-button {
  --md-icon-button-size: 56px;
  --md-icon-button-state-layer-shape: 16px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
}

// Mobile responsiveness
@media (max-width: 768px) {
  .select-type-page {
    font-size: 14px;
  }

  .content-grid.content-grid--grid {
    padding: 8px 0;
  }

  .grid-card {
    padding: 16px;

    &__icon {
      width: 48px;
      height: 48px;
      margin-bottom: 12px;

      md-icon {
        font-size: 24px;
      }
    }

    &__title {
      font-size: 16px;
    }

    &__subtitle {
      font-size: 13px;
    }

    &__meta-item {
      font-size: 11px;
    }
  }
}

// Accessibility improvements
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .select-type-page {
    --select-type-outline-color: #000000;
  }

  .grid-card {
    border-width: 2px;
  }
}

// Focus visible improvements
.grid-card:focus-visible,
.menu-item:focus-visible {
  outline: 3px solid var(--select-type-primary-color);
  outline-offset: 2px;
}
</style>
