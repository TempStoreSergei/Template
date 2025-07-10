<template>
    <div :class="['account-option', className]">
      <div class="account-details">
        <ProfilePicture />
        <div class="account-info">
          <div class="text-wrapper-2">Account Name</div>
          <div class="text-wrapper-3">email@gmail.com</div>
        </div>
      </div>
      <div class="element-border-bottom">
        <div class="rectangle" />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import ProfilePicture from "./ProfilePicture.vue";
  
  export default defineComponent({
    name: "AccountOption",
    components: {
      ProfilePicture
    },
    props: {
      state: {
        type: String,
        default: "default",
      },
      className: {
        type: String,
        default: "",
      },
    },
  });
  </script>
  
  <style>
  .account-option {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    position: relative;
    width: 310px;
  }
  
  .account-option .account-details {
    align-items: center;
    align-self: stretch;
    display: flex;
    flex: 0 0 auto;
    gap: 12px;
    padding: 12px 40px;
    position: relative;
    width: 100%;
  }
  
  .account-option .account-info {
    align-items: flex-start;
    display: flex;
    flex: 1;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
  }
  
  .account-option .text-wrapper-2 {
    align-self: stretch;
    color: #3c4043;
    font-family: "Roboto", Helvetica;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 20px;
    margin-top: -1.00px;
    position: relative;
  }
  
  .account-option .text-wrapper-3 {
    align-self: stretch;
    color: #5f6368;
    font-family: "Roboto", Helvetica;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 16px;
    position: relative;
  }
  
  .account-option .element-border-bottom {
    align-items: flex-start;
    align-self: stretch;
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    gap: 10px;
    padding: 0px 40px;
    position: relative;
    width: 100%;
  }
  
  .account-option .rectangle {
    align-self: stretch;
    background-color: #dadce0;
    height: 1px;
    position: relative;
    width: 100%;
  }
  </style>
  