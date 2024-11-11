<template>
  <div class="generation">
    <a-steps :current="currentStep" @change="stepsStore.setStep">
      <a-step v-for="(step, index) in steps" :key="index" :title="step.title" />
    </a-steps>
    <a-card :title="steps[currentStep].title" class="generation__content">
      <section v-if="currentStep === 0 && !isShwoCategoryAddForm">
        <CategoryGroup
          v-if="categoriGroup.length !== 0"
          :categoriGroup="categoriGroup"
          :changeCategory="changeCategory"
          :removeGroceries="removeGroceries"
        />
        <a-result
          v-else
          title="Cписок пока пуст, создайте хотя бы одну группу заготовок "
        />
      </section>

      <section v-else-if="currentStep === 0 && isShwoCategoryAddForm">
        <a-form ref="formRef" :model="stepsStore.getCurrentCategor">
          <a-form-item
            label="Название группы заготовок"
            name="categoryName"
            :rules="[
              {
                required: true,
                message: 'Название группы заготовок обязательно',
              },
              {
                validator: validateUniqueCategoryName,
                message: 'Название групп заготовок должно быть уникальным',
              },
            ]"
          >
            <a-input
              v-model:value="stepsStore.getCurrentCategor.categoryName"
              placeholder="Введите название группы заготовок"
            />
          </a-form-item>
          <CategoryForm
            :categories="stepsStore.getCurrentCategor.categories"
            :removeCategory="stepsStore.removeCategory"
            :validateUniqueGroccery="validateUniqueGroccery"
          />
        </a-form>
      </section>

      <section v-else-if="currentStep === 1 && !isShwoCategoryAddForm">
        <DishesGroup
          v-if="dishes.length !== 0"
          :dishGroup="dishes"
          :changeDish="changeDish"
          :removeDish="removeDish"
        />
        <a-result
          v-else
          title="Cписок пока пуст, создайте хотя бы одну группу блюд"
        />
      </section>

      <section v-else-if="currentStep === 1 && isShwoCategoryAddForm">
        <a-form ref="formRef" :model="stepsStore.getCurrentDish">
          <a-form-item
            label="Название группы блюд"
            name="dishName"
            :rules="[
              {
                required: true,
                message: 'Название группы заготовок блюд',
              },
              {
                validator: validateUniqueDishName,
                message: 'Название групп блюд должно быть уникальным',
              },
            ]"
          >
            <a-input
              v-model:value="stepsStore.getCurrentDish.dishName"
              placeholder="Введите название группы блюд"
            />
          </a-form-item>
          <DishForm
            :dishes="stepsStore.getCurrentDish.dishes"
            :removeDish="stepsStore.removeDish"
            :validateUniqueDish="validateUniqueDish"
          />
        </a-form>
      </section>

      <template #actions>
        <div
          v-if="currentStep > 0 && !isShwoCategoryAddForm"
          class="generation__action"
        >
          <a-button type="primary" block @click="stepsStore.previosStep">
            <LeftOutlined />
            Назад
          </a-button>
        </div>
        <div
          v-if="currentStep === 0 && isShwoCategoryAddForm"
          class="generation__action"
        >
          <a-button type="dashed" block @click="goToCategorGroup">
            <LeftOutlined />
            К группам заготовок
          </a-button>
        </div>
        <div
          v-if="currentStep === 1 && isShwoCategoryAddForm"
          class="generation__action"
        >
          <a-button type="dashed" block @click="goToCategorGroup">
            <LeftOutlined />
            К группам блюд
          </a-button>
        </div>
        <div
          v-if="currentStep === 0 && isShwoCategoryAddForm"
          class="generation__action"
        >
          <a-button block @click="stepsStore.addCategory"
            >Добавить категорию</a-button
          >
        </div>
        <div
          v-if="currentStep === 1 && isShwoCategoryAddForm"
          class="generation__action"
        >
          <a-button block @click="stepsStore.addDish">Добавить блюдо</a-button>
        </div>
        <div
          v-if="currentStep === 0 && !isShwoCategoryAddForm"
          class="generation__action"
        >
          <a-button block @click="ShwoCategoryAddForm"
            >Добавить группу заготовок</a-button
          >
        </div>
        <div
          v-if="currentStep === 1 && !isShwoCategoryAddForm"
          class="generation__action"
        >
          <a-button block @click="ShwoDishAddForm"
            >Добавить группу блюд</a-button
          >
        </div>
        <div
          v-if="!isShwoCategoryAddForm && currentStep < 1"
          class="generation__action"
        >
          <a-button type="primary" block @click="stepsStore.nextStep()">
            Далее
            <RightOutlined />
          </a-button>
        </div>
        <div
          v-if="currentStep === 1 && !isShwoCategoryAddForm"
          class="generation__action"
        >
          <a-button type="primary" block @click="stepsStore.downloadDataAsTxt">
            <SaveOutlined />
            Скачать
          </a-button>
        </div>
      </template>

      <template #extra>
        <NuxtLink to="/setting">
          <div style="padding: 5px">
            <a-button danger type="dashed"> Вернуться к настройкам </a-button>
          </div>
        </NuxtLink>
      </template>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import CategoryGroup from "../lib/CategoryGroup.vue";
