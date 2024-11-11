<template>
  <div class="generation__form">
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel
        v-for="(dish, index) in dishGroup"
        :key="index"
        :header="dish.dishName"
      >
        <a-result v-if="dish.dishes.length === 0" title="Нет групп блюд" />
        <div v-else>
          <a-list item-layout="horizontal" :data-source="dish.dishes">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :description="item.unitName">
                  <template #title>
                    {{ item.title }}
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>

        <template #extra>
          <a-button type="link" @click="() => changeDish(index)">
            Изменить
          </a-button>
          <a-button type="link" danger @click="() => removeDish(index)">
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
  dishGroup: {
    type: Array as () => {
      dishName: string;
      dishes: Array<{ title: string; lifeTime: number }>;
    }[],
    required: true,
  },
  changeDish: {
    type: Function,
    required: true,
  },
  removeDish: {
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
