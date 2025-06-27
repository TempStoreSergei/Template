<template>
  <a-form
    ref="formRef"
    :model="formState"
    name="form_context"
    @finish="onFinish"
  >
    <a-form-item>
      <template v-if="formState.groceries.length">
        <ul>
          <template
            v-for="(grocerie, index) in formState.groceries"
            :key="grocerie.key"
          >
            <li class="user">
              {{ grocerie.grocery_name }} - {{ grocerie.grocery_amount }}
              <span class="user__unit">
                {{ getUnitName(grocerie.grocery_unit_id ?? grocerie.unit_id) }}
              </span>
              <a style="margin-left: 10px" @click="onEdit(index)">Изменить</a>
              <a style="margin-left: 10px; color: red" @click="onDelete(index)"
                >Удалить</a
              >
            </li>
          </template>
        </ul>
      </template>
      <template v-else>
        <a-typography-text class="ant-form-text" type="secondary">
          (
          <SmileOutlined />
          Список ингредиентов еще пуст. )
        </a-typography-text>
      </template>
    </a-form-item>

    <a-form-item>
      <a-button type="dashed" block @click="onAdd">
        <PlusOutlined />
        Добавить ингредиент
      </a-button>
    </a-form-item>
  </a-form>

  <a-modal
    v-model:open="visible"
    title="Добавить ингредиент"
    ok-text="Добавить"
    cancel-text="Отмена"
    :maskClosable="false"
    :onCancel="setNullParam"
    @ok="onOk"
  >
    <a-form
      ref="modalFormRef"
      :model="modalFormState"
      layout="vertical"
      name="userForm"
    >
      <a-form-item
        name="grocery_name"
        label="Название ингредиента"
        :rules="[
          { required: true, message: 'Название обязательно' },
          {
            validator: uniqueGroceryNameValidator,
            message: 'Название должно быть уникальным',
          },
        ]"
      >
        <a-input v-model:value="modalFormState.grocery_name" />
      </a-form-item>
      <a-form-item
        name="unit_id"
        label="Единица измерения"
        :rules="[
          { required: true, message: 'Пожалуйста, выберите единицу измерения' },
        ]"
      >
        <a-select
          v-model:value="modalFormState.unit_id"
          placeholder="Выберите единицу измерения"
          :options="unitOptions"
          :loading="isFetchingUnits"
        />
      </a-form-item>

      <a-form-item
        name="grocery_amount"
        label="Масса/Объем"
        :rules="[
          { required: true, message: 'Пожалуйста, выберите массу/объем' },
        ]"
      >
        <a-input
          id="calculator"
          v-model:value="modalFormState.grocery_amount"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, toRaw } from "vue";
import { SmileOutlined } from "@ant-design/icons-vue";
import type { FormInstance } from "ant-design-vue";
import { getUnits } from "~/pages/UnitPage";

interface UserType {
  grocery_name?: string;
  grocery_amount?: number;
  unit_id?: number; // Add this field
  key?: number;
}

const formRef = ref<FormInstance>();
const modalFormRef = ref<FormInstance>();
const visible = ref(false);
const formState = reactive<FormState>({
  groceries: [],
});
const modalFormState = ref<UserType>({});
const unitMap = ref<Map<number, string>>(new Map());
const editingIndex = ref<number | null>(null); // To track if we are editing an existing grocery

const modelValue = defineModel<Array<UserType> | null>("value", {
  default: () => [],
});

const unitOptions = ref<{ label: string; value: number }[]>([]);
const isFetchingUnits = ref(false);

// Fetch units from API
const fetchUnits = async () => {
  isFetchingUnits.value = true;
  try {
    const response = await getUnits(); // Replace with your endpoint
    unitOptions.value = response.map(
      (unit: { id: number; unit_fullname: string }) => ({
        label: unit.unit_fullname,
        value: unit.id,
      }),
    );
    unitMap.value = new Map(
      response.map((unit: { id: number; unit_fullname: string }) => [
        unit.id,
        unit.unit_fullname,
      ]),
    );
  } catch (error) {
    console.error("Failed to fetch units:", error);
  } finally {
    isFetchingUnits.value = false;
  }
};

const setNullParam = () => {
  editingIndex.value = null;
  modalFormState.value = {};
};

formState.groceries = modelValue.value ?? [];

const getUnitName = (unitId?: number) => {
  return unitMap.value.get(unitId!) || "Неизвестная единица";
};

watch(
  () => formState.groceries.length,
  () => {
    modelValue.value = formState.groceries;
  },
);

watch(modelValue, () => {
  formState.groceries = modelValue.value ?? [];
});

const onOk = () => {
  modalFormRef.value.validateFields().then(() => {
    if (editingIndex.value !== null) {
      formState.groceries[editingIndex.value] = {
        ...modalFormState.value,
        key: formState.groceries[editingIndex.value].key,
      };
    } else {
      formState.groceries.push({ ...modalFormState.value, key: Date.now() });
    }
    modalFormState.value = {};
    visible.value = false;
  });
};

const onFinish = () => {
  console.log("Finish:", toRaw(formState));
};

const onDelete = (index: number) => {
  formState.groceries.splice(index, 1);
};

const onEdit = (index: number) => {
  editingIndex.value = index;
  modalFormState.value = { ...formState.groceries[index] };
  visible.value = true;
};

const onAdd = () => {
  visible.value = true;
};

// Validator to ensure the grocery name is unique
const uniqueGroceryNameValidator = (_: any, value: string) => {
  if (
    formState.groceries.some(
      (grocery, index) =>
        grocery.grocery_name === value && index !== editingIndex.value,
    )
  ) {
    return Promise.reject("Название должно быть уникальным");
  }
  return Promise.resolve();
};

onMounted(fetchUnits);
</script>

<style scoped>
#components-form-demo-form-context .user {
  margin-bottom: 8px;
}

#components-form-demo-form-context .user .ant-avatar {
  margin-right: 8px;
}

.ant-row-rtl #components-form-demo-form-context .user .ant-avatar {
  margin-right: 0;
  margin-left: 8px;
}
</style>
