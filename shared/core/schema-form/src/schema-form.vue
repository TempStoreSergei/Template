<template>
  <!-- Main form component -->
  <Form
    ref="schemaFormRef"
    v-bind="pick(getFormProps, aFormPropKeys)"
    :model="formModel"
    @keypress.enter="handleEnterPress"
  >
    <Row v-bind="getRowConfig">
      <!-- Optional form header slot -->
      <slot name="formHeader" />

      <!-- Main content slot and form schema rendering -->
      <slot>
        <!-- Loop through schema items and render each SchemaFormItem -->
        <template v-for="schemaItem in formSchemasRef" :key="schemaItem.field">
          <SchemaFormItem
            v-model:form-model="formModel"
            :schema="schemaItem"
            :table-instance="tableInstance"
          >
            <!-- Loop through available slots and render them dynamically -->
            <template
              v-for="slotName in Object.keys($slots)"
              #[slotName]="slotData"
              :key="slotName"
            >
              <slot :name="slotName" v-bind="slotData || {}" />
            </template>
          </SchemaFormItem>
        </template>

        <!-- Form action buttons (e.g., reset, submit) -->
        <FormAction
          v-if="showActionButtonGroup"
          v-bind="getFormActionBindProps"
          @toggle-advanced="handleToggleAdvanced"
        >
          <!-- Additional action slots for custom buttons or actions -->
          <template
            v-for="actionSlot in [
              'resetBefore',
              'submitBefore',
              'advanceBefore',
              'advanceAfter',
            ]"
            #[actionSlot]="actionData"
          >
            <slot :name="actionSlot" v-bind="actionData || {}" />
          </template>
        </FormAction>
      </slot>

      <!-- Optional form footer slot -->
      <slot name="formFooter" />
    </Row>
  </Form>
</template>

<script lang="ts" setup>
import { useAttrs } from "vue";
import { pick } from "lodash-es";
import { Form, Row } from "ant-design-vue";
import SchemaFormItem from "./schema-form-item.vue";
import FormAction from "./components/form-action.vue";
import {
  createFormContext,
  useFormState,
  useFormEvents,
  useFormMethods,
  useAdvanced,
  type SchemaFormType,
} from "./hooks/";
import { schemaFormProps, schemaFormEmits, aFormPropKeys } from "./schema-form";

// Define component name and expose options
defineOptions({ name: "SchemaForm" });

// Define properties and events
const props = defineProps(schemaFormProps);
const emit = defineEmits(schemaFormEmits);
const attrs = useAttrs();

// Form internal state management
const formState = useFormState({ props, attrs });
const {
  formModel,
  getRowConfig,
  schemaFormRef,
  getFormProps,
  getFormActionBindProps,
  formSchemasRef,
} = formState;

// Create the form context
const schemaFormContext: SchemaFormType = {
  ...formState,
  emit,
} as SchemaFormType;
createFormContext(schemaFormContext);

// Form internal methods
const formMethods = useFormMethods();
const { handleEnterPress, setDefaultValue } = formMethods;

// Handle form events (submit, reset, etc.)
const formEvents = useFormEvents();

// Search form expand/collapse logic
const { handleToggleAdvanced } = useAdvanced();

// Merge all form states, events, and methods into the form context
Object.assign(schemaFormContext, {
  ...formState,
  ...formEvents,
  ...formMethods,
});

// Emit the "register" event to pass the form context to parent
emit("register", schemaFormContext);

// Expose the form context to the parent component
defineExpose(schemaFormContext);

// Initialize default form values based on schemas
setDefaultValue(formSchemasRef.value);
</script>
