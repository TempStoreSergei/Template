<template>
  <div class="drive-layout">
    <header class="drive-header">
      <!-- Apple Camera Style Navigation -->
      <div class="apple-navigation">
        <!-- Left Arrow -->
        <md-icon-button 
          v-if="canScrollLeft"
          @click="scrollLeft"
          class="nav-arrow nav-arrow-left"
        >
          <md-icon>chevron_left</md-icon>
        </md-icon-button>
        
                 <!-- Navigation Container -->
         <div class="nav-container" ref="navContainer">
           <!-- Depth Indicator -->
           <div class="nav-depth-indicator" :style="{ width: `${Math.min((breadcrumbPath.length + 1) * 12, 80)}%` }"></div>
           <div class="nav-track" ref="navTrack" :style="{ transform: `translateX(${scrollOffset}px)` }">
            <!-- Home Button -->
            <div class="nav-item nav-item-home" @click="navigateToPath(null)">
              <div class="nav-item-content">
                <md-icon class="nav-icon">home</md-icon>
                <span class="nav-text">Главная</span>
              </div>
            </div>
            
                         <!-- Category Items -->
             <template v-for="(part, index) in breadcrumbPath" :key="part.id">
               <!-- Glass Separator -->
               <div class="nav-glass-separator">
                 <div class="separator-line"></div>
               </div>
               
               <div 
                 class="nav-item nav-item-category" 
                 :class="{ 'nav-item-active': index === breadcrumbPath.length - 1 }"
                 @click="navigateToPath(index)"
               >
                 <div class="nav-item-content">
                   <md-icon class="nav-icon">folder</md-icon>
                   <span class="nav-text">{{ part.categoryName }}</span>
                 </div>
               </div>
             </template>
          </div>
        </div>
        
        <!-- Right Arrow -->
        <md-icon-button 
          v-if="canScrollRight"
          @click="scrollRight"
          class="nav-arrow nav-arrow-right"
        >
          <md-icon>chevron_right</md-icon>
        </md-icon-button>
      </div>

      <!-- Поисковая строка -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <!-- Селект режима поиска внутри input -->
          <div class="search-mode-selector">
            <md-icon-button 
              @click="toggleSearchModeMenu"
              class="search-mode-btn"
              :class="{ 'active': isSearchModeMenuOpen }"
            >
              <md-icon>{{ getSearchModeIcon() }}</md-icon>
            </md-icon-button>
            
            <!-- Выпадающее меню режимов -->
            <div v-if="isSearchModeMenuOpen" class="search-mode-menu" @click.stop>
              <div 
                v-for="mode in searchModes" 
                :key="mode.value"
                class="search-mode-option"
                :class="{ 'selected': searchMode === mode.value }"
                @click="selectSearchMode(mode.value)"
              >
                <md-icon class="mode-icon">{{ mode.icon }}</md-icon>
                <div class="mode-info">
                  <div class="mode-title">{{ mode.title }}</div>
                  <div class="mode-description">{{ mode.description }}</div>
                </div>
                <md-icon v-if="searchMode === mode.value" class="check-icon">check</md-icon>
              </div>
            </div>
          </div>
          
          <md-icon class="search-icon">search</md-icon>
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            @keyup.enter="performSearch"
            @focus="onSearchFocus"
            @blur="onSearchBlur"
            type="text"
            :placeholder="getSearchPlaceholder()"
            class="search-input"
            readonly
          />
          <md-icon-button
            v-if="searchQuery"
            @click="clearSearch"
            class="clear-search-btn"
          >
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>


        
        <!-- Русская виртуальная клавиатура с интегрированным Dynamic Island -->
        <VirtualKeyboard
          v-model="searchQuery"
          :visible="isKeyboardVisible"
          :suggestions="keyboardSuggestions"
          :max-length="100"
          placeholder="Введите поисковый запрос..."
          return-button-text="Найти"
          @update:model-value="handleKeyboardInput"
          @enter="handleKeyboardEnter"
          @close="handleKeyboardClose"
          @update:visible="isKeyboardVisible = $event"
        >
          <!-- Dynamic Island внутри клавиатуры -->
          <template #dynamic-island>
            <div 
              v-if="showDynamicIsland" 
              class="search-no-results"
              @click="clearSearch"
            >
              <div class="no-results-content">
                <md-icon class="no-results-icon">search_off</md-icon>
                <div class="no-results-text">
                  <div class="no-results-title">Ничего не найдено</div>
                  <div class="no-results-query">{{ searchQuery }}</div>
                </div>
                <div class="no-results-actions">
                  <md-icon-button 
                    v-if="searchMode !== 'global'"
                    @click.stop="switchToGlobalSearch"
                    class="action-btn global-btn"
                    title="Поиск везде"
                  >
                    <md-icon>public</md-icon>
                  </md-icon-button>
                  <md-icon-button 
                    @click.stop="clearSearch"
                    class="action-btn clear-btn"
                    title="Очистить"
                  >
                    <md-icon>close</md-icon>
                  </md-icon-button>
                </div>
              </div>
            </div>
          </template>
        </VirtualKeyboard>
      </div>
    </header>

    <div class="drive-main-wrapper">
      <main class="drive-content">
        <div v-if="isLoading" class="state-container">
          <md-circular-progress indeterminate />
        </div>

        <div v-else-if="error" class="state-container error">
          <span class="material-icons">error_outline</span>
          <p>Не удалось загрузить данные</p>
          <md-text-button @click="fetchData">Повторить</md-text-button>
        </div>

        <div v-else>
          <!-- Показать индикатор загрузки поиска -->
          <div
            v-if="isSearchActive && isSearching"
            class="search-loading"
          >
            <md-circular-progress indeterminate />
            <div class="loading-text">
              <p>{{ searchLoadingText }}</p>
            </div>
          </div>



          <!-- Показать результаты поиска если активен поиск -->
          <div
            v-if="isSearchActive && !isSearching && (searchResults.categoriesData.length > 0 || searchResults.itemsData.length > 0)"
            class="search-results-section"
          >
            <!-- Найденные категории -->
            <div v-if="searchResults.categoriesData.length > 0" class="grid-section">
              <h3 class="section-subtitle">Категории ({{ searchResults.categoriesData.length }})</h3>
              <div class="grid-view">
                <div
                  v-for="category in searchResults.categoriesData"
                  :key="'search-cat-' + category.id"
                  class="grid-item folder"
                  @click="selectSearchCategory(category)"
                >
                  <span class="material-icons grid-item-icon">folder</span>
                  <span class="grid-item-name">{{ category.categoryName }}</span>
                </div>
              </div>
            </div>

            <!-- Найденные блюда -->
            <div v-if="searchResults.itemsData.length > 0" class="grid-section">
              <h3 class="section-subtitle">Блюда ({{ searchResults.itemsData.length }})</h3>
              <div class="grid-view dishes-grid">
                <div
                  v-for="item in searchResults.itemsData"
                  :key="'search-item-' + item.id"
                  class="dish-card"
                  @click="selectItem(item)"
                >
                  <div class="dish-card-content">
                    <div class="dish-icon-container">
                      <md-icon class="dish-icon">restaurant_menu</md-icon>
                    </div>
                    <div class="dish-info-overlay">
                      <h3 class="dish-name">{{ item.itemName }}</h3>
                      <div class="dish-status">
                        <md-chip
                          :class="item.itemInStock ? 'in-stock' : 'out-of-stock'"
                          elevated
                        >
                          {{ item.itemInStock ? "В наличии" : "Нет в наличии" }}
                        </md-chip>
                      </div>
                    </div>
                    <div class="dish-actions">
                      <md-fab
                        size="large"
                        :disabled="!item.itemInStock"
                        @click.stop="printDish(item)"
                        class="print-btn"
                      >
                        <md-icon slot="icon">print</md-icon>
                      </md-fab>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Показать обычную структуру папок если поиск неактивен -->
          <div v-else>
            <div v-if="currentCategories.length > 0" class="grid-section">
              <div class="grid-view">
                <div
                  v-for="item in currentCategories"
                  :key="item.id"
                  class="grid-item folder"
                  @click="openCategory(item)"
                  @dblclick="openCategory(item)"
                >
                  <span class="material-icons grid-item-icon">{{
                    item.children && item.children.length > 0
                      ? "folder"
                      : "topic"
                  }}</span>
                  <span class="grid-item-name">{{ item.categoryName }}</span>
                </div>
              </div>
            </div>

            <div v-if="currentDishes.length > 0" class="grid-section">
              <div class="grid-view dishes-grid">
                <div
                  v-for="item in currentDishes"
                  :key="item.id"
                  class="dish-card"
                  @click="selectItem(item)"
                >
                  <div class="dish-card-content">
                    <div class="dish-icon-container">
                      <md-icon class="dish-icon">restaurant_menu</md-icon>
                    </div>
                    <div class="dish-info-overlay">
                      <h3 class="dish-name">{{ item.itemName }}</h3>
                      <div class="dish-status">
                        <md-chip
                          :class="
                            item.itemInStock ? 'in-stock' : 'out-of-stock'
                          "
                          elevated
                        >
                          {{ item.itemInStock ? "В наличии" : "Нет в наличии" }}
                        </md-chip>
                      </div>
                    </div>
                    <div class="dish-actions">
                      <md-fab
                        size="large"
                        :disabled="!item.itemInStock"
                        @click.stop="printDish(item)"
                        class="print-btn"
                      >
                        <md-icon slot="icon">print</md-icon>
                      </md-fab>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>

    <!-- Модальное окно для отображения деталей блюда -->
    <md-dialog :open="!!selectedItem" @close="closeModal" class="dish-modal">
      <div class="modal-header" slot="headline">
        <span>{{ selectedItem?.itemName }}</span>
        <md-icon-button @click="closeModal">
          <md-icon>close</md-icon>
        </md-icon-button>
      </div>

      <div class="modal-content" slot="content">
        <!-- Тетрадь рецепта -->
        <div v-if="showNotebook" class="notebook-container">
          <!-- Заголовок тетради -->
          <div class="notebook-header">
            <md-icon-button @click="backToDetails" class="back-btn">
              <md-icon>arrow_back</md-icon>
            </md-icon-button>
            <div class="notebook-title">
              <md-icon class="notebook-icon">menu_book</md-icon>
              <h2>Рецепт: {{ selectedItem?.itemName }}</h2>
            </div>
            <div class="notebook-page-indicator">
              Страница {{ currentNotebookPage + 1 }} из {{ notebookPages.length }}
            </div>
          </div>

          <!-- Тетрадь -->
          <div class="notebook">
            <!-- Левая страница -->
            <div 
              v-if="currentNotebookPage > 0"
              class="notebook-page notebook-page-left"
            >
              <div class="page-number">{{ currentNotebookPage }}</div>
              <div class="page-content" v-html="notebookPages[currentNotebookPage - 1]"></div>
            </div>
            
            <!-- Правая страница -->
            <div 
              v-if="notebookPages[currentNotebookPage]"
              class="notebook-page notebook-page-right"
            >
              <div class="page-number">{{ currentNotebookPage + 1 }}</div>
              <div class="page-content" v-html="notebookPages[currentNotebookPage]"></div>
            </div>
          </div>

          <!-- Навигация по страницам -->
          <div class="notebook-navigation">
            <md-icon-button 
              @click="prevPage" 
              :disabled="currentNotebookPage === 0"
              class="nav-button prev-button"
            >
              <md-icon>chevron_left</md-icon>
            </md-icon-button>
            
            <div class="page-dots">
              <div 
                v-for="(page, index) in notebookPages"
                :key="index"
                class="page-dot"
                :class="{ active: index === currentNotebookPage }"
                @click="goToPage(index)"
              ></div>
            </div>
            
            <md-icon-button 
              @click="nextPage" 
              :disabled="currentNotebookPage >= notebookPages.length - 1"
              class="nav-button next-button"
            >
              <md-icon>chevron_right</md-icon>
            </md-icon-button>
          </div>
        </div>

        <!-- Основное содержимое блюда -->
        <div v-else-if="!showRecipe" class="dish-content">
          <!-- Информация о блюде -->
          <div class="dish-info">
            <div class="dish-properties">
              <!-- Счетчик количества с iOS пикерами -->
              <div class="quantity-section">
                <md-filled-button>Количество порций</md-filled-button>
                <div class="six-digit-picker">
                  <TimePicker
                    :data="{
                      source: generateDigits(),
                      count: 10,
                      value: quantityDigits.digit1,
                      sensitivity: 0.8,
                    }"
                    @onChange="setDigit1($event)"
                  />
                  <TimePicker
                    :data="{
                      source: generateDigits(),
                      count: 10,
                      value: quantityDigits.digit2,
                      sensitivity: 0.8,
                    }"
                    @onChange="setDigit2($event)"
                  />
                  <TimePicker
                    :data="{
                      source: generateDigits(),
                      count: 10,
                      value: quantityDigits.digit3,
                      sensitivity: 0.8,
                    }"
                    @onChange="setDigit3($event)"
                  />
                  <TimePicker
                    :data="{
                      source: generateDigits(),
                      count: 10,
                      value: quantityDigits.digit4,
                      sensitivity: 0.8,
                    }"
                    @onChange="setDigit4($event)"
                  />
                  <TimePicker
                    :data="{
                      source: generateDigits(),
                      count: 10,
                      value: quantityDigits.digit5,
                      sensitivity: 0.8,
                    }"
                    @onChange="setDigit5($event)"
                  />
                  <TimePicker
                    :data="{
                      source: generateDigits(),
                      count: 10,
                      value: quantityDigits.digit6,
                      sensitivity: 0.8,
                    }"
                    @onChange="setDigit6($event)"
                  />
                </div>
                <div class="recipe-button-container">
                  <md-filled-button
                    class="recipe-button"
                    :disabled="!selectedItem?.itemRecipe"
                    @click="openRecipe"
                  >
                    <md-icon slot="icon">menu_book</md-icon>
                    Рецепт
                  </md-filled-button>
                </div>
              </div>

              <!-- Ингредиенты с масштабированием -->
              <div class="ingredients-section">
                <div
                  v-if="
                    selectedItem?.ingridients &&
                    selectedItem.ingridients.length > 0
                  "
                >
                  <md-list>
                    <md-list-item
                      v-for="ingredient in scaledIngredients"
                      :key="ingredient.id"
                      type="button"
                    >
                      <md-icon slot="start">local_dining</md-icon>
                      <div slot="headline">{{ ingredient.ingridientName }}</div>
                      <div slot="supporting-text">
                        {{ ingredient.scaledWeight }}
                        {{ ingredient.unitShortname }}
                      </div>
                    </md-list-item>
                  </md-list>
                </div>
                <div v-else class="no-ingredients-placeholder">
                  <md-icon class="placeholder-icon">restaurant</md-icon>
                  <h3>Ингредиенты не указаны</h3>
                  <p>Для этого блюда информация об ингредиентах отсутствует</p>
                </div>
              </div>
            </div>
          </div>

          <div class="right-side">
            <div class="dish-image-container">
              <img
                v-if="selectedItem?.itemImage"
                :src="selectedItem.itemImage"
                :alt="selectedItem.itemName"
                class="dish-image"
                @error="onImageError"
              />
              <div v-else class="dish-image-placeholder">
                <md-icon class="placeholder-icon">restaurant_menu</md-icon>
                <span class="placeholder-text">Нет изображения</span>
              </div>
            </div>
            <div style="height: 100%; margin-bottom: 24px; width: 100%">
              <md-filled-button
                style="height: 100%; width: 100%; border-radius: 24px"
                :disabled="!selectedItem?.itemInStock"
                @click="addToCart"
              >
                <md-icon slot="icon">add_shopping_cart</md-icon>
                Напечатать
              </md-filled-button>
            </div>
          </div>
        </div>

        <!-- Рецепт с табами -->
        <div v-else class="recipe-view">
          <!-- Заголовок рецепта с кнопкой назад -->
          <div class="recipe-header">
            <md-icon-button @click="backToDetails" class="back-btn">
              <md-icon>arrow_back</md-icon>
            </md-icon-button>
            <div class="recipe-title">
              <md-icon class="recipe-icon">menu_book</md-icon>
              <h2>Рецепт: {{ selectedItem?.itemName }}</h2>
            </div>
          </div>

          <!-- Табы для рецепта -->
          <md-tabs class="recipe-tabs" @change="handleTabChange">
            <md-primary-tab :active="activeRecipeTab === 0" @click="activeRecipeTab = 0">
              <md-icon slot="icon">description</md-icon>
              Обычный текст
            </md-primary-tab>
            <md-primary-tab :active="activeRecipeTab === 1" @click="activeRecipeTab = 1">
              <md-icon slot="icon">article</md-icon>
              Форматированный лист
            </md-primary-tab>
          </md-tabs>

          <!-- Контент панели обычного текста -->
          <div v-if="activeRecipeTab === 0" class="recipe-panel">
            <div class="recipe-content raw-recipe">
              <div class="recipe-raw-text">
                {{ selectedItem?.itemRecipe || 'Рецепт не указан' }}
              </div>
            </div>
          </div>

          <!-- Контент панели форматированного листа -->
          <div v-else-if="activeRecipeTab === 1" class="recipe-panel">
            <div class="recipe-content sheet-recipe">
              <div v-if="selectedItem?.itemRecipe" class="recipe-sheet">
                <!-- Заголовок листа -->
                <div class="sheet-header">
                  <md-icon class="sheet-icon">restaurant</md-icon>
                  <h3 class="sheet-title">{{ selectedItem?.itemName }}</h3>
                  <div class="sheet-divider"></div>
                </div>
                
                <!-- Контент в формате markdown -->
                <div class="sheet-body">
                  <div class="markdown-content" v-html="markdownToHtml(selectedItem.itemRecipe)"></div>
                </div>
                
                <!-- Подпись листа -->
                <div class="sheet-footer">
                  <div class="sheet-signature">
                    <md-icon>edit</md-icon>
                    <span>Рецепт от шеф-повара</span>
                  </div>
                </div>
              </div>
              <div v-else class="no-recipe-placeholder">
                <md-icon class="placeholder-icon">menu_book</md-icon>
                <h3>Рецепт не указан</h3>
                <p>Для этого блюда рецепт отсутствует</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </md-dialog>

    <!-- Система уведомлений -->
    <div class="notifications-container">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="[`notification-${notification.type}`]"
      >
        <div class="notification-content">
          <md-icon class="notification-icon">
            {{ getNotificationIcon(notification.type) }}
          </md-icon>
          <span class="notification-message">{{ notification.message }}</span>
          <md-icon-button 
            @click="removeNotification(notification.id)"
            class="notification-close"
          >
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, reactive, nextTick, watch } from "#imports";
import { getCategoriesHierarchy, findItems } from "../api";
import type { Category, Dish } from "../model/types";
import { TimePicker } from "~/shared/basic/picker";
import VirtualKeyboard from "~/shared/basic/keyboard/VirtualKeyboard.vue";

