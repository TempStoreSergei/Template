<template>
    <div class="profile-picture">
      <div class="div">A</div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "ProfilePicture",
  });
  </script>
  
  <style>
  .profile-picture {
    background-color: #7b1fa2;
    border-radius: 14px;
    height: 28px;
    position: relative;
    width: 28px;
  }
  
  .profile-picture .div {
    color: #ffffff;
    font-family: "Roboto", Helvetica;
    font-size: 15px;
    font-weight: 400;
    height: 18px;
    left: 0;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 4px;
    width: 28px;
  }
  </style>
  