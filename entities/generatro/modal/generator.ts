import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { store } from "~/app/providers/store";

interface Category {
  unitName: string;
  title: string;
  lifeTime: number;
  inStock: boolean;
}

interface InputData {
  categoriGroup: Categories[];
  dishes: Dishes[];
}

interface OutputDish {
  "Название группы": string;
  Блюда: Array<{
    Название: string;
    "Срок годности": number;
  }>;
}

interface OutputFormat {
  "Группы заготовок": Array<{ "Название группы": string }>;
  Заготовки?: Array<OutputGroup>;
  "Группы блюд": Array<{ "Название группы": string }>;
  Блюда?: Array<OutputDish>;
}

interface Dish {
  title: string;
  lifeTime: number;
}

interface Categories {
  categoryName: string;
  categories: Category[];
}

interface Dishes {
  dishName: string;
  dishes: Dish[];
}

interface OutputGroup {
  "Название группы": string;
  Заготовки: Array<{
    Название: string;
    "Срок годности": number;
    Единица: string;
    "В наличии": string;
  }>;
}

interface Unit {
  value: string;
}

export const useStepsStore = defineStore(
  "stepsStore",
  () => {
    const currentStep = ref(0);
    const categoryId = ref(null);
    const dishId = ref(null);

    const dynamicValidateForm = reactive({
      units: [{ value: "Граммы" }] as Unit[],
      categoriGroup: [] as Categories[],
      dishes: [] as Dishes[],
    });

    const setStep = (step: number) => {
      currentStep.value = step;
    };
    const removeGroceries = (index: number) => {
      if (index >= 0 && index < dynamicValidateForm.categoriGroup.length) {
        dynamicValidateForm.categoriGroup.splice(index, 1);
      }
    };

    const removeDishGroup = (index: number) => {
      if (index >= 0 && index < dynamicValidateForm.dishes.length) {
        dynamicValidateForm.dishes.splice(index, 1);
      }
    };

    const removeCategory = (category: Category) => {
      dynamicValidateForm.categoriGroup[categoryId.value].categories =
        dynamicValidateForm.categoriGroup[categoryId.value].categories.filter(
          (item) => item !== category,
        );
    };

    const removeDish = (dish: Dish) => {
      dynamicValidateForm.dishes[dishId.value].dishes =
        dynamicValidateForm.dishes[dishId.value].dishes.filter(
          (item) => item !== dish,
        );
    };

    const removeUnit = (unit: Unit) => {
      dynamicValidateForm.units = dynamicValidateForm.units.filter(
        (item) => item !== unit,
      );
    };

    const getCurrentCategor = computed(() => {
      return dynamicValidateForm.categoriGroup[categoryId.value ?? 0];
    });

    const getCurrentDish = computed(() => {
      return dynamicValidateForm.dishes[dishId.value ?? 0];
    });

    const addCategory = () => {
      dynamicValidateForm.categoriGroup[categoryId.value ?? 0].categories.push({
        unitName: "Граммы",
        inStock: true,
        lifeTime: 1,
        title: "",
      });
    };

    const addDish = () => {
      dynamicValidateForm.dishes[dishId.value ?? 0].dishes.push({
        lifeTime: 1,
        title: "",
      });
    };

    const addGroupCategory = () => {
      dynamicValidateForm.categoriGroup.push({
        categoryName: "",
        categories: [],
      });

      const groupLength = dynamicValidateForm.categoriGroup.length;
      categoryId.value = groupLength - 1;
    };

    const addGroupDish = () => {
      dynamicValidateForm.dishes.push({
        dishName: "",
        dishes: [],
      });

      const groupLength = dynamicValidateForm.dishes.length;
      dishId.value = groupLength - 1;
    };

    const setId = (index: number) => {
      categoryId.value = index;
    };

    const setIdDish = (index: number) => {
      dishId.value = index;
    };

    const addUnit = () => {
      dynamicValidateForm.units.push({ value: "" });
    };

    const nextStep = () => {
      currentStep.value += 1;
    };

    const previosStep = () => {
      currentStep.value -= 1;
    };

    const convertToOutputFormat = (inputData: InputData): OutputFormat => {
      // Process groups and groceries
      const groups = inputData.categoriGroup
        .map((category) => ({
          "Название группы": `${category.categoryName}`,
        }))
        .filter((group) => Object.keys(group).length > 0);

      const groceries = inputData.categoriGroup
        .map((category) => {
          const categoryUnits = category.categories.map((unit) => ({
            Название: unit.title,
            "Срок годности": unit.lifeTime,
            Единица: unit.unitName,
            "В наличии": unit.inStock ? "Да" : "Нет",
          }));

          if (categoryUnits.length > 0) {
            return {
              "Название группы": `${category.categoryName}`,
              Заготовки: categoryUnits,
            };
          }
          return undefined;
        })
        .filter((group): group is OutputGroup => group !== undefined);

      // Process dishes
      const dishGroups = inputData.dishes
        .map((dishGroup) => ({
          "Название группы": `${dishGroup.dishName}`,
        }))
        .filter((group) => Object.keys(group).length > 0);

      const dishes = inputData.dishes
        .map((dishGroup) => {
          const dishItems = dishGroup.dishes.map((dish) => ({
            Название: dish.title,
            "Срок годности": dish.lifeTime,
          }));

          if (dishItems.length > 0) {
            return {
              "Название группы": `${dishGroup.dishName}`,
              Блюда: dishItems,
            };
          }
          return undefined;
        })
        .filter((dish): dish is OutputDish => dish !== undefined);

      // Construct the final output conditionally
      const output: OutputFormat = {};
      if (groups.length > 0) {
        output["Группы заготовок"] = groups;
      }
      if (groceries.length > 0) {
        output["Заготовки"] = groceries;
      }
      if (dishGroups.length > 0) {
        output["Группы блюд"] = dishGroups;
      }
      if (dishes.length > 0) {
        output["Блюда"] = dishes;
      }

      return output;
    };

    const downloadDataAsTxt = () => {
      const outputData = convertToOutputFormat({
        categoriGroup: dynamicValidateForm.categoriGroup,
        dishes: dynamicValidateForm.dishes,
      });
      const jsonString = JSON.stringify(outputData, null, 2);

      const blob = new Blob([jsonString], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "outputData.txt"; // Specify the file name
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return {
      currentStep,
      setStep,
      removeCategory,
      removeUnit,
      removeDish,
      removeDishGroup,
      addCategory,
      addUnit,
      addDish,
      nextStep,
      previosStep,
      addGroupCategory,
      setId,
      removeGroceries,
      downloadDataAsTxt,
      setIdDish,
      addGroupDish,
      getCurrentCategor,
      getCurrentDish,
      dynamicValidateForm,
    };
  },
  { persist: true },
);

export function useStepsStoreWithout() {
  return useStepsStore(store);
}