const allCategories = ref<Category[]>([]);
const breadcrumbPath = ref<Category[]>([]);
const isLoading = ref(true);
const error = ref<any>(null);
const selectedItem = ref<Dish | null>(null);
const showRecipe = ref(false); // Состояние для показа рецепта
const showNotebook = ref(false); // Состояние для показа тетради
const activeRecipeTab = ref(0); // Активный таб рецепта (0 - обычный, 1 - лист)
const currentNotebookPage = ref(0); // Текущая страница тетради
const notebookPages = ref<string[]>([]); // Массив страниц тетради

// Apple Navigation State
const navContainer = ref<HTMLElement | null>(null);
const navTrack = ref<HTMLElement | null>(null);
const scrollOffset = ref(0);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const scrollStep = 200;

// Состояние поиска
const searchQuery = ref("");
const searchMode = ref("auto"); // auto, global, local
const isSearchModeMenuOpen = ref(false);

// Состояние виртуальной клавиатуры
const isKeyboardVisible = ref(false);
const keyboardSuggestions = computed(() => {
  if (!searchQuery.value.trim()) {
    return [];
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  
  // Выполняем локальный поиск
  const localResults = performLocalSearch(query);
  const suggestions: Array<{ name: string; type: 'dish' | 'category' }> = [];
  
  // Добавляем категории
  for (const category of localResults.categoriesData) {
    if (suggestions.length >= 3) break;
    suggestions.push({
      name: category.categoryName,
      type: 'category'
    });
  }
  
  // Добавляем блюда если есть место
  for (const dish of localResults.itemsData) {
    if (suggestions.length >= 3) break;
    suggestions.push({
      name: dish.itemName,
      type: 'dish'
    });
  }
  
  return suggestions;
});
const searchResults = ref<{
  categoriesData: Category[];
  itemsData: Dish[];
}>({
  categoriesData: [],
  itemsData: [],
});
const isSearching = ref(false);
const isSearchFocused = ref(false);
const searchLoadingText = ref("Поиск...");
const lastCompletedQuery = ref(""); // Последний завершенный поисковый запрос
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Состояние уведомлений
const notifications = ref<Array<{
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}>>([]);
let notificationId = 0;

// Конфигурация режимов поиска
const searchModes = [
  {
    value: "auto",
    title: "Авто",
    description: "Во время набора - локальный, при поиске - глобальный",
    icon: "auto_awesome",
  },
  {
    value: "global",
    title: "Общий",
    description: "Поиск по всей базе",
    icon: "public",
  },
  {
    value: "local",
    title: "Локальный",
    description: "Только в текущей категории",
    icon: "folder",
  },
];

// Состояние для 6-значного пикера
const quantityDigits = reactive({
  digit1: 0,
  digit2: 0,
  digit3: 0,
  digit4: 0,
  digit5: 0,
  digit6: 1, // По умолчанию 000001
});

const isSearchActive = computed(() => searchQuery.value.trim().length > 0);

// Показывать Dynamic Island только когда:
// - Поиск активен
// - Поиск НЕ выполняется 
// - Нет результатов
// - И текущий запрос совпадает с последним завершенным (чтобы не показывать при вводе нового)
const showDynamicIsland = computed(() => 
  isSearchActive.value && 
  !isSearching.value && 
  searchResults.value.categoriesData.length === 0 && 
  searchResults.value.itemsData.length === 0 &&
  searchQuery.value.trim() === lastCompletedQuery.value.trim()
);

const currentFolder = computed((): Category | null => {
  if (breadcrumbPath.value.length === 0) {
    return null;
  }
  return breadcrumbPath.value[breadcrumbPath.value.length - 1];
});

const currentCategories = computed((): Category[] => {
  if (!currentFolder.value) {
    return allCategories.value;
  }
  return currentFolder.value.children || [];
});

const currentDishes = computed((): Dish[] => {
  if (!currentFolder.value) {
    return []; // No dishes at root level
  }
  return currentFolder.value.items || [];
});

// Вычисляем quantity из цифр
const quantity = computed(() => {
  return (
    quantityDigits.digit1 * 100000 +
    quantityDigits.digit2 * 10000 +
    quantityDigits.digit3 * 1000 +
    quantityDigits.digit4 * 100 +
    quantityDigits.digit5 * 10 +
    quantityDigits.digit6
  );
});

const totalPrice = computed(() => {
  if (!selectedItem.value?.itemPrice) return 0;
  return selectedItem.value.itemPrice * quantity.value;
});



// Масштабированные ингредиенты на основе количества порций
const scaledIngredients = computed(() => {
  if (
    !selectedItem.value?.ingridients ||
    selectedItem.value.ingridients.length === 0
  ) {
    return [];
  }

  return selectedItem.value.ingridients.map((ingredient: any) => ({
    ...ingredient,
    scaledWeight: Math.round(ingredient.ingridientWeight * quantity.value),
  }));
});

// Debounce функция только для обновления suggestions (во время набора)
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    // Во время набора НЕ выполняем поиск результатов
    // Только очищаем результаты если поле пустое
    if (searchQuery.value.trim().length === 0) {
      searchResults.value = {
        categoriesData: [],
        itemsData: [],
      };
      lastCompletedQuery.value = "";
    }
    // suggestions обновляются автоматически через computed keyboardSuggestions
  }, 300); // Уменьшили задержку поскольку не делаем поиск
};



