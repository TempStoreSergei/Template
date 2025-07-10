<template>
  <SignInWithGoogle
    :footerClassName="'sign-in-with-google-instance'"
    :headerClassName="'sign-in-with-google-instance'"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SignInWithGoogle from "./components/SignInWithGoogle.vue";

export default defineComponent({
  name: "SignInWithGoogleScreen",
  components: {
    SignInWithGoogle,
  },
});
</script>

<style>
.sign-in-with-google-instance {
  background-color: transparent !important;
}
</style>
