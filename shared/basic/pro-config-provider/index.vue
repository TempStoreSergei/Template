<script setup lang="ts">
import { computed } from "vue";
import { configProviderProps } from "ant-design-vue/es/config-provider/context";
import { merge } from "lodash-es";
import { ConfigProvider } from "ant-design-vue";
import { useLocale } from "~/app/providers/i18/useLocale";
import { useLayoutSettingStore } from "~/entities/store/modules/layoutSetting";

defineOptions({
  name: "ProConfigProvider",
});

const props = defineProps(configProviderProps());

const layoutSetting = useLayoutSettingStore();
const { getAntdLocale } = useLocale();

const theme = computed(() => {
  return merge({}, layoutSetting.themeConfig, props.theme);
});
</script>

<template>
  <ConfigProvider
    v-bind="$props"
    component-size="large"
    :locale="getAntdLocale"
    :theme="{
      token: {
        borderRadius: 6,
        fontSize: 24,
        lineWidth: 2,
        colorBorder: '#1677ff',
        colorSplit: '#1677ff',
        colorBorderSecondary: '#1677ff',
      },
    }"
  >
    <slot />
  </ConfigProvider>
</template>