// Функция для получения placeholder в зависимости от режима поиска
const getSearchPlaceholder = () => {
  switch (searchMode.value) {
    case "auto":
      return "Поиск (при наборе - локальный, при Enter - глобальный)...";
    case "global":
      return "Поиск по всем блюдам и категориям...";
    case "local":
      return "Поиск в текущей категории и подкатегориях...";
    default:
      return "Поиск блюд и категорий...";
  }
};

// Функция для получения иконки текущего режима поиска
const getSearchModeIcon = () => {
  const currentMode = searchModes.find(mode => mode.value === searchMode.value);
  return currentMode?.icon || "search";
};

// Переключение меню выбора режима поиска
const toggleSearchModeMenu = () => {
  isSearchModeMenuOpen.value = !isSearchModeMenuOpen.value;
};

// Выбор режима поиска
const selectSearchMode = (mode: string) => {
  searchMode.value = mode;
  isSearchModeMenuOpen.value = false;
  
  // Если есть активный поиск, повторяем его с новым режимом
  if (searchQuery.value.trim().length > 0) {
    performSearch();
  }
};

// Закрытие меню при клике вне его
const closeSearchModeMenu = () => {
  isSearchModeMenuOpen.value = false;
};

// Функции для уведомлений
const showNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 4000) => {
  const notification = {
    id: ++notificationId,
    message,
    type,
    duration,
  };
  
  notifications.value.push(notification);
  
  // Автоматически убираем уведомление через заданное время
  setTimeout(() => {
    removeNotification(notification.id);
  }, duration);
};

const removeNotification = (id: number) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

// Получить название текущего режима поиска
const getCurrentModeTitle = () => {
  const currentMode = searchModes.find(mode => mode.value === searchMode.value);
  return currentMode?.title || "Неизвестный";
};

// Переключиться на глобальный поиск и выполнить полный поиск
const switchToGlobalSearch = () => {
  const previousMode = searchMode.value;
  searchMode.value = "global";
  if (searchQuery.value.trim().length > 0) {
    showNotification("Переключились на глобальный поиск и выполняется полный поиск", "info", 3000);
    performSearch(); // Выполняем полный поиск сразу
  }
};

// Получить иконку для уведомления
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success': return 'check_circle';
    case 'error': return 'error';
    case 'warning': return 'warning';
    case 'info': 
    default: return 'info';
  }
};

// Локальный поиск в текущей категории и подкатегориях
const performLocalSearch = (query: string): { categoriesData: Category[]; itemsData: Dish[] } => {
  const results = {
    categoriesData: [] as Category[],
    itemsData: [] as Dish[],
  };

  const searchInCategory = (category: Category | null) => {
    // Если мы в корне и нет текущей категории
    if (!category) {
      // Ищем в корневых категориях
      for (const cat of allCategories.value) {
        if (cat.categoryName.toLowerCase().includes(query.toLowerCase())) {
          results.categoriesData.push(cat);
        }
        // Рекурсивно ищем в подкатегориях
        searchInSubcategories(cat);
      }
    } else {
      // Ищем в текущей категории
      if (category.categoryName.toLowerCase().includes(query.toLowerCase())) {
        results.categoriesData.push(category);
      }
      
      // Ищем блюда в текущей категории
      if (category.items) {
        for (const item of category.items) {
          if (item.itemName.toLowerCase().includes(query.toLowerCase())) {
            results.itemsData.push(item);
          }
        }
      }
      
      // Ищем в подкатегориях
      searchInSubcategories(category);
    }
  };

  const searchInSubcategories = (parentCategory: Category) => {
    if (parentCategory.children) {
      for (const child of parentCategory.children) {
        if (child.categoryName.toLowerCase().includes(query.toLowerCase())) {
          results.categoriesData.push(child);
        }
        
        // Ищем блюда в подкатегории
        if (child.items) {
          for (const item of child.items) {
            if (item.itemName.toLowerCase().includes(query.toLowerCase())) {
              results.itemsData.push(item);
            }
          }
        }
        
        // Рекурсивно ищем в подподкатегориях
        searchInSubcategories(child);
      }
    }
  };

  searchInCategory(currentFolder.value);
  return results;
};

// Выполнение полного поиска (при нажатии Enter/Найти)
const performSearch = async () => {
  if (searchQuery.value.trim().length === 0) {
    searchResults.value = {
      categoriesData: [],
      itemsData: [],
    };
    return;
  }

  isSearching.value = true;
  const query = searchQuery.value.trim();

  try {
    switch (searchMode.value) {
      case "auto":
        // При полном поиске: сначала локально, потом глобально если ничего не найдено
        searchLoadingText.value = "Поиск в текущей категории...";
        const localResults = performLocalSearch(query);
        
        if (localResults.categoriesData.length > 0 || localResults.itemsData.length > 0) {
          searchResults.value = localResults;
          showNotification(
            `Найдено ${localResults.categoriesData.length + localResults.itemsData.length} результатов в текущей категории`, 
            "success", 
            3000
          );
        } else {
          // Если локально ничего не найдено, ищем глобально
          showNotification("В текущей категории ничего не найдено. Выполняется глобальный поиск...", "info", 4000);
          searchLoadingText.value = "Глобальный поиск...";
          
          // Небольшая задержка для показа уведомления
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          const response = await findItems(query);
          searchResults.value = {
            categoriesData: response.categoriesData || [],
            itemsData: response.itemsData || [],
          };
          
          if ((response.categoriesData?.length || 0) + (response.itemsData?.length || 0) > 0) {
            showNotification(
              `Найдено ${(response.categoriesData?.length || 0) + (response.itemsData?.length || 0)} результатов в глобальном поиске`, 
              "success", 
              3000
            );
          }
        }
        break;
        
      case "global":
        // Ищем только на сервере
        searchLoadingText.value = "Глобальный поиск...";
        const response = await findItems(query);
        searchResults.value = {
          categoriesData: response.categoriesData || [],
          itemsData: response.itemsData || [],
        };
        
        if ((response.categoriesData?.length || 0) + (response.itemsData?.length || 0) > 0) {
          showNotification(
            `Найдено ${(response.categoriesData?.length || 0) + (response.itemsData?.length || 0)} результатов`, 
            "success", 
            3000
          );
        }
        break;
        
      case "local":
        // Ищем только локально
        searchLoadingText.value = "Поиск в текущей категории...";
        const localSearchResults = performLocalSearch(query);
        searchResults.value = localSearchResults;
        
        if (localSearchResults.categoriesData.length + localSearchResults.itemsData.length > 0) {
          showNotification(
            `Найдено ${localSearchResults.categoriesData.length + localSearchResults.itemsData.length} результатов в текущей категории`, 
            "success", 
            3000
          );
        }
        break;
        
      default:
        searchResults.value = {
          categoriesData: [],
          itemsData: [],
        };
    }
  } catch (e) {
    console.error("Search error:", e);
    showNotification("Ошибка при выполнении поиска", "error", 5000);
    searchResults.value = {
      categoriesData: [],
      itemsData: [],
    };
  } finally {
    isSearching.value = false;
    searchLoadingText.value = "Поиск...";
    lastCompletedQuery.value = query;
  }
};

// Очистка поиска
const clearSearch = () => {
  searchQuery.value = "";
  searchResults.value = {
    categoriesData: [],
    itemsData: [],
  };
  isSearchFocused.value = false;
  isSearching.value = false;
  isSearchModeMenuOpen.value = false;
  isKeyboardVisible.value = false; // Закрываем клавиатуру
  lastCompletedQuery.value = ""; // Сбрасываем последний запрос
  
  // Очищаем таймер если он активен
  if (searchTimeout) {
    clearTimeout(searchTimeout);
    searchTimeout = null;
  }
};

