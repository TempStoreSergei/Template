<template>
    <div :class="['footer-button', className]">
      <div class="button-text">{{ text }}</div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "FooterButton",
    props: {
      state: {
        type: String,
        required: true,
      },
      className: {
        type: String,
        default: "",
      },
      text: {
        type: String,
        default: "Button Text",
      },
    },
  });
  </script>
  
  <style>
  .footer-button {
    align-items: flex-start;
    border-radius: 2px;
    display: inline-flex;
    gap: 10px;
    padding: 6px 16px;
    position: relative;
  }
  
  .footer-button .button-text {
    color: #757575;
    font-family: "Roboto", Helvetica;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 16.8px;
    margin-top: -1.00px;
    position: relative;
    text-align: center;
    white-space: nowrap;
    width: fit-content;
  }
  </style>
  