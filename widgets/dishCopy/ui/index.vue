<template>
  <a-tabs
    v-model:activeKey="activeKey"
    tab-position="right"
    @tabScroll="callback"
  >
    <template #leftExtra>
      <a-typography-text class="dishes__title" strong
        >Группы блюд</a-typography-text
      >
      <a-divider />
    </template>
    <a-tab-pane
      v-for="(category, categoryIndex) in categories"
      :key="categoryIndex"
      :tab="category.category_name"
    >
      <section class="dishes__list">
        <article v-for="(dish, index) in category.dishes" :key="index">
          <a-card class="dishes__item">
            <template #cover>
              <img
                :alt="dish.dish_name"
                :src="getDataFromServer(dish.dish_img)"
                style="height: 150px"
                :style="{ objectFit: dish.dish_img ? 'contain' : 'cover' }"
                @click="openPrintStikerModal(dish.dish_name, dish.id)"
                @error="handleImageError"
              />
            </template>
            <template #actions>
              <a-button
                type="primary"
                size="large"
                @click="openPrintStikerModal(dish.dish_name, dish.id)"
              >
                <template #icon> <PrinterOutlined /></template>
                Этикетка
              </a-button>
              <a-button
                :disabled="!dish.dish_recipe && dish.groceries.length === 0"
                type="dashed"
                size="large"
                @click="openRecipeModal(dish.dish_recipe, dish.groceries)"
              >
                <template #icon> <ReconciliationOutlined /> </template>
                Рецепт
              </a-button>
            </template>
            <a-card-meta
              :title="dish.dish_name"
              :description="'Срок годности: ' + dish.dish_life_time + ' ч'"
            />
          </a-card>
        </article>
      </section>
    </a-tab-pane>
  </a-tabs>

  <!-- Recipe Modal -->
  <a-modal
    v-model:open="isRecipeModalOpen"
    :title="null"
    width="700"
    :footer="null"
    :mask-closable="false"
    @cancel="isRecipeModalOpen = false"
  >
    <a-flex>
      <div v-if="isHaveRecipe" :style="oneOrTwoPart">
        <a-typography-text strong style="font-size: 16px"
          >Рецепт</a-typography-text
        >
        <div v-html="parsedRecipeContent" />
      </div>
      <a-flex vertical gap="middle" :style="oneOrTwoPart">
        <a-table
          v-if="isHaveGroceries"
          :columns="dynamicColumns"
          :pagination="false"
          :data-source="groceriesItem"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'amount'">
              <a-flex gap="middle">
                {{ record.amount }}
                <a-tag color="green"> Грамм </a-tag>
              </a-flex>
            </template>
            <template v-if="column.dataIndex === 'amountMany'">
              <a-flex gap="middle">
                {{ record.amount * count }}
                <a-tag color="green"> Грамм </a-tag>
              </a-flex>
            </template>
          </template>
        </a-table>
        <a-flex>
          <a-typography-text strong> Рассчитать: </a-typography-text>
          <a-input-number
            id="calculatorPrinter"
            v-model:value="count"
            type="number"
            :min="1"
            style="margin-left: 32px"
          />
        </a-flex>
      </a-flex>
    </a-flex>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { PrinterOutlined, ReconciliationOutlined } from "@ant-design/icons-vue";
import { marked } from "marked"; // Markdown parser
import { printStikerGroceries, getExistedDishe } from "../api";
import { groceriesInfoPrint } from "../conf/formSchemas";
import { useFormModal } from "~/hooks/useModal";

// Refs
const categories = ref([]);
const activeKey = ref(0);
const count = ref(null);
const isRecipeModalOpen = ref(false);
const parsedRecipeContent = ref("");
const isHaveRecipe = ref(false);
const isHaveGroceries = ref(false);
const groceriesItem = ref([]);

const dynamicColumns = computed(() => {
  const baseColumns = [
    {
      title: "Название ингредиента",
      dataIndex: "grocery_name",
      width: "60%",
    },
  ];

  if (count.value === null || count.value === 1) {
    baseColumns.push({
      title: "Количество",
      dataIndex: "amount",
      width: "40%",
    });
  } else {
    baseColumns.push(
      {
        title: "На одну порцию",
        dataIndex: "amount",
        width: "30%",
      },
      {
        title: `Количество (для ${count.value})`,
        dataIndex: "amountMany",
        width: "30%",
      },
    );
  }
  return baseColumns;
});

const oneOrTwoPart = computed(() => {
  if (isHaveRecipe.value && isHaveGroceries.value) {
    return { flexBasis: "50%", overflow: "auto", maxHeight: "80vh" };
  }
  return { flexBasis: "100%", overflow: "auto", maxHeight: "80vh" };
});

const [showModal] = useFormModal();

// Function to open print sticker modal
const openPrintStikerModal = async (name: string, id: number) => {
  await showModal({
    modalProps: {
      title: `Напечатать этикетку для ${name}`,
      maskClosable: false,
      width: 700,
      okText: "Напечатать",
      isUser: true,
      onFinish: async (values) => {
        await printStikerGroceries(id, values);
      },
    },
    formProps: {
      labelWidth: 100,
      schemas: groceriesInfoPrint,
      autoSubmitOnEnter: true,
    },
  });
};

const openRecipeModal = async (recipe: string, groceries: Array<any>) => {
  if (recipe) {
    parsedRecipeContent.value = await marked(recipe);
    isHaveRecipe.value = true;
  }
  if (groceries && groceries.length !== 0) {
    isHaveGroceries.value = true;
    groceriesItem.value = groceries;
  } else {
    isHaveGroceries.value = false;
    groceriesItem.value = [];
  }
  isRecipeModalOpen.value = true;
};

const fallbackImage =
  "data:image/png;base64,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";
const handleImageError = (event) => {
  event.target.src = fallbackImage;
};
// Load categories data on component mount
onMounted(async () => {
  const dishes = await getExistedDishe();
  categories.value = dishes;
});
</script>

<style lang="scss">
.dishes {
  &__list {
    height: 100%;
    display: flex;
    overflow: auto;
    flex-wrap: wrap;
    padding: 24px 0 24px 24px !important;
    align-items: flex-start;
    gap: 24px;
  }
  &__item {
    width: 440px;
    aspect-ratio: 1.618 / 1;
  }
  &__title {
    padding: 16px 16px 0 16px;
    display: block;
  }
  .ant-modal-content {
    max-height: 85vh;
    overflow: hidden;
  }
}
</style>
