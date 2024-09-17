<template>
  <Select
    v-bind="getProps"
    :options="getOptions"
    @dropdown-visible-change="handleFetch"
    @change="handleChange"
  >
    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot :name="item" v-bind="data || {}" />
    </template>
    <template v-if="loading" #suffixIcon>
      <LoadingOutlined spin />
    </template>
    <template v-if="loading" #notFoundContent>
      <span class="api-select__loading-content">
        <LoadingOutlined spin class="api-select__loading-icon" />
        {{ t("component.form.apiSelectNotFound") }}
      </span>
    </template>
  </Select>
</template>

<script lang="ts" setup>
import { ref, watchEffect, computed, unref, watch } from "vue";
import { get, omit } from "lodash-es";
import { LoadingOutlined } from "@ant-design/icons-vue";
import { selectProps } from "ant-design-vue/es/select";
import { Select } from "ant-design-vue";
import type { PropType } from "vue";
import { isFunction } from "~/shared/utils/is";
import { useI18n } from "~/hooks/useI18n";
import { propTypes } from "~/shared/utils/propTypes";

type OptionsItem = { label: string; value: string; disabled?: boolean };

defineOptions({
  name: "ApiSelect",
  inheritAttrs: false,
});

const props = defineProps({
  ...selectProps(),
  value: [Array, Object, String, Number],
  numberToString: propTypes.bool,
  api: {
    type: Function as PropType<(arg?: Recordable) => Promise<any>>,
    default: null,
  },
  params: {
    type: Object as PropType<Recordable>,
    default: () => ({}),
  },
  resultField: propTypes.string.def(""),
  labelField: propTypes.string.def("label"),
  valueField: propTypes.string.def("value"),
  immediate: propTypes.bool.def(true),
  alwaysLoad: propTypes.bool.def(false),
});

const emit = defineEmits(["options-change", "change"]);

const options = ref<OptionsItem[]>([]);
const loading = ref(false);
const isFirstLoad = ref(true);
const emitData = ref<any[]>([]);
const { t } = useI18n();

const getProps = computed(() => props as Recordable);

const getOptions = computed(() => {
  const { labelField, valueField, numberToString } = props;
  return unref(options).reduce<OptionsItem[]>((prev, next) => {
    if (next) {
      const value = numberToString ? `${next[valueField]}` : next[valueField];
      prev.push({
        ...omit(next, [labelField, valueField]),
        label: next[labelField],
        value,
      });
    }
    return prev;
  }, []);
});

watchEffect(() => {
  if (props.immediate && !props.alwaysLoad) fetch();
});

watch(
  () => props.params,
  () => {
    if (!unref(isFirstLoad)) fetch();
  },
  { deep: true },
);

const fetch = async () => {
  if (!props.api || !isFunction(props.api)) return;
  options.value = [];
  try {
    loading.value = true;
    const res = await props.api(props.params);
    if (Array.isArray(res)) {
      options.value = res;
    } else if (props.resultField) {
      options.value = get(res, props.resultField) || [];
    }
    emit("options-change", unref(getOptions));
  } catch (error) {
    console.warn(error);
  } finally {
    loading.value = false;
  }
};

const handleFetch = async (visible: boolean) => {
  if (visible) {
    if (props.alwaysLoad) {
      await fetch();
    } else if (!props.immediate && unref(isFirstLoad)) {
      await fetch();
      isFirstLoad.value = false;
    }
  }
};

const handleChange = (_: unknown, ...args: any[]) => {
  emitData.value = args;
};
</script>

<style scoped lang="scss">
.api-select {
  &__loading-content {
    display: flex;
    align-items: center;
  }

  &__loading-icon {
    margin-right: 0.5rem;
  }
}
</style>
