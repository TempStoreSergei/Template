import { ref, computed } from "#imports";
import type { Category, Dish } from "../../model/types";
import { findItems } from "../../api";

export function useSearch() {
  const searchQuery = ref("");
  const searchMode = ref("auto");
  const isSearchModeMenuOpen = ref(false);
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
  const lastCompletedQuery = ref("");
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;

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

  const isSearchActive = computed(() => searchQuery.value.trim().length > 0);

  const showDynamicIsland = computed(() =>
    isSearchActive.value &&
    !isSearching.value &&
    searchResults.value.categoriesData.length === 0 &&
    searchResults.value.itemsData.length === 0 &&
    searchQuery.value.trim() === lastCompletedQuery.value.trim()
  );

  const performLocalSearch = (query: string, allCategories?: Category[], currentFolder?: Category | null) => {
    if (!allCategories) return { categoriesData: [], itemsData: [] };
    
    const searchInCategories = currentFolder?.children || allCategories;
    
    const foundCategories = searchInCategories.filter((cat) =>
      cat.categoryName.toLowerCase().includes(query)
    );
    
    const foundItems: Dish[] = [];
    const searchInItems = currentFolder?.items || [];
    
    for (const item of searchInItems) {
      if (item.itemName.toLowerCase().includes(query)) {
        foundItems.push(item);
      }
    }
    
    return {
      categoriesData: foundCategories,
      itemsData: foundItems,
    };
  };

  const debouncedSearch = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  };

  const performSearch = async (allCategories: Category[], currentFolder: Category | null) => {
    if (!searchQuery.value.trim()) {
      clearSearchResults();
      return;
    }

    const query = searchQuery.value.toLowerCase().trim();
    isSearching.value = true;
    searchLoadingText.value = "Поиск...";

    try {
      let results;

      if (searchMode.value === "local") {
        results = performLocalSearch(query, allCategories, currentFolder);
      } else if (searchMode.value === "global") {
        const response = await findItems(query);
        console.log(query)
        const enrichedItems = response.items?.map(item => {
          for (const category of allCategories) {
              const fullItem = findItemInCategory(
                category,
                item.id || item.itemName,
              );
              if (fullItem) return fullItem;
          }

            return item; // Возвращаем оригинальный если не нашли
        }) || [];

        results = {
          categoriesData: response.categories || [],
          itemsData: enrichedItems,
        };
      } else {
        const localResults = performLocalSearch(query, allCategories, currentFolder);

        if (localResults.categoriesData.length === 0 && localResults.itemsData.length === 0) {
          const response = await findItems(query);
          // Дополняем данные как в глобальном поиске
          const enrichedItems = response.items?.map(item => {
            for (const category of allCategories) {
              const fullItem = findItemInCategory(category, item.id || item.itemName);
              if (fullItem) return fullItem;
            }
            return item;
          }) || [];

          results = {
            categoriesData: response.categories || [],
            itemsData: enrichedItems,
          };
        } else {
          results = localResults;
        }
      }

      searchResults.value = results;
      lastCompletedQuery.value = searchQuery.value.trim();
    } catch (error) {
      console.error("Search error:", error);
      clearSearchResults();
    } finally {
      isSearching.value = false;
    }
  };


  const findItemInCategory = (category: Category, itemIdentifier: string): Dish | null => {
    // Поиск в текущей категории
    const foundItem = category.items?.find(item =>
      item.id === itemIdentifier || item.itemName === itemIdentifier
    );

    if (foundItem) return foundItem;

    // Рекурсивный поиск в дочерних категориях
    if (category.children) {
      for (const child of category.children) {
        const result = findItemInCategory(child, itemIdentifier);
        if (result) return result;
      }
    }

    return null;
  };
  const clearSearchResults = () => {
    searchResults.value = {
      categoriesData: [],
      itemsData: [],
    };
    lastCompletedQuery.value = "";
  };

  const onSearchFocus = () => {
    isSearchFocused.value = true;
  };

  const onSearchBlur = () => {
    setTimeout(() => {
      isSearchFocused.value = false;
    }, 200);
  };

  const toggleSearchModeMenu = () => {
    isSearchModeMenuOpen.value = !isSearchModeMenuOpen.value;
  };

  const selectSearchMode = (mode: string) => {
    searchMode.value = mode;
    isSearchModeMenuOpen.value = false;
  };

  const getSearchModeIcon = () => {
    const mode = searchModes.find(m => m.value === searchMode.value);
    return mode?.icon || "search";
  };

  const getSearchPlaceholder = () => {
    const mode = searchModes.find(m => m.value === searchMode.value);
    return `${mode?.title || 'Поиск'}...`;
  };

  return {
    searchQuery,
    searchMode,
    isSearchModeMenuOpen,
    searchResults,
    isSearching,
    isSearchFocused,
    searchLoadingText,
    lastCompletedQuery,
    searchModes,
    isSearchActive,
    showDynamicIsland,
    performLocalSearch,
    debouncedSearch,
    performSearch,
    clearSearchResults,
    onSearchFocus,
    onSearchBlur,
    toggleSearchModeMenu,
    selectSearchMode,
    getSearchModeIcon,
    getSearchPlaceholder,
  };
}