import CategoryForm from "../lib/CategoryForm.vue";
import DishesGroup from "../lib/DishesGroup.vue";
import DishForm from "../lib/DishForm.vue";
import { useStepsStore } from "~/entities/generatro/modal/generator";

const stepsStore = useStepsStore();

const formRef = ref();
const currentStep = computed(() => stepsStore.currentStep);
const { categoriGroup, dishes } = toRefs(stepsStore.dynamicValidateForm);
const isShwoCategoryAddForm = ref(false);

const steps = [{ title: "Группы заготовок" }, { title: "Группы блюд" }];

const changeCategory = (index: number) => {
  event.stopPropagation();
  stepsStore.setId(index);
  isShwoCategoryAddForm.value = true;
};

const changeDish = (index: number) => {
  event.stopPropagation();
  stepsStore.setIdDish(index);
  isShwoCategoryAddForm.value = true;
};

const removeGroceries = (index: number) => {
  event.stopPropagation();
  stepsStore.removeGroceries(index);
};

const removeDish = (index: number) => {
  event.stopPropagation();
  stepsStore.removeDishGroup(index);
};

const ShwoCategoryAddForm = () => {
  stepsStore.addGroupCategory();
  isShwoCategoryAddForm.value = true;
};

const ShwoDishAddForm = () => {
  stepsStore.addGroupDish();
  isShwoCategoryAddForm.value = true;
};

const goToCategorGroup = () => {
  formRef.value
    .validate()
    .then(() => {
      isShwoCategoryAddForm.value = false;
    })
    .catch((error) => {
      console.log("values", stepsStore.dynamicValidateForm);
      console.log("error", error);
    });
};

const validateUniqueCategoryName = (rule, value: string) => {
  const duplicate =
    categoriGroup.value.filter((category) => category.categoryName === value)
      .length > 1;

  return duplicate
    ? Promise.reject("Категория должна быть уникальной")
    : Promise.resolve();
};

const validateUniqueDishName = (rule, value: string) => {
  const duplicate =
    dishes.value.filter((dish) => dish.dishName === value).length > 1;

  return duplicate
    ? Promise.reject("Категория должна быть уникальной")
    : Promise.resolve();
};

const validateUniqueGroccery = (rule, value) => {
  const duplicate =
    stepsStore.getCurrentCategor.categories.filter(
      (category) => category.title === value,
    ).length > 1;
  return duplicate
    ? Promise.reject("Еденица измерения должна быть уникальной")
    : Promise.resolve();
};

const validateUniqueDish = (rule, value) => {
  const duplicate =
    stepsStore.getCurrentDish.dishes.filter((dish) => dish.title === value)
      .length > 1;
  return duplicate
    ? Promise.reject("Еденица измерения должна быть уникальной")
    : Promise.resolve();
};
</script>

<style lang="scss">
.generation {
  &__content {
    margin-top: 24px;
  }
  &__form {
    max-height: 50vh;
    overflow: auto;
  }
  &__action {
    padding: 0 12px;
  }
  .ant-card-body {
    max-height: 60vh;
    overflow: hidden;
  }
}

.form-container {
  margin-top: 20px;
}
</style>