// Обработка потери фокуса поиска
const onSearchBlur = () => {
  setTimeout(() => {
    if (!isKeyboardVisible.value) {
      isSearchFocused.value = false;
    }
  }, 200);
};

// Обработка фокуса поиска для показа клавиатуры
const onSearchFocus = () => {
  isSearchFocused.value = true;
  isKeyboardVisible.value = true;
};

// Обработчики виртуальной клавиатуры
const handleKeyboardInput = (value: string) => {
  searchQuery.value = value;
  debouncedSearch();
};

const handleKeyboardEnter = (value: string) => {
  searchQuery.value = value;
  performSearch();
  isKeyboardVisible.value = false;
  isSearchFocused.value = false;
};

const handleKeyboardClose = () => {
  isKeyboardVisible.value = false;
  isSearchFocused.value = false;
};

// Выбор результата поиска - блюдо
const selectSearchResult = (item: Dish) => {
  selectedItem.value = item;
  isSearchFocused.value = false;
  setQuantityFromNumber(1);
};

// Выбор результата поиска - категория
const selectSearchCategory = (category: Category) => {
  // Функция для поиска категории по ID в плоской структуре
  const findCategoryById = (categories: Category[], targetId: string): Category | null => {
    for (const cat of categories) {
      if (cat.id === targetId) {
        return cat;
      }
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryById(cat.children, targetId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  // Функция для построения пути от категории к корню используя categoryParentID
  const buildPathToRoot = (categoryId: string): Category[] => {
    const path: Category[] = [];
    let currentId: string | null = categoryId;

    while (currentId) {
      const cat = findCategoryById(allCategories.value, currentId);
      if (!cat) {
        console.error('Категория не найдена:', currentId);
        break;
      }
      
      path.unshift(cat); // Добавляем в начало массива
      currentId = cat.categoryParentID; // Переходим к родителю
    }

    return path;
  };

  // Строим полный путь от корня до выбранной категории
  const fullPath = buildPathToRoot(category.id);
  
  if (fullPath.length > 0) {
    // Устанавливаем полный путь от корня до выбранной категории
    breadcrumbPath.value = fullPath;
    console.log('Построен путь к категории:', fullPath.map(c => c.categoryName).join(' -> '));
  } else {
    console.error('Не удалось найти путь к категории:', category);
  }

  isSearchFocused.value = false;
  clearSearch();
};

// Печать блюда без модального окна
const printDish = (dish: Dish) => {
  console.log(`Печать блюда: ${dish.itemName}`);
  // Здесь будет логика печати
};

// Функция для правильного склонения слова "порция"
const getPortionText = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "порций";
  }

  if (lastDigit === 1) {
    return "порцию";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "порции";
  }

  return "порций";
};

const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const categoriesData = await getCategoriesHierarchy();
    allCategories.value = categoriesData;
  } catch (e) {
    console.error("Failed to fetch category hierarchy:", e);
    error.value = e;
  } finally {
    isLoading.value = false;
  }
};

const openCategory = (category: Category) => {
  breadcrumbPath.value.push(category);
  // Очищаем поиск при навигации
  clearSearch();
};

const selectItem = (item: Dish) => {
  selectedItem.value = item;
  setQuantityFromNumber(1); // Сброс количества при выборе нового блюда
};

const closeModal = () => {
  selectedItem.value = null;
  showRecipe.value = false; // Сбрасываем состояние рецепта
  showNotebook.value = false; // Сбрасываем состояние тетради
  activeRecipeTab.value = 0; // Сбрасываем активный таб
  currentNotebookPage.value = 0; // Сбрасываем страницу тетради
  notebookPages.value = []; // Очищаем страницы
  setQuantityFromNumber(1);
};

// Функция для генерации цифр 0-9
const generateDigits = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    text: i.toString(),
    value: i,
  }));
};

// Обработчики изменения каждой цифры
const setDigit1 = (value: number) => {
  quantityDigits.digit1 = value;
};

const setDigit2 = (value: number) => {
  quantityDigits.digit2 = value;
};

const setDigit3 = (value: number) => {
  quantityDigits.digit3 = value;
};

const setDigit4 = (value: number) => {
  quantityDigits.digit4 = value;
};

const setDigit5 = (value: number) => {
  quantityDigits.digit5 = value;
};

const setDigit6 = (value: number) => {
  quantityDigits.digit6 = value;
};

// Функция для установки количества из числа
const setQuantityFromNumber = (num: number) => {
  const str = num.toString().padStart(6, "0");
  quantityDigits.digit1 = parseInt(str[0]);
  quantityDigits.digit2 = parseInt(str[1]);
  quantityDigits.digit3 = parseInt(str[2]);
  quantityDigits.digit4 = parseInt(str[3]);
  quantityDigits.digit5 = parseInt(str[4]);
  quantityDigits.digit6 = parseInt(str[5]);
};

const addToCart = () => {
  // Здесь будет логика добавления в корзину
  console.log(
    `Добавлено в корзину: ${selectedItem.value?.itemName}, количество: ${quantity.value}`,
  );
  closeModal();
};

const openRecipe = () => {
  showNotebook.value = true;
  createNotebookPages();
};

// Функция для возврата к основному содержимому модального окна
const backToDetails = () => {
  showRecipe.value = false;
  showNotebook.value = false;
  activeRecipeTab.value = 0; // Сбрасываем активный таб
  currentNotebookPage.value = 0;
  notebookPages.value = [];
};

// Простая функция для конвертации markdown в HTML
const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  
  let html = markdown
    // Заголовки
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Жирный текст
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    
    // Курсив
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    
    // Списки (нумерованные)
    .replace(/^\d+\.\s+(.*)$/gim, '<li class="numbered-item">$1</li>')
    
    // Списки (маркированные)
    .replace(/^[\-\*\+]\s+(.*)$/gim, '<li class="bullet-item">$1</li>')
    
    // Код (inline)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Переносы строк
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Оборачиваем в параграфы если есть контент
  if (html && !html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<h3>')) {
    html = `<p>${html}</p>`;
  }

  // Группируем списки
  html = html
    .replace(/(<li class="numbered-item">.*?<\/li>)/gs, (match) => {
      const items = match.replace(/<li class="numbered-item">/g, '<li>').replace(/<\/li>/g, '</li>');
      return `<ol class="recipe-list">${items}</ol>`;
    })
    .replace(/(<li class="bullet-item">.*?<\/li>)/gs, (match) => {
      const items = match.replace(/<li class="bullet-item">/g, '<li>').replace(/<\/li>/g, '</li>');
      return `<ul class="recipe-list">${items}</ul>`;
    });

  return html;
};

