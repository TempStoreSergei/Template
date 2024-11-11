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
          <template v-for="(grocerie, index) in formState.groceries" :key="grocerie.key">
            <li class="user">
              {{ grocerie.grocery_name }} - {{ grocerie.grocery_amount }} г
              <a @click="onEdit(index)" style="margin-left: 10px;">Изменить</a>
              <a @click="onDelete(index)" style="margin-left: 10px; color: red">Удалить</a>
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

  <a-modal v-model:open="visible" title="Добавить ингредиент" @ok="onOk">
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
          { validator: uniqueGroceryNameValidator, message: 'Название должно быть уникальным' }
        ]"
      >
        <a-input v-model:value="modalFormState.grocery_name" />
      </a-form-item>
      <a-form-item name="grocery_amount" label="Грамовки (в граммах)">
        <a-input-number
          v-model:value="modalFormState.grocery_amount"
          type="number"
          :min="1"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, toRaw } from "vue";
import { SmileOutlined } from "@ant-design/icons-vue";
import type { FormInstance } from "ant-design-vue";

interface UserType {
  grocery_name?: string;
  grocery_amount?: number;
  key?: number;
}

const formRef = ref<FormInstance>();
const modalFormRef = ref<FormInstance>();
const visible = ref(false);
const formState = reactive<FormState>({
  groceries: [],
});
const modalFormState = ref<UserType>({});
const editingIndex = ref<number | null>(null); // To track if we are editing an existing grocery

const modelValue = defineModel<Array<UserType> | null>("value", {
  default: () => [],
});

formState.groceries = modelValue.value ?? [];

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
      formState.groceries[editingIndex.value] = { ...modalFormState.value, key: formState.groceries[editingIndex.value].key };
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
  modalFormState.value = { ...formState.groceries[index] }; // Populate form with selected grocery data
  visible.value = true;
};

const onAdd = () => {
  visible.value = true;
};

// Validator to ensure the grocery name is unique
const uniqueGroceryNameValidator = (_: any, value: string) => {
  if (formState.groceries.some((grocery, index) => grocery.grocery_name === value && index !== editingIndex.value)) {
    return Promise.reject('Название должно быть уникальным');
  }
  return Promise.resolve();
};
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
