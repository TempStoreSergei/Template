<template>
  <header>
    <nav>
      <ul>
        <li><NuxtLink to="/test">About</NuxtLink></li>
        <li><NuxtLink to="/">Post 1</NuxtLink></li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
  const test = 1;
</script>

<style lang="scss">
.admin-page {
  flex: 1;
}
</style>
