<template>
  <a-card
    :tab-list="tabList"
    :active-tab-key="activeTab"
    @tabChange="(key) => onTabChange(key)"
  >
    <section v-if="activeTab === '1'"><PrintSetting /></section>
    <section v-if="activeTab === '2'"><terminalSetting /></section>
    <section v-if="activeTab === '3'"><DataBaseSetting /></section>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PrintSetting } from "~/widgets/printerSetting";
import { DataBaseSetting } from "~/widgets/databaseSetting";
import { terminalSetting } from "~/widgets/terminalSetting";

const tabList = [
  {
    key: "1",
    tab: "Настройки принтера",
  },
  {
    key: "2",
    tab: "Системные настройки",
  },
  {
    key: "3",
    tab: "Настройки контента",
  },
];

const onTabChange = (value: string) => {
  activeTab.value = value;
};

const activeTab = ref("1");
</script>

<style lang="scss">
.printer-setting {
  > svg {
    width: 16em;
    height: 16em;
  }
}
</style>
