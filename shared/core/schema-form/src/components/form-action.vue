<template>
  <Col v-if="showActionButtonGroup" v-bind="actionColOpt">
    <div class="form-action__container">
      <Form.Item>
        <slot name="resetBefore" />

        <a-button
          v-if="showResetButton"
          type="default"
          class="form-action__button form-action__button--reset"
          v-bind="getResetBtnOptions"
          @click="resetFields"
        >
          {{ getResetBtnOptions.text }}
        </a-button>

        <slot name="submitBefore" />

        <a-button
          v-if="showSubmitButton"
          type="primary"
          class="form-action__button form-action__button--submit"
          v-bind="getSubmitBtnOptions"
          @click="handleSubmit($event)"
        >
          {{ getSubmitBtnOptions.text }}
        </a-button>

        <slot name="advanceBefore" />

        <a-button
          v-if="showAdvancedButton && !hideAdvanceBtn"
          type="link"
          size="small"
          class="form-action__button form-action__button--advanced"
          @click="toggleAdvanced"
        >
          {{ isAdvanced ? "Свернуть " : "Развернуть" }}
          <BasicArrow class="form-action__icon" :expand="!isAdvanced" />
        </a-button>

        <slot name="advanceAfter" />
      </Form.Item>
    </div>
  </Col>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { Form, Col } from "ant-design-vue";
import { useFormContext } from "../hooks/useFormContext";
import type { ColEx } from "../types/component";
import type { ButtonProps } from "~/shared/basic/button";
import { BasicArrow } from "~/shared/basic/basic-arrow";
import { useI18n } from "~/hooks/useI18n";

type ButtonOptions = Partial<ButtonProps> & { text: string };

defineOptions({
  name: "FormAction",
  inheritAttrs: false,
});

const emit = defineEmits(["toggle-advanced"]);

const props = defineProps({
  showActionButtonGroup: {
    type: Boolean,
    default: true,
  },
  showResetButton: {
    type: Boolean,
    default: true,
  },
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
  showAdvancedButton: {
    type: Boolean,
    default: true,
  },
  resetButtonOptions: {
    type: Object as PropType<ButtonOptions>,
    default: () => ({}),
  },
  submitButtonOptions: {
    type: Object as PropType<ButtonOptions>,
    default: () => ({}),
  },
  actionColOptions: {
    type: Object as PropType<Partial<ColEx>>,
    default: () => ({}),
  },
  actionSpan: {
    type: Number,
    default: 6,
  },
  isAdvanced: Boolean,
  hideAdvanceBtn: Boolean,
});

const { t } = useI18n();
const { resetFields, submit } = useFormContext();
const actionColOpt = computed(() => {
  const { showAdvancedButton, actionSpan: span, actionColOptions } = props;
  const actionSpan = 24 - span;
  const advancedSpanObj = showAdvancedButton
    ? { span: actionSpan < 6 ? 24 : actionSpan }
    : {};
  const actionColOpt: Partial<ColEx> = {
    style: { textAlign: "right" },
    span: showAdvancedButton ? 6 : 4,
    ...advancedSpanObj,
    ...actionColOptions,
  };
  return actionColOpt;
});

const getResetBtnOptions = computed((): ButtonOptions => {
  return Object.assign(
    {
      text: "Сбросить",
    },
    props.resetButtonOptions,
  );
});

const getSubmitBtnOptions = computed(() => {
  return Object.assign(
    {
      text: "Поиск",
    },
    props.submitButtonOptions,
  );
});

function toggleAdvanced() {
  emit("toggle-advanced", props.isAdvanced);
}

const handleSubmit = async (e: Event) => {
  await submit(e).catch(() => {});
};
</script>

<style lang="scss">
.form-action {
  &__container {
    width: 100%;
    text-align: right;

    &--centered {
      text-align: center;
    }
  }

  &__button {
    margin-right: 0.5rem;

    &--reset {
    }

    &--submit {
    }

    &--advanced {
      size: auto;
    }
  }

  &__icon {
    margin-left: 0.25rem;
  }
}
</style>
