<template>
  <div class="custom-tabs-wrapper">
    <!-- Tabs Component -->
    <a-tabs
      v-if="!error && (isCategoriesLoaded || isDishesLoaded)"
      v-model:activeKey="activeKey"
      type="card"
      size="large"
    >
      <!-- Tab for Заготовки, only if categories are loaded -->
      <a-tab-pane v-if="isCategoriesLoaded" key="groceries">
        <template #tab>
          <span>Заготовки</span>
        </template>
        <Groceries />
      </a-tab-pane>

      <!-- Tab for Блюда, only if dishes are loaded -->
      <a-tab-pane v-if="isDishesLoaded" key="dishes">
        <template #tab>
          <span>Блюда</span>
        </template>
        <DishCopy />
      </a-tab-pane>
    </a-tabs>

    <!-- Loading Spinner -->
    <a-spin v-else-if="isLoading" size="large" />

    <!-- Error Display if both data sets are empty -->
    <a-result
      v-else
      status="error"
      title="К сожалению, не удалось найти данные. Пожалуйста, обратитесь к администратору для внесения информации или повторите попытку."
    >
      <template #extra>
        <a-button type="primary" @click="retryFetchData"
          >Повторить попытку</a-button
        >
      </template>
    </a-result>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getAvalibleInfo } from "../api";
import { Groceries } from "~/widgets/groceries";
import { DishCopy } from "~/widgets/dishCopy";

// State variables
const activeKey = ref("groceries");
const isLoading = ref(true);
const error = ref(false);
const isCategoriesLoaded = ref(false);
const isDishesLoaded = ref(false);

// Fetch data from API
const fetchData = async () => {
  isLoading.value = true;
  error.value = false;

  try {
    const data = await getAvalibleInfo();
    isCategoriesLoaded.value = data.groceries;
    isDishesLoaded.value = data.dishes;

    // Set error if both categories and dishes are empty
    error.value = !data.groceries && !data.dishes;
  } catch {
    error.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Retry fetching data
const retryFetchData = () => {
  fetchData();
};

// Fetch data on component mount
onMounted(() => {
  fetchData();
});
</script>

<style lang="scss">
.custom-tabs-wrapper {
  height: 100%;
  .ant-tabs,
  .ant-tabs-content {
    height: 100%;
  }
  .ant-tabs-nav {
    margin: 0;
  }
}
</style>
