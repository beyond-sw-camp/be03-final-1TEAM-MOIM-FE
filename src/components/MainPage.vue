<template>
  <v-app class="rounded rounded-md">
    <AppHeader></AppHeader>
    <AppSideBar></AppSideBar>
    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      Main Content
    </v-main>
  </v-app>
</template>

<script setup>
import AppSideBar from "@/components/layout/AppSideBar.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
</script>

<style scoped>

</style>