// Улучшенная функция для конвертации markdown в HTML с поддержкой переносов
const advancedMarkdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  
  let html = markdown
    // Обрабатываем переносы строк
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    
    // Заголовки
    .replace(/^### (.*$)/gim, '<h3 class="notebook-h3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="notebook-h2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="notebook-h1">$1</h1>')
    
    // Жирный текст
    .replace(/\*\*(.*?)\*\*/g, '<strong class="notebook-bold">$1</strong>')
    .replace(/__(.*?)__/g, '<strong class="notebook-bold">$1</strong>')
    
    // Курсив
    .replace(/\*(.*?)\*/g, '<em class="notebook-italic">$1</em>')
    .replace(/_(.*?)_/g, '<em class="notebook-italic">$1</em>')
    
    // Зачеркнутый текст
    .replace(/~~(.*?)~~/g, '<del class="notebook-strikethrough">$1</del>')
    
    // Списки (нумерованные)
    .replace(/^\d+\.\s+(.*)$/gim, '<li class="notebook-numbered">$1</li>')
    
    // Списки (маркированные)
    .replace(/^[\-\*\+]\s+(.*)$/gim, '<li class="notebook-bullet">$1</li>')
    
    // Код (блочный)
    .replace(/```([\s\S]*?)```/g, '<pre class="notebook-code-block"><code>$1</code></pre>')
    
    // Код (inline)
    .replace(/`([^`\n]+)`/g, '<code class="notebook-code">$1</code>')
    
    // Цитаты
    .replace(/^>\s+(.*)$/gim, '<blockquote class="notebook-quote">$1</blockquote>')
    
    // Горизонтальная линия
    .replace(/^---+$/gim, '<hr class="notebook-hr">')
    
    // Ссылки
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="notebook-link">$1</a>')
    
    // Двойной перенос = новый параграф
    .replace(/\n\n+/g, '</p><p class="notebook-paragraph">')
    
    // Одинарный перенос = br
    .replace(/\n/g, '<br>');

  // Оборачиваем в параграфы если есть контент
  if (html && !html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<h3>')) {
    html = `<p class="notebook-paragraph">${html}</p>`;
  }

  // Группируем списки
  html = html
    .replace(/(<li class="notebook-numbered">.*?<\/li>)/gs, (match) => {
      const items = match.replace(/<li class="notebook-numbered">/g, '<li>').replace(/<\/li>/g, '</li>');
      return `<ol class="notebook-numbered-list">${items}</ol>`;
    })
    .replace(/(<li class="notebook-bullet">.*?<\/li>)/gs, (match) => {
      const items = match.replace(/<li class="notebook-bullet">/g, '<li>').replace(/<\/li>/g, '</li>');
      return `<ul class="notebook-bullet-list">${items}</ul>`;
    });

  return html;
};

// Создание страниц тетради
const createNotebookPages = () => {
  if (!selectedItem.value?.itemRecipe) {
    notebookPages.value = ['<p class="notebook-empty">Рецепт не указан</p>'];
    return;
  }

  const content = advancedMarkdownToHtml(selectedItem.value.itemRecipe);
  const maxCharsPerPage = 800; // Примерно 800 символов на страницу
  
  // Разбиваем контент на страницы по размеру
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  const pages: string[] = [];
  let currentPage = '';
  let currentLength = 0;
  
  // Проходим по каждому элементу
  const walker = document.createTreeWalker(
    tempDiv,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    null
  );
  
  let node;
  let pageContent = '';
  
  // Простое разбиение по количеству символов
  const plainText = tempDiv.textContent || '';
  const chunks = [];
  
  for (let i = 0; i < plainText.length; i += maxCharsPerPage) {
    chunks.push(plainText.slice(i, i + maxCharsPerPage));
  }
  
  // Если контент слишком короткий, помещаем на одну страницу
  if (content.length <= maxCharsPerPage) {
    pages.push(content);
  } else {
    // Разбиваем по абзацам для лучшего форматирования
    const paragraphs = content.split('</p>');
    let currentPageContent = '';
    let currentPageLength = 0;
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i] + (i < paragraphs.length - 1 ? '</p>' : '');
      const paragraphLength = paragraph.replace(/<[^>]*>/g, '').length;
      
      if (currentPageLength + paragraphLength > maxCharsPerPage && currentPageContent) {
        pages.push(currentPageContent);
        currentPageContent = paragraph;
        currentPageLength = paragraphLength;
      } else {
        currentPageContent += paragraph;
        currentPageLength += paragraphLength;
      }
    }
    
    if (currentPageContent) {
      pages.push(currentPageContent);
    }
  }
  
  notebookPages.value = pages.length > 0 ? pages : [content];
  currentNotebookPage.value = 0;
};

// Навигация по страницам тетради
const nextPage = () => {
  if (currentNotebookPage.value < notebookPages.value.length - 1) {
    currentNotebookPage.value++;
  }
};

const prevPage = () => {
  if (currentNotebookPage.value > 0) {
    currentNotebookPage.value--;
  }
};

const goToPage = (pageIndex: number) => {
  if (pageIndex >= 0 && pageIndex < notebookPages.value.length) {
    currentNotebookPage.value = pageIndex;
  }
};

// Обработчик смены табов рецепта
const handleTabChange = (event: Event) => {
  const target = event.target as any;
  if (target && typeof target.activeTabIndex === 'number') {
    activeRecipeTab.value = target.activeTabIndex;
  }
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("ru-RU");
};

const onImageError = (event: Event) => {
  // Скрываем изображение при ошибке загрузки
  const target = event.target as HTMLImageElement;
  target.style.display = "none";
};

const navigateToPath = (index: number | null) => {
  if (index === null) {
    breadcrumbPath.value = [];
  } else {
    breadcrumbPath.value = breadcrumbPath.value.slice(0, index + 1);
  }
  selectedItem.value = null;
  clearSearch();
  isKeyboardVisible.value = false; // Закрываем клавиатуру при навигации
  // Navigation updates automatically via watcher
};

// Apple Navigation Functions
const updateNavigationScrollability = () => {
  if (!navContainer.value || !navTrack.value) return;
  
  const totalItems = breadcrumbPath.value.length + 1; // +1 для home
  const containerWidth = navContainer.value.offsetWidth;
  const trackWidth = navTrack.value.scrollWidth;
  
  // Показываем стрелки если больше 3 элементов ИЛИ контент не помещается (с учетом padding)
  const hasOverflow = trackWidth > (containerWidth - 20); // -20px для padding
  const shouldShowArrows = totalItems > 3 || hasOverflow;
  
  if (shouldShowArrows && hasOverflow) {
    const maxScrollLeft = trackWidth - containerWidth;
    canScrollRight.value = Math.abs(scrollOffset.value) < maxScrollLeft;
    canScrollLeft.value = scrollOffset.value < 0;
  } else {
    canScrollRight.value = false;
    canScrollLeft.value = false;
    // Если не нужны стрелки, сбрасываем offset
    if (!hasOverflow) {
      scrollOffset.value = 0;
    }
  }
  
  console.log(`Navigation: items=${totalItems}, container=${containerWidth}, track=${trackWidth}, showArrows=${shouldShowArrows}, hasOverflow=${hasOverflow}`);
};

const scrollLeft = () => {
  const newOffset = Math.min(scrollOffset.value + scrollStep, 0);
  scrollOffset.value = newOffset;
  updateNavigationScrollability();
};

const scrollRight = () => {
  if (!navContainer.value || !navTrack.value) return;
  
  const containerWidth = navContainer.value.offsetWidth;
  const trackWidth = navTrack.value.scrollWidth;
  const maxScroll = -(trackWidth - containerWidth);
  
  const newOffset = Math.max(scrollOffset.value - scrollStep, maxScroll);
  scrollOffset.value = newOffset;
  updateNavigationScrollability();
};

const handleResize = () => {
  // При изменении размера сохраняем позицию или скроллим к последнему элементу
  nextTick(() => {
    setTimeout(() => {
      updateNavigationScrollability();
      // Если был скролл, скроллим к последнему элементу
      if (breadcrumbPath.value.length > 2) {
        scrollToLastElement();
      }
    }, 100);
  });
};

onMounted(() => {
  fetchData();
  
  // Добавляем обработчик клика вне меню
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const searchModeSelector = document.querySelector('.search-mode-selector');
    
    if (searchModeSelector && !searchModeSelector.contains(target)) {
      isSearchModeMenuOpen.value = false;
    }
  });
  
  // Setup navigation
  nextTick(() => {
    updateNavigationScrollability();
  });
  
  // Handle window resize
  window.addEventListener('resize', handleResize);
});

// Watch breadcrumbPath changes for dynamic updates
watch(breadcrumbPath, () => {
  nextTick(() => {
    // Добавляем небольшую задержку для корректного обновления DOM
    setTimeout(() => {
      updateNavigationScrollability();
      // Auto-scroll to last element when path changes
      scrollToLastElement();
    }, 50);
  });
}, { deep: true });

// Auto-scroll to the last (newest) element
const scrollToLastElement = () => {
  if (!navContainer.value || !navTrack.value) return;
  
  const containerWidth = navContainer.value.offsetWidth;
  const trackWidth = navTrack.value.scrollWidth;
  
  if (trackWidth > containerWidth) {
    // Scroll to show the last element
    const maxScroll = trackWidth - containerWidth;
    scrollOffset.value = -maxScroll;
    updateNavigationScrollability();
  }
};

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.drive-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--md-sys-color-surface, #fef7ff);
}

.drive-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--md-sys-color-surface-variant, #e7e0ec);
  flex-shrink: 0;
  position: relative;
}

// Liquid Glass Navigation - iOS 26 Style
.apple-navigation {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 40%;
  min-width: 0;
  position: relative;
}

.nav-arrow {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  backdrop-filter: blur(30px) saturate(180%);
  --md-icon-button-icon-size: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 
    0 2px 16px rgba(103, 80, 164, 0.15),
    0 1px 4px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.4) 0%, 
      rgba(255, 255, 255, 0.1) 50%, 
      rgba(255, 255, 255, 0.2) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: scale(1.08) translateY(-1px);
    box-shadow: 
      0 8px 24px rgba(103, 80, 164, 0.25),
      0 4px 8px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: scale(0.96) translateY(0px);
  }
  
  &.nav-arrow-left {
    border-radius: 22px 16px 16px 22px;
  }
  
  &.nav-arrow-right {
    border-radius: 16px 22px 22px 16px;
  }
  
  md-icon {
    color: var(--md-sys-color-primary, #6750a4);
    position: relative;
    z-index: 1;
  }
}

.nav-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  height: 52px;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 26px;
  backdrop-filter: blur(30px) saturate(180%);
  box-shadow: 
    0 2px 16px rgba(103, 80, 164, 0.12),
    0 1px 4px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.3) 0%, 
      rgba(255, 255, 255, 0.05) 50%, 
      rgba(255, 255, 255, 0.15) 100%);
    border-radius: 26px;
    pointer-events: none;
  }
}

.nav-depth-indicator {
  position: absolute;
  bottom: 2px;
  left: 12px;
  height: 3px;
  background: linear-gradient(90deg, 
    rgba(103, 80, 164, 0.8) 0%,
    rgba(103, 80, 164, 0.4) 70%,
    transparent 100%);
  border-radius: 2px;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 
    0 1px 4px rgba(103, 80, 164, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  z-index: 2;
  
  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0.6) 0%,
      rgba(255, 255, 255, 0.2) 70%,
      transparent 100%);
    border-radius: 3px;
    z-index: -1;
  }
}

.nav-track {
  display: flex;
  align-items: center;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding: 0 20px;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  height: 40px;
  min-width: fit-content;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  margin: 0 2px;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(103, 80, 164, 0.15) 0%, 
      rgba(103, 80, 164, 0.08) 50%, 
      rgba(103, 80, 164, 0.12) 100%);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    background: rgba(255, 255, 255, 0.6);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border-radius: 19px;
    backdrop-filter: blur(20px);
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    
    &::before {
      opacity: 1;
      transform: scale(1.05);
    }
    
    &::after {
      opacity: 0.8;
    }
    
    .nav-text {
      color: var(--md-sys-color-primary, #6750a4);
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
    }
    
    .nav-icon {
      color: var(--md-sys-color-primary, #6750a4);
      transform: scale(1.15) rotate(5deg);
      filter: drop-shadow(0 2px 4px rgba(103, 80, 164, 0.3));
    }
  }
  
  &:active {
    transform: scale(0.96);
    
    &::before {
      opacity: 0.6;
      transform: scale(0.95);
    }
  }
  
  &.nav-item-home {
    .nav-icon {
      color: var(--md-sys-color-primary, #6750a4);
      filter: drop-shadow(0 1px 2px rgba(103, 80, 164, 0.2));
    }
    
    &::before {
      background: linear-gradient(135deg, 
        rgba(103, 80, 164, 0.2) 0%, 
        rgba(103, 80, 164, 0.1) 50%, 
        rgba(103, 80, 164, 0.15) 100%);
    }
  }
  
  &.nav-item-category {
    .nav-icon {
      color: var(--md-sys-color-secondary, #625b71);
      filter: drop-shadow(0 1px 2px rgba(98, 91, 113, 0.15));
    }
    
    &::before {
      background: linear-gradient(135deg, 
        rgba(98, 91, 113, 0.12) 0%, 
        rgba(98, 91, 113, 0.06) 50%, 
        rgba(98, 91, 113, 0.1) 100%);
    }
  }
}

.nav-item-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  position: relative;
  z-index: 2;
}

.nav-icon {
  font-size: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface, #1d1b20);
  white-space: nowrap;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

// Glass Separator
.nav-glass-separator {
  display: flex;
  align-items: center;
  margin: 0 8px;
  height: 24px;
  position: relative;
}

.separator-line {
  width: 2px;
  height: 16px;
  background: linear-gradient(180deg, 
    rgba(103, 80, 164, 0.3) 0%,
    rgba(103, 80, 164, 0.6) 50%,
    rgba(103, 80, 164, 0.3) 100%);
  border-radius: 1px;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -1px;
    width: 4px;
    height: 20px;
    background: radial-gradient(ellipse at center, 
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%);
    border-radius: 2px;
    backdrop-filter: blur(2px);
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: radial-gradient(circle, 
      rgba(103, 80, 164, 0.4) 0%,
      transparent 70%);
    border-radius: 50%;
    backdrop-filter: blur(1px);
  }
}

// Active Item Style
.nav-item-active {
  background: linear-gradient(135deg, 
    rgba(103, 80, 164, 0.15) 0%,
    rgba(103, 80, 164, 0.25) 50%,
    rgba(103, 80, 164, 0.15) 100%) !important;
  box-shadow: 
    0 2px 8px rgba(103, 80, 164, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(103, 80, 164, 0.1);
  
  &::before {
    opacity: 0.4 !important;
    background: linear-gradient(135deg, 
      rgba(103, 80, 164, 0.3) 0%, 
      rgba(103, 80, 164, 0.2) 50%, 
      rgba(103, 80, 164, 0.25) 100%) !important;
  }
  
  &::after {
    opacity: 1 !important;
    background: rgba(255, 255, 255, 0.9) !important;
  }
  
  .nav-text {
    color: var(--md-sys-color-primary, #6750a4) !important;
    font-weight: 700 !important;
    text-shadow: 
      0 1px 2px rgba(255, 255, 255, 0.9),
      0 0 8px rgba(103, 80, 164, 0.3) !important;
  }
  
  .nav-icon {
    color: var(--md-sys-color-primary, #6750a4) !important;
    transform: scale(1.1) !important;
    filter: drop-shadow(0 2px 6px rgba(103, 80, 164, 0.4)) !important;
  }
}

.drive-main-wrapper {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.drive-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 24px;
}

.grid-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant, #49454f);
  margin: 0 0 16px;
  padding: 0 4px;
}

.section-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: var(--md-sys-color-primary, #6750a4);
  margin: 0 0 12px;
  padding: 0 4px;
}

.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.grid-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  border-radius: 16px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
  font-size: 16px;

  &.file {
    .grid-item-icon {
      color: var(--md-sys-color-secondary, #625b71);
    }
  }

  &:hover {
    box-shadow: var(--md-sys-elevation-level-2);
  }
}

.grid-item-icon {
  font-size: 32px;
  margin-right: 20px;
  color: var(--md-sys-color-primary, #6750a4);
}

.grid-item-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--md-sys-color-on-surface, #1d1b20);
  font-weight: 500;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;

  &.error {
    color: var(--md-sys-color-error, #b3261e);
    .material-icons {
      font-size: 48px;
    }
  }
}

md-circular-progress {
  --md-circular-progress-size: 64px;
}

// Стили модального окна
.dish-modal {
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
}

.modal-content {
  padding: 0;
  height: 75vh;
  overflow: hidden;
}

.dish-content {
  display: flex;
  gap: 32px;
  height: 100%;
  padding: 24px;
}

.dish-image-container {
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--md-sys-color-surface-container, #f3edf7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dish-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dish-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-surface-variant, #49454f);
  gap: 8px;
}

.placeholder-icon {
  font-size: 64px;
}

.placeholder-text {
  font-size: 16px;
  font-weight: 500;
}

.dish-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dish-properties {
  display: flex;
  gap: 16px;
  height: calc(100% - 64px);
}

.property-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.property-icon {
  font-size: 20px;
  color: var(--md-sys-color-primary, #6750a4);
}

.property-label {
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant, #49454f);
  min-width: 120px;
}

.property-value {
  color: var(--md-sys-color-on-surface, #1d1b20);

  &.price {
    font-weight: 600;
    font-size: 18px;
    color: var(--md-sys-color-primary, #6750a4);
  }
}

md-chip {
  &.in-stock {
    --md-elevated-chip-container-color: var(--md-sys-color-primary-container);
    --md-elevated-chip-label-text-color: var(
      --md-sys-color-on-primary-container
    );
  }

  &.out-of-stock {
    --md-elevated-chip-container-color: var(--md-sys-color-error-container);
    --md-elevated-chip-label-text-color: var(--md-sys-color-on-error-container);
  }
}

.quantity-section {
  margin-top: 24px;
  flex: 0 0 384px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  h4 {
    font-size: 18px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface, #1d1b20);
    text-align: start;
  }
}

// 6-значный пикер
.six-digit-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 24px;
  overflow: hidden;
}

.recipe-button-container {
  flex: 1;
  display: flex;
  align-items: stretch;
}

.recipe-button {
  width: 100%;
  height: 100%;
  border-radius: 24px;
}

.quantity-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 12px 16px;
  background: var(--md-sys-color-surface-container, #f3edf7);
  border-radius: 12px;
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
}

.quantity-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant, #49454f);
}

.quantity-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--md-sys-color-primary, #6750a4);
  font-family: "SF Mono", "Monaco", "Consolas", monospace;
  letter-spacing: 1px;
}

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: var(--md-sys-color-primary-container, #eaddff);
  border-radius: 12px;
  margin-top: 16px;
}

.total-label {
  font-size: 16px;
  font-weight: 500;
  color: var(--md-sys-color-on-primary-container, #21005d);
}

.total-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--md-sys-color-on-primary-container, #21005d);
}

.recipe-section {
  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px;
    font-size: 20px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface, #1d1b20);
  }
}

.ingredients-section {
  margin-top: 24px;
  width: 100%;
  height: 100%;
  overflow: auto;
  margin-bottom: 24px;

  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px;
    font-size: 20px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface, #1d1b20);
  }

  md-list {
    background: var(--md-sys-color-surface-container, #f3edf7);
    border-radius: 12px;
    overflow: hidden;
  }

  md-list-item {
    border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);

    &:last-child {
      border-bottom: none;
    }
  }

  .no-ingredients-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 300px;
    overflow: hidden;
    text-align: center;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    background: var(--md-sys-color-surface-container, #f3edf7);
    border-radius: 24px;

    .placeholder-icon {
      font-size: 72px;
      margin-bottom: 16px;
      opacity: 0.6;
    }

    h3 {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 500;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    p {
      margin: 0;
      font-size: 16px;
      opacity: 0.8;
      max-width: 300px;
      line-height: 1.5;
    }
  }
}

.section-icon {
  font-size: 24px;
  color: var(--md-sys-color-primary, #6750a4);
}

.recipe-content {
  background-color: var(--md-sys-color-surface-container, #f3edf7);
  border-radius: 12px;
  padding: 20px;
}

.recipe-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recipe-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.step-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: linear-gradient(
    135deg,
    var(--md-sys-color-primary, #6750a4),
    var(--md-sys-color-secondary, #625b71)
  );
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-top: 2px;
}

.step-content {
  flex: 1;
  line-height: 1.6;
  color: var(--md-sys-color-on-surface, #1d1b20);
  font-size: 15px;

  :deep(strong) {
    color: var(--md-sys-color-primary, #6750a4);
    font-weight: 600;
  }

  :deep(em) {
    color: var(--md-sys-color-secondary, #625b71);
    font-style: italic;
  }

  :deep(.measurement) {
    background: var(--md-sys-color-tertiary-container, #ffd8e4);
    color: var(--md-sys-color-on-tertiary-container, #31111d);
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 13px;
  }

  :deep(.action) {
    background: var(--md-sys-color-secondary-container, #e8def8);
    color: var(--md-sys-color-on-secondary-container, #1d192b);
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 13px;
  }
}

.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 16px 24px;
}

.right-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 0 0 300px;
}



// Стили поисковой строки
.search-container {
  position: relative;
  flex: 1;
  max-width: none;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

// Стили для встроенного селектора режимов
.search-mode-selector {
  position: absolute;
  left: 8px;
  z-index: 10;
}

.search-mode-btn {
  width: 32px;
  height: 32px;
  --md-icon-button-icon-size: 20px;
  
  &.active {
    background-color: var(--md-sys-color-primary-container, #eaddff);
    
    md-icon {
      color: var(--md-sys-color-on-primary-container, #21005d);
    }
  }
  
  md-icon {
    color: var(--md-sys-color-primary, #6750a4);
    transition: color 0.2s ease;
  }
}

.search-mode-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 280px;
  background: var(--md-sys-color-surface, #fef7ff);
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  border-radius: 12px;
  box-shadow: var(--md-sys-elevation-level-3);
  overflow: hidden;
  z-index: 1000;
  
  // Стрелка указывающая на кнопку
  &::before {
    content: "";
    position: absolute;
    top: -6px;
    left: 16px;
    width: 12px;
    height: 12px;
    background: var(--md-sys-color-surface, #fef7ff);
    border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    border-bottom: none;
    border-right: none;
    transform: rotate(45deg);
  }
}

.search-mode-option {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid var(--md-sys-color-surface-variant, #e7e0ec);
  
  &:last-child {
    border-bottom: none;
  }
  
  &.selected {
    background-color: var(--md-sys-color-primary-container, #eaddff);
    
    .mode-title {
      color: var(--md-sys-color-on-primary-container, #21005d);
      font-weight: 600;
    }
    
    .mode-description {
      color: var(--md-sys-color-on-primary-container, #21005d);
      opacity: 0.8;
    }
    
    .mode-icon {
      color: var(--md-sys-color-on-primary-container, #21005d);
    }
  }
}

.mode-icon {
  font-size: 20px;
  margin-right: 12px;
  color: var(--md-sys-color-primary, #6750a4);
  flex-shrink: 0;
}

.mode-info {
  flex: 1;
}

.mode-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface, #1d1b20);
  margin-bottom: 2px;
}

.mode-description {
  font-size: 12px;
  color: var(--md-sys-color-on-surface-variant, #49454f);
  line-height: 1.3;
}

.check-icon {
  font-size: 18px;
  color: var(--md-sys-color-primary, #6750a4);
  margin-left: 8px;
}

.search-icon {
  position: absolute;
  left: 52px;
  color: var(--md-sys-color-on-surface-variant, #49454f);
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 88px; // Увеличили отступ слева для селектора и иконки поиска
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  border-radius: 24px;
  font-size: 16px;
  color: var(--md-sys-color-on-surface, #1d1b20);
  background-color: var(--md-sys-color-surface, #fef7ff);
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: var(--md-sys-color-primary, #6750a4);
    box-shadow: 0 0 0 2px var(--md-sys-color-primary-container, #eaddff);
  }

  &::placeholder {
    color: var(--md-sys-color-on-surface-variant, #49454f);
  }
}

.clear-search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: var(--md-sys-color-surface, #fef7ff);
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  border-radius: 12px;
  box-shadow: var(--md-sys-elevation-level-3);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--md-sys-color-surface-variant, #e7e0ec);

  &:last-child {
    border-bottom: none;
  }
}

.result-icon {
  margin-right: 12px;
  color: var(--md-sys-color-secondary, #625b71);
}

.result-name {
  font-size: 16px;
  color: var(--md-sys-color-on-surface, #1d1b20);
}

.search-section {
  &:not(:last-child) {
    border-bottom: 1px solid var(--md-sys-color-surface-variant, #e7e0ec);
    padding-bottom: 12px;
    margin-bottom: 12px;
  }
}

.search-section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--md-sys-color-primary, #6750a4);
  margin: 0 0 8px 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-status {
  margin-left: auto;
  font-size: 10px;

  &.in-stock {
    --md-elevated-chip-container-color: var(--md-sys-color-primary-container, #eaddff);
    --md-elevated-chip-label-text-color: var(--md-sys-color-on-primary-container, #21005d);
  }

  &.out-of-stock {
    --md-elevated-chip-container-color: var(--md-sys-color-error-container, #f9dedc);
    --md-elevated-chip-label-text-color: var(--md-sys-color-on-error-container, #410e0b);
  }
}

.search-results-section {
  margin-bottom: 32px;
}

// Стили для сетки блюд в стиле Google Drive
.dishes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.dish-card {
  position: relative;
  background-color: var(--md-sys-color-surface, #fef7ff);
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  height: 200px;

  &:hover {
    transform: translateY(-2px);
  }
}

.dish-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.dish-icon-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--md-sys-color-primary-container, #eaddff),
    var(--md-sys-color-secondary-container, #e8def8)
  );
  position: relative;
}

.dish-icon {
  font-size: 72px;
  color: var(--md-sys-color-on-primary-container, #21005d);
  opacity: 0.8;
}

.dish-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.6),
    transparent
  );
  color: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dish-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dish-status {
  display: flex;
  align-items: center;
}

.dish-status md-chip {
  font-size: 12px;
  font-weight: 500;

  &.in-stock {
    --md-elevated-chip-container-color: rgba(76, 175, 80, 0.9);
    --md-elevated-chip-label-text-color: white;
  }

  &.out-of-stock {
    --md-elevated-chip-container-color: rgba(244, 67, 54, 0.9);
    --md-elevated-chip-label-text-color: white;
  }
}

.dish-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}

.print-btn {
  --md-fab-container-color: var(--md-sys-color-primary, #6750a4);
  --md-fab-label-text-color: white;
  --md-fab-icon-color: white;
}


.print-btn:disabled {
  opacity: 0.3 !important;
  --md-fab-container-color: var(--md-sys-color-surface-variant, #e7e0ec);
  --md-fab-label-text-color: var(--md-sys-color-on-surface-variant, #49454f);
}



// Стили для минималистичного индикатора загрузки
.search-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  gap: 12px;
  background: var(--md-sys-color-surface, #fef7ff);
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  border-radius: 12px;
  margin: 16px 0;
  
  md-circular-progress {
    --md-circular-progress-size: 32px;
    --md-circular-progress-active-indicator-color: var(--md-sys-color-primary, #6750a4);
  }
}

.loading-text {
  text-align: center;
  
  p {
    font-size: 14px;
    font-weight: 400;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    margin: 0;
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

// Стили для поиска "ничего не найдено" в клавиатуре
.search-no-results {
  width: 100%;
  background: var(--md-sys-color-surface-container-high, #e6e0e9);
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 
      0 2px 4px rgba(103, 80, 164, 0.08),
      0 1px 2px rgba(103, 80, 164, 0.04);
  }
}

.no-results-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.no-results-icon {
  color: var(--md-sys-color-error, #b3261e);
  font-size: 18px;
  flex-shrink: 0;
}

.no-results-text {
  flex: 1;
  min-width: 0;
}

.no-results-title {
  color: var(--md-sys-color-on-surface, #1d1b20);
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 2px 0;
}

.no-results-query {
  color: var(--md-sys-color-error, #b3261e);
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.no-results-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  --md-icon-button-icon-size: 14px;
  transition: all 0.2s ease;
  
  &.global-btn {
    background: var(--md-sys-color-primary-container, #eaddff);
    border: 1px solid var(--md-sys-color-primary, #6750a4);
    
    md-icon {
      color: var(--md-sys-color-primary, #6750a4);
    }
    
    &:hover {
      background: var(--md-sys-color-primary, #6750a4);
      
      md-icon {
        color: var(--md-sys-color-on-primary, #ffffff);
      }
    }
  }
  
  &.clear-btn {
    background: var(--md-sys-color-surface-container-highest, #e6e0e9);
    border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    
    md-icon {
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
    
    &:hover {
      background: var(--md-sys-color-error, #b3261e);
      border-color: var(--md-sys-color-error, #b3261e);
      
      md-icon {
        color: var(--md-sys-color-on-error, #ffffff);
      }
    }
  }
}

@keyframes slideDown {
  0% {
    transform: translateY(-5px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

// Стили для системы уведомлений
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  pointer-events: none;
}

.notification {
  background: var(--md-sys-color-surface, #fef7ff);
  border-radius: 12px;
  box-shadow: var(--md-sys-elevation-level-3);
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  animation: slideIn 0.3s ease-out;
  pointer-events: auto;
  
  &.notification-success {
    background: var(--md-sys-color-primary-container, #eaddff);
    border-color: var(--md-sys-color-primary, #6750a4);
    
    .notification-icon {
      color: var(--md-sys-color-primary, #6750a4);
    }
    
    .notification-message {
      color: var(--md-sys-color-on-primary-container, #21005d);
    }
  }
  
  &.notification-error {
    background: var(--md-sys-color-error-container, #f9dedc);
    border-color: var(--md-sys-color-error, #b3261e);
    
    .notification-icon {
      color: var(--md-sys-color-error, #b3261e);
    }
    
    .notification-message {
      color: var(--md-sys-color-on-error-container, #410e0b);
    }
  }
  
  &.notification-warning {
    background: var(--md-sys-color-tertiary-container, #ffd8e4);
    border-color: var(--md-sys-color-tertiary, #7d5260);
    
    .notification-icon {
      color: var(--md-sys-color-tertiary, #7d5260);
    }
    
    .notification-message {
      color: var(--md-sys-color-on-tertiary-container, #31111d);
    }
  }
  
  &.notification-info {
    background: var(--md-sys-color-secondary-container, #e8def8);
    border-color: var(--md-sys-color-secondary, #625b71);
    
    .notification-icon {
      color: var(--md-sys-color-secondary, #625b71);
    }
    
    .notification-message {
      color: var(--md-sys-color-on-secondary-container, #1d192b);
    }
  }
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.notification-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.notification-close {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  --md-icon-button-icon-size: 18px;
  
  md-icon {
    color: currentColor;
    opacity: 0.6;
  }
  
  &:hover md-icon {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

// Стили для режима просмотра рецепта
.recipe-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 75vh;
  padding: 24px;
}

.recipe-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
}

.back-btn {
  flex-shrink: 0;
  --md-icon-button-icon-size: 24px;
  
  md-icon {
    color: var(--md-sys-color-primary, #6750a4);
  }

}

.recipe-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  
  .recipe-icon {
    font-size: 28px;
    color: var(--md-sys-color-primary, #6750a4);
  }
  
  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--md-sys-color-on-surface, #1d1b20);
    line-height: 1.2;
  }
}

// Стили для табов рецепта
.recipe-tabs {
  --md-primary-tab-container-color: var(--md-sys-color-surface, #fef7ff);
  --md-primary-tab-active-indicator-color: var(--md-sys-color-primary, #6750a4);
  --md-primary-tab-label-text-color: var(--md-sys-color-on-surface-variant, #49454f);
  --md-primary-tab-active-label-text-color: var(--md-sys-color-primary, #6750a4);
  --md-primary-tab-icon-color: var(--md-sys-color-on-surface-variant, #49454f);
  --md-primary-tab-active-icon-color: var(--md-sys-color-primary, #6750a4);
  margin-bottom: 16px;
  
  md-primary-tab {
    flex: 1;
    font-weight: 500;
    cursor: pointer;
    
    md-icon {
      margin-right: 8px;
    }
  }
}

.recipe-panel {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--md-sys-color-surface-container-low, #f7f2fa);
  border-radius: 12px;
  margin-top: 16px;
}

.recipe-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

// Стили для обычного текста рецепта
.raw-recipe {
  .recipe-raw-text {
    font-size: 16px;
    line-height: 1.6;
    color: var(--md-sys-color-on-surface, #1d1b20);
    white-space: pre-wrap;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--md-sys-color-surface, #fef7ff);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.05),
      0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

// Стили для листа рецепта (sheet-like)
.sheet-recipe {
  .recipe-sheet {
    background: var(--md-sys-color-surface, #fef7ff);
    border-radius: 16px;
    border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.08),
      0 2px 8px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    position: relative;
    
    // Имитация бумажного листа
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        linear-gradient(90deg, 
          transparent 0%, 
          rgba(255, 182, 193, 0.1) 48px, 
          rgba(255, 182, 193, 0.2) 50px, 
          rgba(255, 182, 193, 0.1) 52px, 
          transparent 100%);
      pointer-events: none;
      z-index: 1;
    }
    
    // Линии как на тетрадном листе
    &::after {
      content: "";
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: repeating-linear-gradient(
        transparent 0px,
        transparent 23px,
        rgba(173, 216, 230, 0.3) 24px,
        rgba(173, 216, 230, 0.3) 25px,
        transparent 26px
      );
      pointer-events: none;
      z-index: 2;
    }
  }
}

.sheet-header {
  position: relative;
  z-index: 3;
  padding: 24px 24px 16px;
  background: linear-gradient(
    135deg, 
    var(--md-sys-color-primary-container, #eaddff) 0%,
    var(--md-sys-color-secondary-container, #e8def8) 100%
  );
  display: flex;
  align-items: center;
  gap: 12px;
  
  .sheet-icon {
    font-size: 24px;
    color: var(--md-sys-color-primary, #6750a4);
  }
  
  .sheet-title {
    flex: 1;
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--md-sys-color-on-primary-container, #21005d);
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
  }
  
  .sheet-divider {
    width: 60px;
    height: 2px;
    background: linear-gradient(
      90deg,
      var(--md-sys-color-primary, #6750a4) 0%,
      var(--md-sys-color-secondary, #625b71) 100%
    );
    border-radius: 1px;
  }
}

.sheet-body {
  position: relative;
  z-index: 3;
  padding: 24px 24px 24px 76px; // Отступ слева для красной линии
  min-height: 300px;
  
  .markdown-content {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 16px;
    line-height: 1.8;
    color: var(--md-sys-color-on-surface, #1d1b20);
    
    h1, h2, h3 {
      color: var(--md-sys-color-primary, #6750a4);
      font-weight: 600;
      margin: 20px 0 12px 0;
      text-decoration: underline;
      text-decoration-color: var(--md-sys-color-primary, #6750a4);
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;
    }
    
    h1 { font-size: 22px; }
    h2 { font-size: 20px; }
    h3 { font-size: 18px; }
    
    p {
      margin: 12px 0;
      text-align: justify;
      text-indent: 20px; // Отступ первой строки как в рукописи
    }
    
    strong {
      color: var(--md-sys-color-primary, #6750a4);
      font-weight: 700;
    }
    
    em {
      color: var(--md-sys-color-secondary, #625b71);
      font-style: italic;
    }
    
    code {
      background: var(--md-sys-color-tertiary-container, #ffd8e4);
      color: var(--md-sys-color-on-tertiary-container, #31111d);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 14px;
    }
    
    .recipe-list {
      margin: 16px 0;
      padding-left: 24px;
      
      li {
        margin: 8px 0;
        line-height: 1.6;
        position: relative;
        
        &::marker {
          color: var(--md-sys-color-primary, #6750a4);
          font-weight: bold;
        }
      }
    }
    
    ol.recipe-list {
      li {
        counter-increment: recipe-step;
        
        &::before {
          content: counter(recipe-step) ".";
          position: absolute;
          left: -24px;
          color: var(--md-sys-color-primary, #6750a4);
          font-weight: bold;
          background: var(--md-sys-color-primary-container, #eaddff);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          top: 2px;
        }
      }
    }
    
    ul.recipe-list {
      list-style: none;
      
      li::before {
        content: "•";
        position: absolute;
        left: -20px;
        color: var(--md-sys-color-primary, #6750a4);
        font-weight: bold;
        font-size: 18px;
        top: -2px;
      }
    }
  }
}

.sheet-footer {
  position: relative;
  z-index: 3;
  padding: 16px 24px 24px;
  border-top: 1px dashed var(--md-sys-color-outline-variant, #cac4d0);
  margin-top: 20px;
  
  .sheet-signature {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    font-style: italic;
    font-size: 14px;
    
    md-icon {
      font-size: 16px;
      opacity: 0.7;
    }
  }
}

// Стили для тетради рецепта
.notebook-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 75vh;
  padding: 0;
  overflow: hidden;
}

.notebook-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: linear-gradient(
    135deg, 
    var(--md-sys-color-primary-container, #eaddff) 0%,
    var(--md-sys-color-secondary-container, #e8def8) 100%
  );
  border-bottom: 2px solid var(--md-sys-color-outline-variant, #cac4d0);
  flex-shrink: 0;
  
  .back-btn {
    flex-shrink: 0;
    --md-icon-button-icon-size: 24px;
    
    md-icon {
      color: var(--md-sys-color-primary, #6750a4);
    }

  }
  
  .notebook-title {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    
    .notebook-icon {
      font-size: 28px;
      color: var(--md-sys-color-primary, #6750a4);
    }
    
    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--md-sys-color-on-primary-container, #21005d);
    }
  }
  
  .notebook-page-indicator {
    font-size: 14px;
    color: var(--md-sys-color-on-primary-container, #21005d);
    font-weight: 500;
    background: rgba(255, 255, 255, 0.3);
    padding: 6px 12px;
    border-radius: 12px;
    backdrop-filter: blur(8px);
  }
}

.notebook {
  flex: 1;
  display: flex;
  background: 
    linear-gradient(to right, 
      transparent 0%, 
      transparent 49%, 
      rgba(139, 69, 19, 0.3) 49.5%, 
      rgba(139, 69, 19, 0.3) 50.5%, 
      transparent 51%, 
      transparent 100%
    ),
    linear-gradient(135deg, #f8f5f0 0%, #fff8f0 100%);
  box-shadow: 
    inset 0 0 20px rgba(139, 69, 19, 0.1),
    0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  // Спиральная привязка слева
  &::before {
    content: "";
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 10px;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 20px,
      rgba(139, 69, 19, 0.4) 22px,
      rgba(139, 69, 19, 0.4) 28px,
      transparent 30px
    );
    z-index: 1;
  }
}

.notebook-page {
  flex: 1;
  position: relative;
  padding: 40px 30px 40px 50px;
  background: 
    // Линии тетради
    repeating-linear-gradient(
      transparent 0px,
      transparent 27px,
      rgba(173, 216, 230, 0.4) 28px,
      rgba(173, 216, 230, 0.4) 29px,
      transparent 30px
    ),
    // Красная линия поля
    linear-gradient(
      to right,
      transparent 0px,
      transparent 48px,
      rgba(255, 0, 0, 0.2) 49px,
      rgba(255, 0, 0, 0.2) 50px,
      transparent 51px
    ),
    // Фон страницы
    linear-gradient(135deg, #fffef8 0%, #fefcf0 100%);
  min-height: 500px;
  overflow-y: auto;
  
  &.notebook-page-left {
    border-right: 1px solid rgba(139, 69, 19, 0.2);
  }
  
  &.notebook-page-right {
    border-left: 1px solid rgba(139, 69, 19, 0.2);
  }
}

.page-number {
  position: absolute;
  bottom: 16px;
  right: 20px;
  font-family: 'Georgia', serif;
  font-size: 12px;
  color: rgba(139, 69, 19, 0.6);
  font-weight: 500;
}

.page-content {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 16px;
  line-height: 1.7;
  color: #2c1810;
  position: relative;
  z-index: 2;
  
  // Стили для markdown элементов в тетради
  .notebook-h1 {
    font-size: 24px;
    color: var(--md-sys-color-primary, #6750a4);
    font-weight: 700;
    margin: 20px 0 16px 0;
    text-decoration: underline;
    text-decoration-color: var(--md-sys-color-primary, #6750a4);
    text-decoration-thickness: 2px;
    text-underline-offset: 6px;
    font-family: 'Georgia', serif;
  }
  
  .notebook-h2 {
    font-size: 20px;
    color: var(--md-sys-color-secondary, #625b71);
    font-weight: 600;
    margin: 16px 0 12px 0;
    border-bottom: 1px solid var(--md-sys-color-secondary, #625b71);
    padding-bottom: 4px;
    font-family: 'Georgia', serif;
  }
  
  .notebook-h3 {
    font-size: 18px;
    color: var(--md-sys-color-tertiary, #7d5260);
    font-weight: 600;
    margin: 12px 0 8px 0;
    font-family: 'Georgia', serif;
  }
  
  .notebook-paragraph {
    margin: 12px 0;
    text-align: justify;
    text-indent: 30px;
    line-height: 1.8;
  }
  
  .notebook-bold {
    color: var(--md-sys-color-primary, #6750a4);
    font-weight: 700;
  }
  
  .notebook-italic {
    color: var(--md-sys-color-secondary, #625b71);
    font-style: italic;
  }
  
  .notebook-strikethrough {
    text-decoration: line-through;
    opacity: 0.7;
  }
  
  .notebook-code {
    background: rgba(255, 182, 193, 0.2);
    color: #8b4513;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 14px;
    border: 1px solid rgba(255, 182, 193, 0.4);
  }
  
  .notebook-code-block {
    background: rgba(255, 182, 193, 0.1);
    border: 1px solid rgba(255, 182, 193, 0.3);
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    overflow-x: auto;
    
    code {
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 14px;
      color: #8b4513;
    }
  }
  
  .notebook-quote {
    border-left: 4px solid var(--md-sys-color-primary, #6750a4);
    margin: 16px 0;
    padding: 8px 16px;
    background: rgba(103, 80, 164, 0.05);
    font-style: italic;
    color: var(--md-sys-color-primary, #6750a4);
  }
  
  .notebook-hr {
    border: none;
    height: 2px;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--md-sys-color-outline, #79747e) 20%,
      var(--md-sys-color-outline, #79747e) 80%,
      transparent 100%
    );
    margin: 24px 0;
  }
  
  .notebook-link {
    color: var(--md-sys-color-primary, #6750a4);
    text-decoration: underline;
    
    &:hover {
      color: var(--md-sys-color-secondary, #625b71);
    }
  }
  
  .notebook-numbered-list {
    margin: 16px 0;
    padding-left: 30px;
    counter-reset: notebook-counter;
    
    li {
      margin: 8px 0;
      line-height: 1.7;
      position: relative;
      counter-increment: notebook-counter;
      
      &::before {
        content: counter(notebook-counter) ".";
        position: absolute;
        left: -30px;
        color: var(--md-sys-color-primary, #6750a4);
        font-weight: bold;
        background: var(--md-sys-color-primary-container, #eaddff);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        top: 2px;
        border: 1px solid var(--md-sys-color-primary, #6750a4);
      }
    }
  }
  
  .notebook-bullet-list {
    margin: 16px 0;
    padding-left: 25px;
    list-style: none;
    
    li {
      margin: 8px 0;
      line-height: 1.7;
      position: relative;
      
      &::before {
        content: "●";
        position: absolute;
        left: -20px;
        color: var(--md-sys-color-primary, #6750a4);
        font-weight: bold;
        font-size: 16px;
        top: 2px;
      }
    }
  }
  
  .notebook-empty {
    text-align: center;
    color: rgba(139, 69, 19, 0.6);
    font-style: italic;
    margin-top: 100px;
    font-size: 18px;
  }
}

.notebook-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 16px 24px;
  background: linear-gradient(
    135deg, 
    var(--md-sys-color-surface-container, #f3edf7) 0%,
    var(--md-sys-color-surface-container-low, #f7f2fa) 100%
  );
  border-top: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
  flex-shrink: 0;
  
  .nav-button {
    --md-icon-button-icon-size: 24px;
    
    md-icon {
      color: var(--md-sys-color-primary, #6750a4);
    }
    
    &:hover:not(:disabled) {
      background-color: var(--md-sys-color-primary-container, #eaddff);
    }
    
    &:disabled {
      opacity: 0.3;
    }
  }
  
  .page-dots {
    display: flex;
    gap: 8px;
    max-width: 200px;
    overflow-x: auto;
    padding: 4px;
    
    .page-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--md-sys-color-outline-variant, #cac4d0);
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
      
      &:hover {
        background: var(--md-sys-color-primary, #6750a4);
        transform: scale(1.2);
      }
      
      &.active {
        background: var(--md-sys-color-primary, #6750a4);
        transform: scale(1.3);
        box-shadow: 0 0 8px rgba(103, 80, 164, 0.4);
      }
    }
  }
}

// Плейсхолдер для пустого рецепта в любом режиме

// Стили для плейсхолдера "нет рецепта"
.no-recipe-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  color: var(--md-sys-color-on-surface-variant, #49454f);
  background: var(--md-sys-color-surface, #fef7ff);
  border-radius: 12px;
  border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);

  .placeholder-icon {
    font-size: 72px;
    margin-bottom: 16px;
    opacity: 0.6;
    color: var(--md-sys-color-outline, #79747e);
  }

  h3 {
    margin: 0 0 8px;
    font-size: 24px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant, #49454f);
  }

  p {
    margin: 0;
    font-size: 16px;
    opacity: 0.8;
    max-width: 300px;
    line-height: 1.5;
  }
}
</style>
