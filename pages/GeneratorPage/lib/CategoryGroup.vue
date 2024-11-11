<template>
  <div class="generation__form">
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel
        v-for="(category, index) in categoriGroup"
        :key="index"
        :header="category.categoryName"
      >
        <a-result
          v-if="category.categories.length === 0"
          title="Нет групп заготовок"
        />
        <div v-else>
          <a-list item-layout="horizontal" :data-source="category.categories">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :description="item.unitName">
                  <template #title>
                    <a href="https://www.antdv.com/">{{ item.title }}</a>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>

        <template #extra>
          <a-button type="link" @click="() => changeCategory(index)">
            Изменить
          </a-button>
          <a-button type="link" danger @click="() => removeGroceries(index)">
            Удалить
          </a-button>
        </template>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";

const props = defineProps({
  categoriGroup: {
    type: Array as () => {
      categoryName: string;
      categories: Array<{ title: string; unitName: string }>;
    }[],
    required: true,
  },
  changeCategory: {
    type: Function,
    required: true,
  },
  removeGroceries: {
    type: Function,
    required: true,
  },
});

// Active key for the collapse component
const activeKey = ref([]);
</script>

<style scoped>
.generation__form {
  margin-top: 20px;
}
</style>
