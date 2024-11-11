<template xmlns="http://www.w3.org/1999/html">
  <section>
    <img :src="recipe.image" alt="Recipe Image" class="recipe-image" />
    <List itemLayout="horizontal" :dataSource="recipe.ingredients">
      <List.Item v-for="item in recipe.ingredients" :key="item.name">
        <List.Item.Meta :title="`${item.quantity} ${item.unit} ${item.name}`" />
        <Tooltip :title="`Свежее в течение ${item.freshness} дней`">
          <Tag :color="item.freshness <= 0 ? 'red' : 'green'">
            {{ item.freshness }} дней
          </Tag>
        </Tooltip>
      </List.Item>
    </List>
    <a-row>
      <a-col :span="4">
        <a-input-number
          v-model:value="inputValue1"
          :min="1"
          type="number"
          style="margin-left: 16px"
        />
      </a-col>
    </a-row>
  </section>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { List, Tag, Tooltip } from "ant-design-vue";

const inputValue1 = ref<number>(1);

const recipe = ref({
  title: "Вкусный торт",
  image:
    "https://eda.ru/images/RecipePhoto/620x415/salat-cezar-tradicionnij_25585_photo_108770.webp",
  portions: 8,
  ingredients: [
    { name: "Мука", quantity: 500, unit: "г", freshness: 30 },
    { name: "Сахар", quantity: 200, unit: "г", freshness: 180 },
    { name: "Яйца", quantity: 4, unit: "шт", freshness: 14 },
    { name: "Молоко", quantity: 250, unit: "мл", freshness: 7 },
  ],
});
</script>

<style lang="scss">
.recipe-image {
  height: 200px;
  width: 100%;
}
</style>
