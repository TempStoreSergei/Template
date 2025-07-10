<template>
  <div class="action-buttons">
    <span class="action-buttons__item">
      <EnterOutlined class="action-buttons__icon" />
      Confirm
    </span>
    <span class="action-buttons__item">
      <ArrowUpOutlined class="action-buttons__icon" />
      <ArrowDownOutlined class="action-buttons__icon" />
      Switch
    </span>
    <span class="action-buttons__item">
      <CloseOutlined class="action-buttons__icon" />
      Close
    </span>
  </div>
</template>

<script lang="ts" setup>
import {
  EnterOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
</script>

<style lang="scss">
.action-buttons {
  display: flex;
  align-items: center;

  &__item {
    margin-right: 14px;

    &:last-child {
      margin-right: 0;
    }
  }

  &__icon {
    font-size: 15px;
    padding: 2px;
    margin-right: 3px;
    box-shadow:
      inset 0 -2px #cdcde6,
      inset 0 0 1px 1px #fff,
      0 1px 2px 1px rgba(30, 35, 90, 0.4);
  }
}
</style>
