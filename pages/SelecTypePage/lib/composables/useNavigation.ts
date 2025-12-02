import { ref, computed, nextTick } from "#imports";
import type { Category } from "../../model/types";

export function useNavigation() {
  const breadcrumbPath = ref<Category[]>([]);
  const navContainer = ref<HTMLElement | null>(null);
  const navTrack = ref<HTMLElement | null>(null);
  const scrollOffset = ref(0);
  const canScrollLeft = ref(false);
  const canScrollRight = ref(false);
  const scrollStep = 200;

  const currentFolder = computed((): Category | null => {
    if (breadcrumbPath.value.length === 0) {
      return null;
    }
    return breadcrumbPath.value[breadcrumbPath.value.length - 1];
  });

  const updateScrollState = () => {
    if (!navContainer.value || !navTrack.value) return;

    const containerWidth = navContainer.value.clientWidth;
    const trackWidth = navTrack.value.scrollWidth;
    const maxScroll = Math.max(0, trackWidth - containerWidth);

    canScrollLeft.value = Math.abs(scrollOffset.value) > 1;
    canScrollRight.value = Math.abs(scrollOffset.value) < maxScroll - 1;
  };

  const scrollLeft = () => {
    scrollOffset.value = Math.min(scrollOffset.value + scrollStep, 0);
    updateScrollState();
  };

  const scrollRight = () => {
    if (!navContainer.value || !navTrack.value) return;
    
    const containerWidth = navContainer.value.clientWidth;
    const trackWidth = navTrack.value.scrollWidth;
    const maxScroll = trackWidth - containerWidth;
    
    scrollOffset.value = Math.max(scrollOffset.value - scrollStep, -maxScroll);
    updateScrollState();
  };

  const navigateToPath = (index: number | null) => {
    if (index === null) {
      breadcrumbPath.value = [];
    } else {
      breadcrumbPath.value = breadcrumbPath.value.slice(0, index + 1);
    }
    
    scrollOffset.value = 0;
    nextTick(() => {
      updateScrollState();
    });
  };

  const navigateToCategory = (category: Category) => {
    breadcrumbPath.value.push(category);
    scrollOffset.value = 0;
    nextTick(() => {
      updateScrollState();
    });
  };

  return {
    breadcrumbPath,
    navContainer,
    navTrack,
    scrollOffset,
    canScrollLeft,
    canScrollRight,
    currentFolder,
    updateScrollState,
    scrollLeft,
    scrollRight,
    navigateToPath,
    navigateToCategory,
  };
}