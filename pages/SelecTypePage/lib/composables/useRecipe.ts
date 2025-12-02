import { ref, computed } from "#imports";
import type { Dish } from "../../model/types";

export function useRecipe() {
  const selectedItem = ref<Dish | null>(null);
  const showRecipe = ref(false);
  const showNotebook = ref(false);
  const activeRecipeTab = ref(0);
  const currentNotebookPage = ref(0);
  const notebookPages = ref<string[]>([]);

  const scaledIngredients = computed(() => {
    if (
      !selectedItem.value?.ingridients ||
      selectedItem.value.ingridients.length === 0
    ) {
      return [];
    }

    const quantity = 1; // This should be passed from parent or use quantity composable
    return selectedItem.value.ingridients.map((ingredient: any) => ({
      ...ingredient,
      scaledWeight: Math.round(ingredient.ingridientWeight * quantity),
    }));
  });

  const openRecipe = (item: Dish) => {
    selectedItem.value = item;
    showRecipe.value = true;
    
    if (item.itemInstructions && item.itemInstructions.trim()) {
      const pages = item.itemInstructions.split('\n\n').filter(page => page.trim());
      notebookPages.value = pages.length > 0 ? pages : ['Нет рецепта'];
    } else {
      notebookPages.value = ['Нет рецепта'];
    }
    
    currentNotebookPage.value = 0;
  };

  const closeRecipe = () => {
    showRecipe.value = false;
    showNotebook.value = false;
    selectedItem.value = null;
    activeRecipeTab.value = 0;
    currentNotebookPage.value = 0;
    notebookPages.value = [];
  };

  const switchToNotebook = () => {
    showNotebook.value = true;
    activeRecipeTab.value = 1;
  };

  const switchToRecipe = () => {
    showNotebook.value = false;
    activeRecipeTab.value = 0;
  };

  const nextPage = () => {
    if (currentNotebookPage.value < notebookPages.value.length - 1) {
      currentNotebookPage.value++;
    }
  };

  const previousPage = () => {
    if (currentNotebookPage.value > 0) {
      currentNotebookPage.value--;
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < notebookPages.value.length) {
      currentNotebookPage.value = pageIndex;
    }
  };

  const canGoNext = computed(() => 
    currentNotebookPage.value < notebookPages.value.length - 1
  );

  const canGoPrevious = computed(() => 
    currentNotebookPage.value > 0
  );

  return {
    selectedItem,
    showRecipe,
    showNotebook,
    activeRecipeTab,
    currentNotebookPage,
    notebookPages,
    scaledIngredients,
    canGoNext,
    canGoPrevious,
    openRecipe,
    closeRecipe,
    switchToNotebook,
    switchToRecipe,
    nextPage,
    previousPage,
    goToPage,
  };
}